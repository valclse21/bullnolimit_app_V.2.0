const StatCard = ({
  title,
  value,
  description,
  isCurrency = false,
  isPercentage = false,
}) => {
  // Guard clause to ensure value is a valid number
  const numericValue = typeof value === 'number' && !isNaN(value) ? value : 0;

  const valueClass = numericValue >= 0 ? 'text-green-400' : 'text-red-400';

  const formattedValue = isCurrency
    ? `$${Math.abs(numericValue).toFixed(2)}`
    : isPercentage
    ? `${numericValue.toFixed(2)}%`
    : numericValue;

  const sign =
    typeof numericValue === 'number' && (isCurrency || isPercentage) && numericValue > 0
      ? '+'
      : '';

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
