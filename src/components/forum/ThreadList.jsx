import React, { useState } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';

const ThreadActions = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-2 rounded-full hover:bg-slate-700">
        <FiMoreVertical />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-md shadow-lg z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); setIsOpen(false); }}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
          >
            <FiEdit className="mr-2" /> Edit
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); setIsOpen(false); }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
          >
            <FiTrash2 className="mr-2" /> Hapus
          </button>
        </div>
      )}
    </div>
  );
};

const ThreadList = ({ threads, onSelectThread, onEditThread, onDeleteThread, currentUser }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {threads.map(thread => (
        <div 
          key={thread.id} 
          onClick={() => onSelectThread(thread)}
          className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-indigo-500 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <img src={thread.authorPhotoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${thread.authorName}`} alt={thread.authorName} className="w-10 h-10 rounded-full bg-slate-700" />
              <div>
                <p className="font-semibold text-white">{thread.authorName}</p>
                <p className="text-xs text-slate-400">
                  {thread.createdAt?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            {currentUser && currentUser.uid === thread.authorId && (
              <ThreadActions 
                onEdit={() => onEditThread(thread)} 
                onDelete={() => onDeleteThread(thread.id)} 
              />
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2 truncate">{thread.title}</h3>
          <p className="text-slate-400 text-sm h-12 overflow-hidden text-ellipsis">{thread.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
