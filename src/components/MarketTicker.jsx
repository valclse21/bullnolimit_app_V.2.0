import { useEffect, useRef } from "react";

const MarketTicker = () => {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
    {
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": true,
      "locale": "id",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "width": "100%",
      "height": "100%",
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(255, 74, 104, 1)",
      "gridLineColor": "rgba(240, 243, 250, 0)",
      "scaleFontColor": "rgba(120, 123, 134, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(255, 74, 104, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(255, 74, 104, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
      "tabs": [
        {
          "title": "Indices",
          "symbols": [
            { "s": "OANDA:XAUUSD", "d": "GOLD (XAU/USD)" },
            { "s": "BITSTAMP:BTCUSD", "d": "BITCOIN (USD)" },
            { "s": "FX:EURUSD", "d": "EUR/USD" },
            { "s": "FX_IDC:USDIDR", "d": "USD/IDR" }
          ],
          "originalTitle": "Indices"
        }
      ]
    }`;
    container.current.appendChild(script);

    return () => {
      if (container.current && container.current.firstChild) {
        container.current.removeChild(container.current.firstChild);
      }
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "130px", width: "100%" }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default MarketTicker;
