import { useState, useEffect, useMemo, useCallback } from "react";
import { auth, db } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import JurnalPage from "./pages/JurnalPage";
import ProfilePage from "./pages/ProfilePage"; // Impor halaman profil
import BeritaPage from "./pages/BeritaPage";
import ForumPage from "./pages/ForumPage";
import AiScannerPage from './pages/AiScannerPage';
import AnalisAIPage from "./pages/AnalisAIPage"; // Impor halaman baru
import TradeModal from "./components/TradeModal";
import BottomNav from "./components/BottomNav";
import ProfileDropdown from "./components/ProfileDropdown"; // <-- Impor komponen baru

function App() {
  const [user, setUser] = useState(null);
  const [authIsReady, setAuthIsReady] = useState(false);
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [initialCapital, setInitialCapital] = useState(0);
  const [capitalInput, setCapitalInput] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthIsReady(true);
      if (!user) {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let tradesUnsubscribe = null;
    let capitalUnsubscribe = null;

    if (user) {
      setIsLoading(true);

      const capitalRef = doc(db, "capitals", user.uid);
      capitalUnsubscribe = onSnapshot(capitalRef, (docSnap) => {
        if (docSnap.exists()) {
          const capitalAmount = docSnap.data().amount;
          setInitialCapital(capitalAmount);
          setCapitalInput(capitalAmount.toString());
        } else {
          setInitialCapital(0);
          setCapitalInput("0");
        }
      });

      const q = query(
        collection(db, "trades", user.uid, "userTrades"),
        orderBy("timestamp", "asc")
      );
      tradesUnsubscribe = onSnapshot(q, (querySnapshot) => {
        const tradesData = [];
        querySnapshot.forEach((doc) => {
          tradesData.push({ ...doc.data(), id: doc.id });
        });
        setTrades(tradesData);
        setIsLoading(false);
      });
    } else {
      setTrades([]);
      setInitialCapital(0);
      setCapitalInput("");
    }

    return () => {
      if (tradesUnsubscribe) tradesUnsubscribe();
      if (capitalUnsubscribe) capitalUnsubscribe();
    };
  }, [user]);

  const handleSetInitialCapital = async (value, isTyping) => {
    if (isTyping) {
      setCapitalInput(value);
      return;
    }
    const newCapital = parseFloat(value);
    if (isNaN(newCapital) || newCapital < 0) {
      alert("Mohon masukkan angka yang valid.");
      return;
    }
    if (user) {
      const capitalRef = doc(db, "capitals", user.uid);
      try {
        await setDoc(capitalRef, { amount: newCapital });
      } catch (error) {
        console.error("Error saving initial capital: ", error);
      }
    }
  };

  const handleDelete = async (tradeId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus trade ini?")) {
      try {
        const tradeRef = doc(db, "trades", user.uid, "userTrades", tradeId);
        await deleteDoc(tradeRef);
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Gagal menghapus trade.");
      }
    }
  };

  const handleEdit = (trade) => {
    setEditingTrade(trade);
    setIsModalOpen(true);
  };

  const handleAddTrade = useCallback(() => {
    setEditingTrade(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrade(null);
  };

  const stats = useMemo(() => {
    const contractSize = 100;
    const totalTrades = trades.length;

    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        totalProfitUSD: 0,
        winningTrades: 0,
        winRate: "0.0",
        currentBalance: initialCapital,
        accountGrowth: 0,
        chartData: [],
      };
    }

    const totalProfitUSD = trades.reduce((acc, trade) => {
      const pnlPoints =
        trade.arahPosisi === "Beli"
          ? trade.hargaExit - trade.hargaEntry
          : trade.hargaEntry - trade.hargaExit;
      const pnlUSD = pnlPoints * (trade.lotSize || 0) * contractSize;
      return acc + pnlUSD;
    }, 0);

    const winningTrades = trades.filter((trade) => {
      const pnlPoints =
        trade.arahPosisi === "Beli"
          ? trade.hargaExit - trade.hargaEntry
          : trade.hargaEntry - trade.hargaExit;
      const pnlUSD = pnlPoints * (trade.lotSize || 0) * contractSize;
      return pnlUSD > 0;
    }).length;

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const currentBalance = initialCapital + totalProfitUSD;
    const accountGrowth =
      initialCapital > 0 ? (totalProfitUSD / initialCapital) * 100 : 0;

    const chartData = trades.reduce((acc, trade, index) => {
      const pnlPoints =
        trade.arahPosisi === "Beli"
          ? trade.hargaExit - trade.hargaEntry
          : trade.hargaEntry - trade.hargaExit;
      const pnlUSD = pnlPoints * (trade.lotSize || 0) * contractSize;
      const previousBalance =
        index === 0
          ? initialCapital
          : acc[index - 1]?.balance || initialCapital;
      acc.push({
        tradeNumber: index + 1,
        balance: previousBalance + pnlUSD,
      });
      return acc;
    }, []);

    return {
      totalTrades,
      totalProfitUSD,
      winningTrades,
      winRate: winRate.toFixed(1),
      currentBalance,
      accountGrowth,
      chartData,
    };
  }, [trades, initialCapital]);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage user={user} />;
      case "profil":
        return <ProfilePage user={user} />;
      case "jurnal":
        return (
          <JurnalPage
            user={user}
            onAddTrade={handleAddTrade}
            initialCapital={initialCapital}
            capitalInput={capitalInput}
            handleSetInitialCapital={handleSetInitialCapital}
            trades={trades}
            isLoading={isLoading}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            {...stats} // pass all calculated stats
          />
        );
      case "berita":
        return <BeritaPage />;
      case "analis":
        return <AnalisAIPage />;
      case "scanner":
        return <AiScannerPage />;
      case "forum":
        return <ForumPage />;
      default:
        return <HomePage user={user} />;
    }
  };

  if (!authIsReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center text-white">
        <img src="/logo.svg" alt="BullNoLimit Logo" className="h-20 w-auto mb-6" />
        <h1 className="text-4xl font-bold tracking-wider">BullNoLimit</h1>
        <p className="text-slate-400 mt-2 animate-pulse">Loading your experience...</p>
      </div>
    );
  }

  return (
    <>
      {!user && <LoginPage />}
      {user && (
        <div className="relative bg-slate-900 min-h-screen text-slate-300">
          <div className="absolute top-4 right-4 z-50">
            <ProfileDropdown user={user} setActiveTab={setActiveTab} />
          </div>
          <main className="max-w-7xl mx-auto py-10 px-4 pb-28">
            {renderContent()}
          </main>
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          <TradeModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            editingTrade={editingTrade}
            userId={user.uid}
          />
        </div>
      )}
    </>
  );
}

export default App;
