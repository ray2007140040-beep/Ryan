
import React from 'react';
import { CoachStats } from '../types';

interface CoachDetailViewProps {
  coach: CoachStats;
  onBack: () => void;
}

const CoachDetailView: React.FC<CoachDetailViewProps> = ({ coach, onBack }) => {
  
  const StatCard = ({ label, value, subValue, type = 'text' }: { label: string, value: string | number, subValue?: string, type?: 'text' | 'bar' }) => (
    <div className="bg-[#1A1A1A] rounded-[24px] p-6 border border-white/5 flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-5xl font-oswald text-white pointer-events-none group-hover:opacity-10 transition-opacity">
        {typeof value === 'string' ? value.replace('%', '') : Math.floor(value as number)}
      </div>
      <div>
        <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px] mb-3">{label}</p>
        <div className="flex items-end gap-2">
          <h3 className={`font-oswald text-4xl italic tracking-tighter ${type === 'bar' && (value as number) < 80 ? 'text-[#E60012]' : 'text-white'}`}>
            {type === 'bar' ? `${value}%` : value}
          </h3>
          {subValue && <span className="text-[10px] text-[#8E8E93] font-bold mb-1.5">{subValue}</span>}
        </div>
      </div>
      
      {type === 'bar' && (
        <div className="w-full h-1 bg-black rounded-full mt-4 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${ (value as number) < 80 ? 'bg-[#E60012]' : 'bg-white' }`}
            style={{ width: `${value}%` }}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#000000] z-[200] flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      
      {/* Header */}
      <div className="sticky top-0 bg-black/95 backdrop-blur-xl z-10 px-6 pt-16 pb-6 border-b border-white/5 flex justify-between items-start">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-xl font-oswald text-[#E60012] shadow-lg">
             {coach.name.charAt(0)}
           </div>
           <div>
             <div className="flex items-center gap-2 mb-1">
               <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">{coach.name}</h2>
               <span className="text-[9px] bg-[#E60012]/10 text-[#E60012] border border-[#E60012]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">{coach.level}</span>
             </div>
             <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[3px]">Joined {coach.joinDate}</p>
           </div>
        </div>
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-[#8E8E93] hover:text-white hover:border-white transition-all active:scale-90"
        >
          ✕
        </button>
      </div>

      <div className="p-6 pb-40">
        {/* Core Metrics Grid */}
        <section className="mb-12">
           <div className="flex items-center gap-2 mb-6">
             <div className="w-1 h-3 bg-[#E60012]"></div>
             <h3 className="text-white text-[10px] font-black uppercase tracking-[3px]">核心执教数据 (PERFORMANCE METRICS)</h3>
           </div>
           <div className="grid grid-cols-2 gap-4 h-64">
              <StatCard label="教学合规率" value={coach.complianceRate} subValue="COMPLIANCE" type="bar" />
              <StatCard label="课前备课率" value={coach.preparationRate} subValue="PREPARATION" type="bar" />
              <StatCard label="平均体验评分" value={coach.avgExperience} subValue="/ 5.0" />
              <StatCard label="平均强度指数" value={coach.avgIntensity} subValue="/ 5.0" />
           </div>
        </section>

        {/* Recent Feedback List */}
        <section>
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <div className="w-1 h-3 bg-white/20"></div>
               <h3 className="text-white text-[10px] font-black uppercase tracking-[3px]">近期会员反馈 (FEEDBACK LOG)</h3>
             </div>
             <span className="text-[#8E8E93] text-[9px] font-black uppercase">Last 30 Days</span>
          </div>
          
          <div className="space-y-4">
            {coach.feedbackHistory.map((record) => (
               <div key={record.id} className="bg-[#1A1A1A] p-5 rounded-[20px] border border-white/5 flex flex-col gap-3 active:scale-[0.99] transition-transform">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="text-white text-sm font-bold">{record.className}</h4>
                        <p className="text-[#8E8E93] text-[10px] font-black uppercase mt-1 tracking-wider">{record.studentName} · {record.date}</p>
                     </div>
                     <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                        <span className="text-[#E60012] text-xs">★</span>
                        <span className="text-white font-oswald text-sm italic">{record.experience}</span>
                     </div>
                  </div>
                  
                  <div className="w-full h-[0.5px] bg-white/5 my-1"></div>
                  
                  <div className="flex items-center justify-between">
                     <div className="flex gap-2">
                        {record.tags?.map((tag, i) => (
                           <span key={i} className="text-[8px] text-[#8E8E93] border border-white/10 px-2 py-0.5 rounded uppercase font-black">{tag}</span>
                        ))}
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[8px] text-[#8E8E93] font-black uppercase">INTENSITY</span>
                        <div className="flex gap-0.5">
                           {[1,2,3,4,5].map(i => (
                             <div key={i} className={`w-1 h-2 rounded-sm ${i <= record.intensity ? 'bg-[#E60012]' : 'bg-[#333]'}`}></div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action (Optional - e.g. Send Report) */}
      <div className="fixed bottom-10 left-6 right-6 z-[210] pointer-events-none">
         <div className="pointer-events-auto bg-white/5 backdrop-blur-md border border-white/10 p-1.5 rounded-full shadow-2xl">
            <button className="w-full py-4 rounded-full bg-[#E60012] text-white font-oswald text-sm uppercase tracking-[3px] shadow-lg active:scale-95 transition-all">
               导出绩效报告 (EXPORT REPORT)
            </button>
         </div>
      </div>
    </div>
  );
};

export default CoachDetailView;
