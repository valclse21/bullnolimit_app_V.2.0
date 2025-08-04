const TradeTableRow = ({ trade, onEdit, onDelete }) => {
  const contractSize = 100;

  const pnlPoints =
    trade.arahPosisi === "Beli"
      ? trade.hargaExit - trade.hargaEntry
      : trade.hargaEntry - trade.hargaExit;

  const pnlUSD = pnlPoints * (trade.lotSize || 0) * contractSize;

  const pnlClass = pnlUSD >= 0 ? "text-green-500" : "text-red-500";
  const pnlSign = pnlUSD >= 0 ? "+" : "";

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
      <td className="py-3 px-4 text-slate-400">
        {trade.timestamp?.toDate().toLocaleDateString("id-ID")}
      </td>
      <td className="py-3 px-4 font-medium text-slate-200">{trade.aset}</td>
      <td className="py-3 px-4 text-slate-400">{trade.arahPosisi}</td>
      <td className="py-3 px-4 text-slate-400">{trade.lotSize || "-"}</td>
      <td className={`py-3 px-4 font-mono ${pnlClass}`}>
        {pnlSign}${pnlUSD.toFixed(2)}
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
    <div className="bg-slate-800 shadow-md rounded-lg overflow-hidden border border-slate-700">
      <table className="w-full text-sm text-left text-slate-400">
        <thead className="text-xs text-slate-300 uppercase bg-slate-700/50">
          <tr>
            <th scope="col" className="py-3 px-4">
              Tanggal
            </th>
            <th scope="col" className="py-3 px-4">
              Aset
            </th>
            <th scope="col" className="py-3 px-4">
              Posisi
            </th>
            <th scope="col" className="py-3 px-4">
              Ukuran
            </th>
            <th scope="col" className="py-3 px-4">
              P/L (USD)
            </th>
            <th scope="col" className="py-3 px-4">
              Catatan
            </th>
            <th scope="col" className="py-3 px-4">
              Aksi
            </th>
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
              <td colSpan="7" className="text-center py-10 text-slate-500">
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
