import { Formidable } from 'formidable';
import fs from 'fs';
import axios from 'axios';

// Konfigurasi untuk Vercel agar bisa menangani unggahan file
export const config = {
  api: {
    bodyParser: false, // Matikan parser bawaan Vercel
  },
};

// Fungsi bantuan untuk mem-parsing form data
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new Formidable();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

// Fungsi bantuan untuk mengubah gambar menjadi Base64
const imageToBase64 = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
};

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);
    
    const pairName = fields.pairName[0];
    const timeframe = fields.timeframe[0];
    const currentPrice = fields.currentPrice[0];
    const chartImageFile = files.chartImage[0];

    if (!chartImageFile) {
      return res.status(400).json({ error: 'Screenshot chart tidak ditemukan.' });
    }

    const base64Image = imageToBase64(chartImageFile.filepath);
    const mimeType = chartImageFile.mimetype;

    const openrouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openrouterApiKey) {
      console.error('SERVER ERROR: OPENROUTER_API_KEY not found.');
      return res.status(500).json({ error: 'Konfigurasi Kunci API di server Vercel belum benar. Mohon periksa kembali Environment Variables.' });
    }

    const apiKey = openrouterApiKey;
    if (!apiKey) {
      return res.status(500).json({ error: 'Kunci API tidak dikonfigurasi.' });
    }

    const prompt = `
      Anda adalah AI Analis Chart Teknikal. Tugas Anda adalah menganalisis gambar chart yang diberikan dan menghasilkan "Technical Analysis Report" dalam format JSON yang ketat.

      Data yang diketahui:
      - Pair: ${pairName}
      - Timeframe: ${timeframe}
      - Harga Saat Ini: ${currentPrice}

      Berdasarkan gambar chart, buatlah laporan dengan struktur JSON berikut. Isi semua nilai berdasarkan analisis Anda terhadap gambar.
      - "tradingParameters": Sebuah objek dengan "entryZone", "takeProfit1", "takeProfit2", "stopLoss".
      - "trendAnalysis": String ("Bearish", "Bullish", atau "Neutral").
      - "keyMetrics": Sebuah objek dengan "chartPattern", "riskLevel", "priceTarget".
      - "keyPriceLevels": Sebuah objek dengan array "support" dan array "resistance". Setiap array berisi angka.
      - "tradingStrategy": Sebuah string yang merangkum strategi trading yang disarankan.

      Berikan HANYA objek JSON tunggal sebagai respons tanpa teks atau format markdown lain.
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-flash-1.5", // Model ini mendukung input gambar
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const resultText = response.data.choices[0].message.content;
    const cleanedJsonString = resultText.replace(/```json\n|```/g, '').trim();
    const jsonResponse = JSON.parse(cleanedJsonString);

    // Gabungkan dengan data awal untuk header laporan
    const finalReport = {
      pairName,
      timeframe,
      currentPrice,
      ...jsonResponse
    };

    res.status(200).json(finalReport);

  } catch (error) {
    console.error('Error di /api/scanMarket:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Terjadi kesalahan internal pada server.' });
    console.error("Error calling OpenRouter API:", error.response ? error.response.data : error.message);
    response.setHeader('Access-Control-Allow-Origin', '*');
    return response.status(500).json({ error: "Gagal menghubungi layanan AI." });
  }
};
