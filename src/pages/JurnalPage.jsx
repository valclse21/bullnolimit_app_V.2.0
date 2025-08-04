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
    const calculateProfit = (trade) => {
      if (!trade.pair) return 0; // Guard clause to prevent crash

      const pnlPoints =
        trade.arahPosisi === "Beli"
          ? parseFloat(trade.hargaExit) - parseFloat(trade.hargaEntry)
          : parseFloat(trade.hargaEntry) - parseFloat(trade.hargaExit);
      const lotSize = parseFloat(trade.lotSize) || 0;
      const pair = trade.pair.toUpperCase();

      if (['EUR/USD', 'GBP/USD', 'AUD/USD', 'NZD/USD'].some(p => pair.includes(p))) {
        return pnlPoints * lotSize * 100000;
      }
      if (['USD/JPY', 'USD/CAD', 'USD/CHF'].some(p => pair.includes(p))) {
        const pipValue = (0.01 / parseFloat(trade.hargaExit)) * lotSize * 100000;
        const pips = pnlPoints / 0.01;
        return pips * pipValue;
      }
      if (pair.includes('XAU/USD') || pair.includes('GOLD')) {
        return pnlPoints * lotSize * 100;
      }
      if (['US30', 'NAS100', 'SPX500', 'GER30'].some(p => pair.includes(p))) {
        return pnlPoints * lotSize * 1;
      }
      return pnlPoints * lotSize * 100000;
    };

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

    const tradesWithPnl = trades.map(trade => ({...trade, pnl: calculateProfit(trade)}));
    const totalProfitUSD = tradesWithPnl.reduce((acc, trade) => acc + trade.pnl, 0);
    const winningTrades = tradesWithPnl.filter(trade => trade.pnl > 0).length;
    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const currentBalance = initialCapital + totalProfitUSD;
    const accountGrowth = initialCapital > 0 ? (totalProfitUSD / initialCapital) * 100 : 0;

    const chartData = tradesWithPnl.reduce((acc, trade, index) => {
      const previousBalance = index === 0 ? initialCapital : acc[index - 1]?.balance || initialCapital;
      acc.push({ tradeNumber: index + 1, balance: previousBalance + trade.pnl });
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
