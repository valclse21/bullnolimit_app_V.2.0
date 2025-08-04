import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-4 border border-slate-600 rounded-lg shadow-lg">
        <p className="label text-slate-300">{`Trade #${label}`}</p>
        <p className="intro text-blue-400 font-bold">{`Saldo: $${payload[0].value.toFixed(
          2
        )}`}</p>
      </div>
    );
  }
  return null;
};

const EquityChart = ({ data }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-md mt-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">
        Grafik Pertumbuhan Akun
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis
            dataKey="tradeNumber"
            stroke="#94a3b8"
            label={{
              value: "Jumlah Trade",
              position: "insideBottom",
              offset: -10,
              fill: "#94a3b8",
            }}
          />
          <YAxis
            stroke="#94a3b8"
            domain={["dataMin - 100", "dataMax + 100"]}
            tickFormatter={(tick) => `$${tick}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: "#e2e8f0" }} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ r: 4, fill: "#60a5fa" }}
            activeDot={{ r: 8 }}
            name="Saldo Akun"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquityChart;
