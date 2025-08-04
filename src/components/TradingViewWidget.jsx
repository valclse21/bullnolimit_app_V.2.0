import { useEffect, useRef, memo } from "react";

const TradingViewWidget = ({ symbol }) => {
  const container = useRef();

  useEffect(() => {
    const containerNode = container.current;
    if (!containerNode) return;

    // Hapus skrip sebelumnya jika ada untuk mencegah duplikasi
    const existingScript = containerNode.querySelector('script');
    if (existingScript) {
      containerNode.removeChild(existingScript);
    }

    // Hapus iframe widget sebelumnya
    const existingIframe = containerNode.querySelector('iframe');
    if (existingIframe) {
        containerNode.removeChild(existingIframe);
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": symbol,
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "id",
        "enable_publishing": false,
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "details": true,
        "hotlist": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });

    containerNode.appendChild(script);

    return () => {
      // Cleanup saat komponen di-unmount
      if (containerNode.contains(script)) {
        containerNode.removeChild(script);
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full w-full"></div>
    </div>
  );
};

export default memo(TradingViewWidget);
