
import React from 'react';
import { Klass } from '../types';

interface StudentDashboardProps {
  klasses: Klass[];
  onSelectClass: (klassId: string, status: 'pending' | 'completed') => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ klasses, onSelectClass }) => {
  // Mock data for class status for the student
  // In a real app, this would come from the backend based on student enrollment
  const getMockStatus = (klassId: string) => {
    // Just a deterministic mock based on ID char code
    const lastChar = klassId.charCodeAt(klassId.length - 1);
    if (lastChar % 2 === 0) return 'completed';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-black pt-32 px-5 pb-32 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      
      {/* Stats Header */}
      <div className="mb-10 flex justify-between items-end">
         <div>
            <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">我的训练</h2>
            <p className="text-[#E60012] text-[9px] font-black uppercase tracking-[4px]">My Training Sessions</p>
         </div>
         <div className="text-right">
            <span className="text-3xl font-oswald text-white italic">12</span>
            <span className="text-[9px] text-[#8E8E93] font-black uppercase tracking-widest block">Total Sessions</span>
         </div>
      </div>

      {/* Pending Feedback Section */}
      <section className="mb-10">
         <div className="flex items-center gap-2 mb-4 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E60012] animate-pulse"></div>
            <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">待反馈课程 (PENDING)</p>
         </div>
         
         <div className="space-y-4">
            {klasses.slice(0, 2).map((klass) => (
               <div 
                 key={klass.id} 
                 onClick={() => onSelectClass(klass.id, 'pending')}
                 className="bg-[#1A1A1A] p-6 rounded-[24px] border border-[#E60012]/30 relative overflow-hidden active:scale-95 transition-all shadow-[0_0_20px_rgba(230,0,18,0.1)]"
               >
                  <div className="absolute top-0 right-0 px-4 py-2 bg-[#E60012] text-white text-[8px] font-black uppercase tracking-widest rounded-bl-2xl">
                     需要反馈
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{klass.name}</h3>
                  <p className="text-[#8E8E93] text-xs font-bold mb-4">{klass.startTime} - {klass.endTime} · 麦克教练</p>
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] text-[#8E8E93] uppercase font-black tracking-wider bg-white/5 px-2 py-1 rounded">今日课程</span>
                     <button className="text-[#E60012] text-[10px] font-black uppercase tracking-widest border-b border-[#E60012] pb-0.5">去填写反馈 →</button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* History Section */}
      <section>
         <div className="flex items-center gap-2 mb-4 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]"></div>
            <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">历史记录 (HISTORY)</p>
         </div>

         <div className="space-y-3">
            {klasses.slice(2).concat(klasses).map((klass, idx) => (
               <div 
                 key={`${klass.id}_${idx}`} 
                 onClick={() => onSelectClass(klass.id, 'completed')}
                 className="bg-[#1A1A1A] p-5 rounded-[20px] border border-white/5 flex justify-between items-center active:bg-[#252525] transition-all"
               >
                  <div>
                     <h4 className="text-white text-sm font-bold opacity-80">{klass.name}</h4>
                     <p className="text-[#8E8E93] text-[10px] font-black uppercase mt-1">2023.10.{10 + idx}</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[9px] text-green-500 font-black uppercase tracking-widest border border-green-500/20 px-2 py-0.5 rounded bg-green-500/10">已完成</span>
                     <span className="text-[#8E8E93] text-lg">›</span>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
