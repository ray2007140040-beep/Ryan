
import React from 'react';

interface CoachHistoryViewProps {
  onBack: () => void;
}

// Mock History Data
const HISTORY_DATA = [
  { id: 'h1', date: '2023.10.24', time: '18:30', className: '泰拳进阶 L2', students: 12, rating: 4.9, status: 'completed' },
  { id: 'h2', date: '2023.10.22', time: '19:45', className: '踢拳核心 L1', students: 8, rating: 5.0, status: 'completed' },
  { id: 'h3', date: '2023.10.20', time: '18:30', className: '综合格斗实战', students: 6, rating: 4.8, status: 'completed' },
  { id: 'h4', date: '2023.10.18', time: '20:00', className: '泰拳基础 L1', students: 15, rating: 4.7, status: 'completed' },
];

const CoachHistoryView: React.FC<CoachHistoryViewProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 bg-[#000000] z-[300] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">历史教学数据</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Teaching Logs</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
         <div className="bg-[#1A1A1A] p-5 rounded-[24px] border border-white/5">
            <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-widest mb-2">累计授课</p>
            <p className="text-4xl font-oswald text-white italic">142 <span className="text-xs text-[#8E8E93] not-italic font-bold">节</span></p>
         </div>
         <div className="bg-[#1A1A1A] p-5 rounded-[24px] border border-white/5">
            <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-widest mb-2">服务人次</p>
            <p className="text-4xl font-oswald text-[#E60012] italic">1.2k</p>
         </div>
      </div>

      {/* History List */}
      <div className="space-y-6 mb-20">
         <div className="flex items-center justify-between mb-2 ml-1">
            <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">最近 30 天记录</p>
            <span className="text-[#E60012] text-[9px] font-black uppercase border-b border-[#E60012]">导出数据</span>
         </div>

         {HISTORY_DATA.map((item) => (
            <div key={item.id} className="bg-[#1A1A1A] p-5 rounded-[20px] border border-white/5 flex flex-col gap-3 active:scale-[0.98] transition-all">
               <div className="flex justify-between items-start">
                  <div>
                     <h4 className="text-white font-bold text-sm">{item.className}</h4>
                     <p className="text-[#8E8E93] text-[10px] font-black uppercase mt-1">{item.date} · {item.time}</p>
                  </div>
                  <div className="bg-[#E60012]/10 px-2 py-1 rounded text-[#E60012] font-oswald text-sm italic">
                     {item.rating}
                  </div>
               </div>
               
               <div className="w-full h-[1px] bg-white/5"></div>
               
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] text-[#8E8E93] font-black uppercase bg-white/5 px-2 py-0.5 rounded">学员 {item.students} 人</span>
                     <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">● 已完结</span>
                  </div>
                  <button className="text-[#8E8E93] text-[9px] font-black uppercase hover:text-white transition-colors">查看教案 ›</button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default CoachHistoryView;
