const TradeTableRow = ({ trade, onEdit, onDelete }) => {
  // P/L kotor (dari pergerakan harga) sudah dihitung di JurnalPage
  const grossPnl = trade.pnl || 0;
  const commission = trade.commission || 0;
  const swap = trade.swap || 0;
  const netPnl = grossPnl - commission - swap;

  const pnlClass = netPnl >= 0 ? "text-green-500" : "text-red-500";
  const pnlSign = netPnl >= 0 ? "+" : "";

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
        {trade.timestamp?.toDate().toLocaleDateString("id-ID")}
      </td>
      <td className="py-3 px-4 font-medium text-slate-200">{trade.pair}</td>
      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{trade.arahPosisi}</td>
      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{trade.lotSize || "-"}</td>
      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{commission || "-"}</td>
      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{swap || "-"}</td>
      <td className={`py-3 px-4 font-mono ${pnlClass}`}>
        {pnlSign}${netPnl.toFixed(2)}
      </td>
      <td className="py-3 px-4 text-slate-500 text-sm">{trade.catatan}</td>
      <td className="py-3 px-4">
        <div className="flex gap-4">
          <button
            onClick={() => onEdit(trade)}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(trade.id)}
            className="text-red-400 hover:text-red-300 font-medium"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const TradeTable = ({ trades, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return <div className="text-center p-10">Memuat data...</div>;
  }

  return (
    <div className="bg-slate-800 shadow-md rounded-lg border border-slate-700 overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-400">
        <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
          <tr>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">Tanggal</th>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">Pair</th>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">Posisi</th>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">Ukuran</th>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">Komisi</th>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">Swap</th>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">P/L Bersih</th>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">Catatan</th>
            <th scope="col" className="py-3 px-4 whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {trades.length > 0 ? (
            trades.map((trade) => (
              <TradeTableRow
                key={trade.id}
                trade={trade}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-10 text-slate-500">
                Belum ada data trade.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTable;
