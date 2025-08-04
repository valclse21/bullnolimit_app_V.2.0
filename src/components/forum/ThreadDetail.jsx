import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import CommentList from './CommentList'; // Import CommentList

const OptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const ThreadDetail = ({ thread, onBack, onEdit, onDelete, onCommentAction }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = auth.currentUser;
  const isAuthor = user && user.uid === thread.authorId;

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus thread ini? Tindakan ini tidak dapat diurungkan.")) {
      onDelete();
    }
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit();
    setIsMenuOpen(false);
  }

  return (
    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700">
      <div className="flex justify-between items-start">
        <button onClick={onBack} className="mb-6 text-indigo-400 hover:text-indigo-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          Kembali ke semua thread
        </button>
        {isAuthor && (
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-white">
              <OptionsIcon />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-md shadow-lg z-10 border border-slate-600">
                <button onClick={handleEdit} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-600">Edit Thread</button>
                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-600">Hapus Thread</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img src={thread.authorPhotoURL} alt={thread.authorName} className="w-12 h-12 rounded-full" />
        <div>
          <p className="font-semibold text-white text-lg">{thread.authorName}</p>
          <p className="text-xs text-slate-400">
            {thread.createdAt?.toDate().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">{thread.title}</h1>
      <p className="text-slate-300 whitespace-pre-wrap mb-6">{thread.content}</p>
      {thread.imageUrl && (
        <img src={thread.imageUrl} alt="Thread image" className="mt-4 rounded-lg max-h-96 w-auto" />
      )}

      <hr className="border-slate-700 my-8" />

      {/* Ganti placeholder dengan CommentList */}
      <CommentList threadId={thread.id} onCommentAction={onCommentAction} />

    </div>
  );
};

export default ThreadDetail;
