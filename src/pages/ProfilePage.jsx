import { useState } from 'react';
import { auth } from '../firebase/config';
import { updateProfile } from 'firebase/auth';

const ProfilePage = ({ user }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <div>Memuat data profil...</div>;
  }

  const handleSave = async () => {
    if (displayName === user.displayName) return; // Tidak ada perubahan

    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      alert('Nama tampilan berhasil diperbarui!');
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Gagal memperbarui profil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg max-w-2xl mx-auto border border-slate-700">
      <div className="flex items-center space-x-6 mb-8">
        <img 
          src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName}`}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-slate-600 bg-slate-700"
        />
        <div>
          <h1 className="text-3xl font-bold text-white">{user.displayName}</h1>
          <p className="text-slate-400">{user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Pengaturan Akun</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400">Nama Tampilan</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400">Email</label>
            <input 
              type="email" 
              defaultValue={user.email} 
              className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled
            />
          </div>
          <div className="pt-4">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || displayName === user.displayName || !displayName.trim()}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
