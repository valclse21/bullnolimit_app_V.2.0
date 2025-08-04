const MarketCard = ({ data }) => {
  if (!data || !data.price) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-8 bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  const isPositive = parseFloat(data.change) >= 0;
  const changeClass = isPositive ? "text-green-400" : "text-red-400";

  const ArrowIcon = isPositive ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z"
        clipRule="evenodd"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M10 3a.75.75 0 01.75.75v10.638l4.22-4.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l4.22 4.22V3.75A.75.75 0 0110 3z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
      <div className="flex justify-between items-center text-sm text-slate-400">
        <span>{data.name}</span>
        <span
          className={`flex items-center gap-1 font-semibold ${changeClass}`}
        >
          {ArrowIcon}
          {parseFloat(data.percent_change).toFixed(3)}%
        </span>
      </div>
      <p className="text-3xl font-bold text-white mt-1">{data.price}</p>
    </div>
  );
};

export default MarketCard;
