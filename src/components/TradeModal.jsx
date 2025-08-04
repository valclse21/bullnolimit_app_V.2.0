import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const TradeModal = ({ isOpen, onClose, editingTrade, userId }) => {
  const [aset, setAset] = useState("");
  const [arahPosisi, setArahPosisi] = useState("Beli");
  const [hargaEntry, setHargaEntry] = useState("");
  const [hargaExit, setHargaExit] = useState("");
  const [lotSize, setLotSize] = useState("");
  const [catatan, setCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(editingTrade);

  useEffect(() => {
    if (isEditMode && editingTrade) {
      setAset(editingTrade.aset);
      setArahPosisi(editingTrade.arahPosisi);
      setHargaEntry(editingTrade.hargaEntry);
      setHargaExit(editingTrade.hargaExit);
      setLotSize(editingTrade.lotSize || "");
      setCatatan(editingTrade.catatan);
    } else {
      setAset("");
      setArahPosisi("Beli");
      setHargaEntry("");
      setHargaExit("");
      setLotSize("");
      setCatatan("");
    }
  }, [editingTrade, isEditMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Anda harus login untuk menyimpan data.");
      return;
    }
    setIsSubmitting(true);

    const tradeData = {
      aset,
      arahPosisi,
      hargaEntry: parseFloat(hargaEntry),
      hargaExit: parseFloat(hargaExit),
      lotSize: parseFloat(lotSize),
      catatan,
    };

    try {
      if (isEditMode) {
        const tradeRef = doc(
          db,
          "trades",
          userId,
          "userTrades",
          editingTrade.id
        );
        await updateDoc(tradeRef, tradeData);
      } else {
        tradeData.timestamp = serverTimestamp();
        await addDoc(collection(db, "trades", userId, "userTrades"), tradeData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Gagal menyimpan trade. Lihat konsol untuk detail.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {isEditMode ? "Edit Trade" : "Tambah Trade Baru"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="aset"
                  className="block text-sm font-medium text-slate-400"
                >
                  Aset
                </label>
                <input
                  type="text"
                  id="aset"
                  value={aset}
                  onChange={(e) => setAset(e.target.value)}
                  className="mt-1 block w-full bg-slate-700 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lot-size"
                  className="block text-sm font-medium text-slate-400"
                >
                  Ukuran Posisi (Lot)
                </label>
                <input
                  type="number"
                  step="any"
                  id="lot-size"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  className="mt-1 block w-full bg-slate-700 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="arah-posisi"
                className="block text-sm font-medium text-slate-400"
              >
                Arah Posisi
              </label>
              <select
                id="arah-posisi"
                value={arahPosisi}
                onChange={(e) => setArahPosisi(e.target.value)}
                className="mt-1 block w-full bg-slate-700 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Beli</option>
                <option>Jual</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="harga-entry"
                  className="block text-sm font-medium text-slate-400"
                >
                  Harga Entry
                </label>
                <input
                  type="number"
                  step="any"
                  id="harga-entry"
                  value={hargaEntry}
                  onChange={(e) => setHargaEntry(e.target.value)}
                  className="mt-1 block w-full bg-slate-700 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="harga-exit"
                  className="block text-sm font-medium text-slate-400"
                >
                  Harga Exit
                </label>
                <input
                  type="number"
                  step="any"
                  id="harga-exit"
                  value={hargaExit}
                  onChange={(e) => setHargaExit(e.target.value)}
                  className="mt-1 block w-full bg-slate-700 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="catatan"
                className="block text-sm font-medium text-slate-400"
              >
                Catatan
              </label>
              <textarea
                id="catatan"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows="3"
                className="mt-1 block w-full bg-slate-700 border-slate-600 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
