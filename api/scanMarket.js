import { Formidable } from 'formidable';
import fs from 'fs';
import axios from 'axios';

// Konfigurasi untuk Vercel agar bisa menangani unggahan file
export const config = {
  api: {
    bodyParser: false, // Matikan parser bawaan Vercel
  },
};

// Fungsi untuk mengubah gambar menjadi base64
const imageToBase64 = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
};

// Fungsi bantuan untuk mem-parsing form data
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new Formidable();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve([fields, files]);
    });
  });
};

// Fungsi untuk membuat prompt berdasarkan data input
const createPrompt = (pairName, timeframe, currentPrice) => {
  return `
    Anda adalah AI Analis Chart Teknikal. Tugas Anda adalah menganalisis gambar chart yang diberikan dan menghasilkan "Technical Analysis Report" dalam format JSON yang ketat.

    Data yang diketahui:
    - Pair: ${pairName}
    - Timeframe: ${timeframe}
    - Harga Saat Ini: ${currentPrice}

    **ATURAN WAJIB DAN KETAT:**
    1.  **Jika strategi adalah "BUY" (Beli/Long):**
        *   `takeProfit1` dan `takeProfit2` HARUS LEBIH TINGGI dari `entryZone`.
        *   `stopLoss` HARUS LEBIH RENDAH dari `entryZone`.
    2.  **Jika strategi adalah "SELL" (Jual/Short):**
        *   `takeProfit1` dan `takeProfit2` HARUS LEBIH RENDAH dari `entryZone`.
        *   `stopLoss` HARUS LEBIH TINGGI dari `entryZone`.
    3.  Pastikan `tradingStrategy` konsisten dengan `trendAnalysis`:
        *   Jika tren "Bearish", strategi harus "SELL".
        *   Jika tren "Bullish", strategi harus "BUY".
        *   Jika tren "Neutral", strategi harus menyarankan untuk "menunggu konfirmasi" atau "trading dalam rentang (range)".

    Berdasarkan gambar chart dan ATURAN DI ATAS, buatlah laporan dengan struktur JSON berikut. Isi semua nilai berdasarkan analisis Anda.
    
    **Struktur JSON:**
    - "tradingParameters": Sebuah objek dengan "entryZone", "takeProfit1", "takeProfit2", "stopLoss". Semua nilai harus berupa angka.
    - "trendAnalysis": String ("Bearish", "Bullish", atau "Neutral").
    - "keyMetrics": Sebuah objek dengan "chartPattern", "riskLevel" (Low, Medium, High), "priceTarget".
    - "keyPriceLevels": Sebuah objek dengan array "support" dan array "resistance". Setiap array berisi angka.
    - "tradingStrategy": Sebuah string yang merangkum strategi trading yang disarankan dan harus secara eksplisit menyebutkan "strategi BUY" atau "strategi SELL".

    Berikan HANYA objek JSON tunggal sebagai respons tanpa teks atau format markdown lain.
  `;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const [fields, files] = await parseForm(req);

    const pairName = fields.pairName?.[0];
    const timeframe = fields.timeframe?.[0];
    const currentPrice = fields.currentPrice?.[0];
    const chartImageFile = files.chartImage?.[0];

    if (!pairName || !timeframe || !currentPrice || !chartImageFile) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }

    const base64Image = imageToBase64(chartImageFile.filepath);
    const mimeType = chartImageFile.mimetype;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error('SERVER ERROR: OPENROUTER_API_KEY is missing in Vercel environment.');
      return res.status(500).json({ error: 'Kunci API untuk layanan AI tidak ditemukan di konfigurasi server.' });
    }

    const prompt = createPrompt(pairName, timeframe, currentPrice);

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } },
          ],
        },
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const resultText = response.data.choices[0].message.content;
    const cleanedJsonString = resultText.replace(/```json\n|```/g, '').trim();
    const jsonResponse = JSON.parse(cleanedJsonString);

    const finalReport = {
      pairName,
      timeframe,
      currentPrice,
      ...jsonResponse
    };

    return res.status(200).json(finalReport);

  } catch (error) {
    if (error.response) {
      // Error dari panggilan API (misal: 401, 429, dll)
      console.error('API Error:', error.response.data);
      const errorMessage = error.response.data?.error?.message || 'Gagal menghubungi layanan AI.';
      return res.status(500).json({ error: `Analisis Gagal: ${errorMessage}` });
    } else {
      // Error lain (parsing, network, dll)
      console.error('Server Error:', error.message);
      return res.status(500).json({ error: 'Terjadi kesalahan tak terduga di server.' });
    }
  }
};
