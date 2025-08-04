import React, { useState, useEffect } from 'react';

const ThreadForm = ({ onSubmit, onCancel, existingThread, isLoading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (existingThread) {
      setTitle(existingThread.title);
      setContent(existingThread.content);
      setImageUrl(existingThread.imageUrl || '');
    }
  }, [existingThread]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg border border-slate-700 space-y-6">
      <h2 className="text-2xl font-bold text-white">{existingThread ? 'Edit Thread' : 'Buat Thread Baru'}</h2>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Judul</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-1">Isi</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          rows="6"
          required
        />
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-300 mb-1">URL Gambar (Opsional)</label>
        <input 
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.png"
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {imageUrl && <img src={imageUrl} alt="Preview" className="mt-4 rounded-lg max-h-60" />}
      </div>
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="py-2 px-6 rounded-lg text-slate-300 hover:bg-slate-600">
          Batal
        </button>
        <button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
};

export default ThreadForm;
