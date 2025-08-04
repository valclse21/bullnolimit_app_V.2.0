import { FiHome, FiBookOpen, FiMessageSquare, FiTrendingUp, FiUser, FiCpu, FiFileText } from 'react-icons/fi';

const NavItem = ({ icon, label, isActive, onClick }) => {
  const activeClass = "text-indigo-400";
  const inactiveClass = "text-slate-400";
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 w-full transition-colors duration-200 hover:text-indigo-400"
    >
      <div className={`w-6 h-6 ${isActive ? activeClass : inactiveClass}`}>
        {icon}
      </div>
      <span className={`text-xs ${isActive ? activeClass : inactiveClass}`}>
        {label}
      </span>
    </button>
  );
};

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 z-50">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        <NavItem icon={<FiHome size={24} />} label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavItem icon={<FiTrendingUp size={24} />} label="Berita" isActive={activeTab === 'berita'} onClick={() => setActiveTab('berita')} />
        
        <div className="relative">
          <button
            onClick={() => setActiveTab('jurnal')}
            className="relative -top-6 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg border-4 border-slate-800 hover:bg-indigo-700 transition-all"
          >
            <FiFileText size={28} className="text-white" />
          </button>
        </div>
        
        <NavItem icon={<FiCpu size={24} />} label="AI Scan" isActive={activeTab === 'scanner'} onClick={() => setActiveTab('scanner')} />
        <NavItem icon={<FiMessageSquare size={24} />} label="Forum" isActive={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
      </div>
    </div>
  );
};

export default BottomNav;

