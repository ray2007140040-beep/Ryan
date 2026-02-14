
import React from 'react';

type Tab = 'home' | 'profile';

interface BottomNavProps {
  currentTab: Tab;
  onSwitchTab: (tab: Tab) => void;
  role: 'admin' | 'coach' | 'student';
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSwitchTab, role }) => {
  
  const getHomeLabel = () => {
    switch(role) {
      case 'admin': return '控制中心';
      case 'coach': return '工作台';
      case 'student': return '我的课程';
    }
  };

  // Workplace / Home Icon SVG
  const WorkplaceIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );

  // Profile / Mine Icon SVG
  const ProfileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 bg-black/95 backdrop-blur-xl border-t-[0.5px] border-[#8E8E93]/10 z-[190] flex items-center justify-around px-12 pb-6 pt-2">
      
      {/* Workplace Tab */}
      <button
        onClick={() => onSwitchTab('home')}
        className={`flex flex-col items-center gap-2 transition-all duration-300 group ${currentTab === 'home' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
      >
        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-all ${currentTab === 'home' ? 'bg-[#E60012] text-white shadow-[0_0_20px_rgba(230,0,18,0.4)]' : 'bg-[#1A1A1A] text-[#8E8E93] border border-white/5'}`}>
           <WorkplaceIcon />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-[2px] ${currentTab === 'home' ? 'text-white' : 'text-[#8E8E93]'}`}>
          {getHomeLabel()}
        </span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => onSwitchTab('profile')}
        className={`flex flex-col items-center gap-2 transition-all duration-300 group ${currentTab === 'profile' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
      >
        <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center transition-all ${currentTab === 'profile' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-[#1A1A1A] text-[#8E8E93] border border-white/5'}`}>
           <ProfileIcon />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-[2px] ${currentTab === 'profile' ? 'text-white' : 'text-[#8E8E93]'}`}>
          我的
        </span>
      </button>

    </nav>
  );
};

export default BottomNav;
