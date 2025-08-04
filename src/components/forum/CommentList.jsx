import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import Comment from './Comment';
import CommentForm from './CommentForm';

const CommentList = ({ threadId, onCommentAction }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!threadId) return;
    const q = query(
      collection(db, `threads/${threadId}/comments`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [threadId]);

  const handleAddComment = (commentData) => {
    onCommentAction('add', commentData);
  };

  const handleUpdateComment = (commentId, commentData) => {
    onCommentAction('update', { id: commentId, ...commentData });
  };

  const handleDeleteComment = (commentId) => {
    onCommentAction('delete', { id: commentId });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Komentar ({comments.length})</h2>
      
      {/* Form untuk menambah komentar baru */}
      <CommentForm onSubmit={handleAddComment} />

      <hr className="border-slate-700 my-6" />

      {/* Daftar komentar yang ada */}
      {isLoading ? (
        <p className="text-slate-400">Memuat komentar...</p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
          {comments.length === 0 && <p className="text-slate-400">Belum ada komentar. Jadilah yang pertama!</p>}
        </div>
      )}
    </div>
  );
};

export default CommentList;
