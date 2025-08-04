import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import CommentForm from './CommentForm';

const OptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
);

const Comment = ({ comment, onUpdate, onDelete, isUpdating }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const user = auth.currentUser;
  const isAuthor = user && user.uid === comment.authorId;

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      onDelete(comment.id);
    }
  };

  const handleUpdate = (updatedData) => {
    onUpdate(comment.id, updatedData);
    setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-4 py-4">
      <img src={comment.authorPhotoURL} alt={comment.authorName} className="w-10 h-10 rounded-full mt-1" />
      <div className="flex-1">
        {!isEditing ? (
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold text-white">{comment.authorName}</span>
                <span className="text-xs text-slate-400 ml-2">
                  {comment.createdAt?.toDate().toLocaleDateString('id-ID')}
                </span>
              </div>
              {isAuthor && (
                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-white">
                    <OptionsIcon />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-slate-600 rounded-md shadow-lg z-10 border border-slate-500">
                      <button onClick={() => setIsEditing(true)} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-500">Edit</button>
                      <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-500">Hapus</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-slate-300 mt-2 whitespace-pre-wrap">{comment.content}</p>
            {comment.imageUrl && <img src={comment.imageUrl} alt="Comment image" className="mt-3 rounded-lg max-h-60" />}
          </div>
        ) : (
          <CommentForm 
            onSubmit={handleUpdate} 
            onCancel={() => setIsEditing(false)} 
            existingComment={comment} 
            isLoading={isUpdating}
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
