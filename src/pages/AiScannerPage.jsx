import { useState } from 'react';
import axios from 'axios';
import AiScannerForm from '../components/ai/AiScannerForm';
import AiScannerResults from '../components/ai/AiScannerResults';

const AiScannerPage = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (formData) => {
    console.log("Analyzing with FormData...");
    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      // Axios akan secara otomatis mengatur header 'Content-Type' ke 'multipart/form-data'
      const response = await axios.post('/api/scanMarket', formData);

      // API akan mengembalikan satu objek laporan
      setReport(response.data);

    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.response?.data?.error || 'Gagal melakukan analisis. Pastikan screenshot jelas dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white">
      <AiScannerForm onScan={handleScan} isLoading={isLoading} />
      <AiScannerResults report={report} isLoading={isLoading} error={error} />
    </div>
  );
};

export default AiScannerPage;
