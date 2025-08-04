const StatCard = ({
  title,
  value,
  description,
  isCurrency = false,
  isPercentage = false,
}) => {
  const valueClass =
    typeof value === "number"
      ? value >= 0
        ? "text-green-400"
        : "text-red-400"
      : "text-slate-200";

  const formattedValue = isCurrency
    ? `$${Math.abs(value).toFixed(2)}`
    : isPercentage
    ? `${value.toFixed(2)}%`
    : value;

  const sign =
    typeof value === "number" && (isCurrency || isPercentage) && value > 0
      ? "+"
      : "";

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <p className={`text-3xl font-bold mt-2`}>
        <span className={valueClass}>
          {sign}
          {formattedValue}
        </span>
      </p>
      {description && (
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
