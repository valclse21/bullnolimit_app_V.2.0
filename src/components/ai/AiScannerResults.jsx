const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-white border-l-4 border-indigo-500 pl-3 mb-3">{title}</h3>
    <div className="bg-slate-800/30 p-4 rounded-lg">
      {children}
    </div>
  </div>
);

const ReportRow = ({ label, value, valueClass = 'text-white' }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`text-sm font-mono ${valueClass}`}>{value}</p>
  </div>
);

const AiScannerResults = ({ report, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="text-center p-8 text-slate-400">
        <p>Menganalisis chart Anda... Ini mungkin memakan waktu beberapa saat.</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-400">Terjadi kesalahan: {error}</div>;
  }

  if (!report) {
    return (
      <div className="text-center p-8 text-slate-500">
        <p>Belum ada laporan. Silakan unggah chart dan jalankan analisis.</p>
      </div>
    );
  }

  const { tradingParameters, trendAnalysis, keyMetrics, keyPriceLevels, tradingStrategy, pairName, timeframe, currentPrice } = report;

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Technical Analysis Report</h2>
        <p className="text-xs text-slate-500">Generated on {new Date().toLocaleString('id-ID')}</p>
      </div>
      <div className="mb-6 p-4 bg-slate-900/50 rounded-lg">
        <h3 className="text-xl font-bold text-white">{pairName}</h3>
        <p className="text-sm text-slate-400">Timeframe: {timeframe} | Current Price: <span className="font-mono">{currentPrice}</span></p>
      </div>

      {/* Trading Parameters */}
      <Section title="Trading Parameters">
        <ReportRow label="Entry Zone" value={tradingParameters.entryZone} />
        <ReportRow label="Take Profit 1" value={tradingParameters.takeProfit1} valueClass="text-green-400" />
        <ReportRow label="Take Profit 2" value={tradingParameters.takeProfit2} valueClass="text-green-400" />
        <ReportRow label="Stop Loss" value={tradingParameters.stopLoss} valueClass="text-red-400" />
      </Section>

      {/* Trend Analysis & Key Metrics */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white border-l-4 border-indigo-500 pl-3 mb-3">Trend Analysis</h3>
          <div className={`p-4 rounded-lg text-center font-bold text-lg ${trendAnalysis === 'Bullish' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {trendAnalysis}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white border-l-4 border-indigo-500 pl-3 mb-3">Key Metrics</h3>
          <div className="bg-slate-800/30 p-4 rounded-lg">
            <ReportRow label="Chart Pattern" value={keyMetrics.chartPattern} />
            <ReportRow label="Risk Level" value={keyMetrics.riskLevel} />
            <ReportRow label="Price Target" value={keyMetrics.priceTarget} />
          </div>
        </div>
      </div>

      {/* Key Price Levels */}
      <Section title="Key Price Levels">
        <div className="grid md:grid-cols-2 gap-x-6">
          <div>
            <h4 className="font-bold text-green-400 mb-2">Support</h4>
            {keyPriceLevels.support.map((level, i) => <ReportRow key={`sup-${i}`} label={`Support ${i + 1}`} value={level} valueClass="text-green-300" />)}
          </div>
          <div>
            <h4 className="font-bold text-red-400 mb-2">Resistance</h4>
            {keyPriceLevels.resistance.map((level, i) => <ReportRow key={`res-${i}`} label={`Resistance ${i + 1}`} value={level} valueClass="text-red-300" />)}
          </div>
        </div>
      </Section>

      {/* Trading Strategy */}
      <Section title="Trading Strategy">
        <p className="text-sm text-slate-300 leading-relaxed">{tradingStrategy}</p>
      </Section>
    </div>
  );
};

export default AiScannerResults;
