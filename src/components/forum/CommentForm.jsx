import React, { useState } from 'react';

const CommentForm = ({ onSubmit, onCancel, existingComment, isLoading }) => {
  const [content, setContent] = useState(existingComment?.content || '');
  const [imageUrl, setImageUrl] = useState(existingComment?.imageUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content, imageUrl });
    setContent('');
    setImageUrl('');
    if(onCancel) onCancel(); // Close form after edit
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        placeholder="Tulis komentar Anda..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        rows="3"
        required
      />
      <input 
        type="url"
        placeholder="URL Gambar (Opsional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full mt-2 p-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
      <div className="flex justify-end items-center mt-2">
        <div className="flex items-center gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="py-2 px-4 rounded-lg text-slate-300 hover:bg-slate-600 text-sm">
              Batal
            </button>
          )}
          <button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 text-sm"
            disabled={isLoading}
          >
            {isLoading ? 'Mengirim...' : (existingComment ? 'Simpan' : 'Kirim')}
          </button>
        </div>
      </div>
      {imageUrl && <img src={imageUrl} alt="Preview" className="mt-3 rounded-lg max-h-40" />}
    </form>
  );
};

export default CommentForm;
