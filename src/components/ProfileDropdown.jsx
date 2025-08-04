import { useState } from "react";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

const ProfileDropdown = ({ user, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout error", error));
  };

  const handleProfileClick = () => {
    setActiveTab("profil");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600 hover:border-blue-500 transition"
      >
        <img 
          src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName}`}
          alt="User Profile" 
          className="w-full h-full object-cover bg-slate-700"
        />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-700">
            <p className="font-semibold text-white truncate">
              {user.displayName}
            </p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleProfileClick}
            className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700"
          >
            Profil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
