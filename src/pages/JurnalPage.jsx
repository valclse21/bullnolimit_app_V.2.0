import { useMemo } from 'react';
import StatCard from "../components/StatCard";
import TradeTable from "../components/TradeTable";
import EquityChart from "../components/EquityChart";

const JurnalPage = ({
  user,
  onAddTrade,
  initialCapital,
  capitalInput,
  handleSetInitialCapital,
  trades,
  isLoading,
  handleEdit,
  handleDelete,
}) => {

  const stats = useMemo(() => {
    const calculateGrossProfit = (trade) => {
      if (!trade.pair) return 0; // Guard clause

      const pnlPoints =
        trade.arahPosisi === "Beli"
          ? parseFloat(trade.hargaExit) - parseFloat(trade.hargaEntry)
          : parseFloat(trade.hargaEntry) - parseFloat(trade.hargaExit);
      const lotSize = parseFloat(trade.lotSize) || 0;
      const pair = trade.pair.toUpperCase();
      const entryPrice = parseFloat(trade.hargaEntry);
      const exitPrice = parseFloat(trade.hargaExit);

      // Kategori 1: Forex (USD as Quote, e.g., EUR/USD)
      if (pair.endsWith('/USD')) {
        return pnlPoints * lotSize * 100000;
      }

      // Kategori 2: Forex (USD as Base, e.g., USD/JPY)
      if (pair.startsWith('USD/')) {
        const pipSize = pair.includes('JPY') ? 0.01 : 0.0001;
        const pips = pnlPoints / pipSize;
        const pipValue = (pipSize / exitPrice) * lotSize * 100000;
        return pips * pipValue;
      }

      // Kategori 3: Forex Crosses (e.g., EUR/JPY)
      // Note: Ini adalah penyederhanaan. Perhitungan akurat memerlukan harga quote currency ke USD.
      // Untuk saat ini, kita asumsikan nilai pip $10 untuk pair JPY dan lainnya.
      if (pair.includes('/')) { // Fallback untuk cross pairs
        const contractSize = pair.includes('JPY') ? 1000 : 100000;
        return pnlPoints * lotSize * contractSize * (1 / exitPrice); // Estimasi kasar
      }

      // Kategori 4: XAU/USD (Emas)
      if (pair.includes('XAU') || pair.includes('GOLD')) {
        return pnlPoints * lotSize * 100; // Kontrak 100 troy ounces
      }

      // Kategori 5: Indeks (e.g., US30, NAS100)
      if (['US30', 'NAS100', 'SPX500', 'GER30'].some((p) => pair.includes(p))) {
        return pnlPoints * lotSize * 1; // Nilai per poin
      }
      
      // Kategori 6: Crypto (e.g., BTC/USD)
      if (['BTC/USD', 'ETH/USD'].some((p) => pair.includes(p))) {
        return pnlPoints * lotSize; // 1 lot = 1 coin
      }

      // Fallback/Default (asumsi seperti EUR/USD)
      return pnlPoints * lotSize * 100000;
    };

    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0, totalProfitUSD: 0, winningTrades: 0, winRate: "0.0",
        currentBalance: initialCapital, accountGrowth: 0, chartData: [],
      };
    }

    const tradesWithPnl = trades.map((trade) => {
      const grossPnl = calculateGrossProfit(trade);
      const commission = parseFloat(trade.commission) || 0;
      const swap = parseFloat(trade.swap) || 0;
      const netPnl = grossPnl - commission - swap;
      return { ...trade, pnl: grossPnl, netPnl };
    });

    const totalNetProfit = tradesWithPnl.reduce((acc, trade) => acc + trade.netPnl, 0);
    const winningTrades = tradesWithPnl.filter((trade) => trade.netPnl > 0).length;
    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const currentBalance = initialCapital + totalNetProfit;
    const accountGrowth = initialCapital > 0 ? (totalNetProfit / initialCapital) * 100 : 0;

    const chartData = tradesWithPnl.reduce((acc, trade, index) => {
      const previousBalance = index === 0 ? initialCapital : acc[index - 1]?.balance || initialCapital;
      acc.push({ tradeNumber: index + 1, balance: previousBalance + trade.netPnl });
      return acc;
    }, []);

    return {
      totalTrades, totalProfitUSD: totalNetProfit, winningTrades,
      winRate: winRate.toFixed(1), currentBalance, accountGrowth, chartData,
    };
  }, [trades, initialCapital]);

  if (!user) {
    return <div>Loading user data...</div>; 
  }

  const { totalTrades, winRate, totalProfitUSD, currentBalance, accountGrowth, chartData } = stats;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Jurnal Trading</h1>
          <p className="text-slate-400 mt-1">Catat dan analisis performa trading Anda.</p>
        </div>
      </div>
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center gap-4">
        <label htmlFor="initial-capital" className="font-medium text-slate-300">
          Modal Awal (USD):
        </label>
        <input
          type="number"
          id="initial-capital"
          value={capitalInput}
          onChange={(e) => handleSetInitialCapital(e.target.value, true)}
          onBlur={(e) => handleSetInitialCapital(e.target.value, false)}
          className="bg-slate-700 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={() => handleSetInitialCapital(capitalInput, false)}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Simpan Modal
        </button>
        <button
          onClick={onAddTrade}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          + Tambah Trade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Modal Awal" value={initialCapital} isCurrency={true} />
        <StatCard
          title="Saldo Saat Ini"
          value={currentBalance}
          isCurrency={true}
        />
        <StatCard
          title="Pertumbuhan Akun"
          value={accountGrowth}
          isPercentage={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Trades" value={totalTrades} />
        <StatCard title="Win Rate" value={`${winRate}%`} />
        <StatCard
          title="Total P/L (USD)"
          value={totalProfitUSD}
          isCurrency={true}
        />
      </div>

      <TradeTable
        trades={[...trades].reverse()}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EquityChart data={chartData} />
    </>
  );
};

export default JurnalPage;
