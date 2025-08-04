import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

const Header = ({ onAddTrade, user }) => {
  // Tombol logout dihilangkan dari sini
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white">Jurnal Trading</h1>
        {user && (
          <p className="text-slate-400">
            Selamat datang, {user.displayName || user.email}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onAddTrade}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          + Tambah Trade
        </button>
      </div>
    </div>
  );
};

export default Header;
