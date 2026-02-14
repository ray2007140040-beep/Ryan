
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, className, rightElement }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black/95 backdrop-blur-md z-50 px-6 pt-12 pb-5 border-b-[0.5px] border-white/10">
      <div className="flex justify-between items-end">
        <div className="flex-1">
          <p className="text-[#E60012] text-[9px] font-black tracking-[4px] uppercase mb-1 italic">
            {subtitle || 'Combat Bible Pro'}
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-oswald uppercase tracking-tighter text-[#F2F2F2] italic">
              {title}
            </h1>
            {className && (
              <div className="px-2 py-0.5 bg-[#E60012]/10 border border-[#E60012]/30 rounded text-[9px] font-black text-[#E60012] mt-1">
                {className}
              </div>
            )}
          </div>
        </div>
        <div className="pb-1">
          {rightElement || <div className="w-6 h-6 border-[0.5px] border-[#E60012] flex items-center justify-center text-[10px] text-[#E60012] font-black">CB</div>}
        </div>
      </div>
    </header>
  );
};

export default Header;
