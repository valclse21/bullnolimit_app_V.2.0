import { useState, useEffect, useMemo } from "react";
import { FINNHUB_API_KEY } from "../api/keys";

// Komponen untuk Modal Detail Berita
const NewsDetailModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-slate-700 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
        {article.image && <img src={article.image} alt={article.headline} className="w-full h-64 object-cover rounded-md mb-4" />}
        <span className="text-sm font-semibold text-blue-400">{article.source}</span>
        <h2 className="text-2xl font-bold text-white mt-1 mb-2">{article.headline}</h2>
        <p className="text-slate-300 mb-4">{article.summary}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Baca selengkapnya &rarr;</a>
      </div>
    </div>
  );
};

// Komponen untuk Kartu Berita
const NewsCard = ({ article, onSelect }) => (
  <div 
    onClick={() => onSelect(article)}
    className="cursor-pointer bg-slate-800 p-4 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors h-full flex flex-col"
  >
    {article.image && <img src={article.image} alt={article.headline} className="w-full h-40 object-cover rounded-md mb-4" />}
    <div className="flex-grow">
      <span className="text-xs font-semibold text-blue-400">{article.source}</span>
      <h3 className="text-lg font-bold text-white mt-1">{article.headline}</h3>
      <p className="text-sm text-slate-400 mt-2 line-clamp-3">{article.summary}</p>
    </div>
  </div>
);

const BeritaPage = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
        const data = await response.json();
        setNews(data.slice(0, 50)); // Ambil 50 berita
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
      setIsLoading(false);
    };
    fetchNews();
  }, []);

  const filteredAndSortedNews = useMemo(() => {
    return news
      .filter(article => 
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOrder) {
          case "oldest": return a.datetime - b.datetime;
          case "title-asc": return a.headline.localeCompare(b.headline);
          case "title-desc": return b.headline.localeCompare(a.headline);
          case "newest":
          default: return b.datetime - a.datetime;
        }
      });
  }, [news, searchTerm, sortOrder]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Berita Pasar Terkini</h1>
        <p className="text-slate-400">Update terbaru dari dunia finansial.</p>
      </div>

      {/* Kontrol Pencarian dan Pengurutan */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          type="text"
          placeholder="Cari berita..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
        />
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full md:w-auto p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
        >
          <option value="newest">Tanggal (Terbaru)</option>
          <option value="oldest">Tanggal (Terlama)</option>
          <option value="title-asc">Judul (A-Z)</option>
          <option value="title-desc">Judul (Z-A)</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-center text-white">Memuat berita...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedNews.map((article) => (
            <NewsCard key={article.id} article={article} onSelect={setSelectedArticle} />
          ))}
        </div>
      )}

      <NewsDetailModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </>
  );
};

export default BeritaPage;
