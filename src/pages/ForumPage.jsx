import { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase/config";
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import ThreadList from "../components/forum/ThreadList";
import ThreadDetail from "../components/forum/ThreadDetail";
import ThreadForm from "../components/forum/ThreadForm";

const ForumPage = () => {
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threadsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setThreads(threadsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateOrUpdateThread = async ({ title, content, imageUrl }) => {
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);

    try {
      if (isEditing) {
        const threadRef = doc(db, "threads", selectedThread.id);
        await updateDoc(threadRef, { title, content, imageUrl });
        setSelectedThread({ ...selectedThread, title, content, imageUrl });
        setIsEditing(false);
      } else {
        await addDoc(collection(db, "threads"), {
          title, content, imageUrl,
          authorId: user.uid, authorName: user.displayName, authorPhotoURL: user.photoURL,
          createdAt: serverTimestamp(), commentsCount: 0,
        });
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error saving thread: ", error);
      alert("Gagal menyimpan thread. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditThread = (thread) => {
    setSelectedThread(thread);
    setIsEditing(true);
  };

  const handleDeleteThread = async (threadId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus thread ini? Semua komentar di dalamnya juga akan terhapus.")) {
      try {
        // Di masa depan, kita perlu menghapus sub-koleksi komentar juga.
        // Untuk saat ini, kita hanya hapus thread-nya.
        await deleteDoc(doc(db, "threads", threadId));
      } catch (error) {
        console.error("Error deleting thread: ", error);
        alert("Gagal menghapus thread.");
      }
    }
  };

  const handleCommentAction = async (action, data) => {
    if (!selectedThread) return;
    const { id, content, imageUrl } = data;

    try {
      if (action === 'add') {
        const commentRef = collection(db, `threads/${selectedThread.id}/comments`);
        await addDoc(commentRef, {
          content, imageUrl,
          authorId: user.uid, authorName: user.displayName, authorPhotoURL: user.photoURL,
          createdAt: serverTimestamp(),
        });
      } else if (action === 'update') {
        const commentRef = doc(db, `threads/${selectedThread.id}/comments`, id);
        await updateDoc(commentRef, { content, imageUrl });
      } else if (action === 'delete') {
        const commentRef = doc(db, `threads/${selectedThread.id}/comments`, id);
        await deleteDoc(commentRef);
      }
    } catch (error) {
      console.error(`Error ${action}ing comment:`, error);
      alert(`Gagal memproses komentar.`);
    }
  };

  const renderContent = () => {
    if (isCreating || isEditing) {
      return (
        <ThreadForm 
          onSubmit={handleCreateOrUpdateThread} 
          onCancel={() => { setIsCreating(false); setIsEditing(false); }}
          isLoading={isSubmitting} 
          existingThread={isEditing ? selectedThread : null}
        />
      );
    }
    if (selectedThread) {
      return (
        <ThreadDetail 
          thread={selectedThread} 
          onBack={() => setSelectedThread(null)} 
          onEdit={() => setIsEditing(true)}
          onDelete={() => handleDeleteThread(selectedThread.id)}
          onCommentAction={handleCommentAction}
        />
      );
    }
    return (
      <ThreadList 
        threads={threads} 
        onSelectThread={setSelectedThread} 
        onEditThread={handleEditThread}
        onDeleteThread={handleDeleteThread}
        currentUser={user}
      />
    );
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Forum Diskusi</h1>
          <p className="text-slate-400 mt-1">Bagikan ide dan analisis Anda dengan komunitas.</p>
        </div>
        {!selectedThread && !isCreating && !isEditing && (
          <button 
            onClick={() => setIsCreating(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Buat Thread Baru
          </button>
        )}
      </div>

      {isLoading ? <div className="text-center">Memuat forum...</div> : renderContent()}
    </div>
  );
};

export default ForumPage;
