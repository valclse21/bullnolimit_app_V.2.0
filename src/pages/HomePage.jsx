import { useState, useEffect } from "react";
import MarketCard from "../components/MarketCard";
import TradingViewWidget from "../components/TradingViewWidget";
import { TWELVE_DATA_API_KEY } from "../api/keys";

const HomePage = ({ user }) => {
  const [marketData, setMarketData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("BITSTAMP:BTCUSD");

  const symbols = [
    { name: "GOLD (XAU/USD)", symbol: "XAU/USD", tvSymbol: "OANDA:XAUUSD" },
    { name: "BITCOIN (USD)", symbol: "BTC/USD", tvSymbol: "BITSTAMP:BTCUSD" },
    { name: "EUR/USD", symbol: "EUR/USD", tvSymbol: "FX:EURUSD" },
    { name: "USD/IDR", symbol: "USD/IDR", tvSymbol: "FX_IDC:USDIDR" },
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      const symbolString = symbols.map((s) => s.symbol).join(",");
      try {
        const response = await fetch(
          `https://api.twelvedata.com/quote?symbol=${symbolString}&apikey=${TWELVE_DATA_API_KEY}`
        );
        const data = await response.json();

        const formattedData = Array.isArray(data.data)
          ? data.data.reduce(
              (acc, item) => ({ ...acc, [item.symbol]: item }),
              {}
            )
          : data;

        setMarketData(formattedData);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      }
      setIsLoading(false);
    };

    fetchMarketData();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">
            Selamat datang kembali, {user.displayName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {symbols.map((item) => (
          <div
            key={item.symbol}
            onClick={() => setSelectedSymbol(item.tvSymbol)}
            className="cursor-pointer"
          >
            <MarketCard
              data={{
                name: item.name,
                price: marketData[item.symbol]?.close || "0.00",
                change: marketData[item.symbol]?.change || "0.00",
                percent_change:
                  marketData[item.symbol]?.percent_change || "0.00",
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-1 aspect-video">
        <TradingViewWidget key={selectedSymbol} symbol={selectedSymbol} />
      </div>
    </>
  );
};

export default HomePage;
