import { useState } from 'react';

const AiScannerForm = ({ onScan, isLoading }) => {
  const [pairName, setPairName] = useState('XAU/USD');
  const [timeframe, setTimeframe] = useState('H1');
  const [currentPrice, setCurrentPrice] = useState('');
  const [chartImage, setChartImage] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChartImage(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chartImage) {
      alert('Silakan unggah screenshot chart.');
      return;
    }
    // Menggunakan FormData untuk mengirim file dan data teks
    const formData = new FormData();
    formData.append('pairName', pairName);
    formData.append('timeframe', timeframe);
    formData.append('currentPrice', currentPrice);
    formData.append('chartImage', chartImage);

    onScan(formData);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Analisis Chart dengan AI</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nama Pair</label>
            <input 
              type="text" 
              value={pairName} 
              onChange={(e) => setPairName(e.target.value)} 
              placeholder="Contoh: XAU/USD"
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Timeframe</label>
            <input 
              type="text" 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value)} 
              placeholder="Contoh: H1, D1"
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Harga Saat Ini</label>
            <input 
              type="text" 
              value={currentPrice} 
              onChange={(e) => setCurrentPrice(e.target.value)} 
              placeholder="Contoh: 1950.75"
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Screenshot Chart</label>
            <label htmlFor="chart-upload" className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 flex items-center justify-center cursor-pointer hover:bg-slate-700">
              <span className="text-sm text-slate-400">{fileName || 'Pilih file...'}</span>
            </label>
            <input 
              id="chart-upload"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !chartImage}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Menganalisis...' : 'Analisis Chart Sekarang'}
        </button>
      </form>
    </div>
  );
};

export default AiScannerForm;
