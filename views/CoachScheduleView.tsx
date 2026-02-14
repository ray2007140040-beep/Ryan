
import React, { useState } from 'react';
import { Klass } from '../types';

interface CoachScheduleViewProps {
  klasses: Klass[];
  onBack: () => void;
}

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const CoachScheduleView: React.FC<CoachScheduleViewProps> = ({ klasses, onBack }) => {
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());

  // Filter classes for the selected day
  const dailyKlasses = klasses.filter(k => k.days.includes(selectedDay)).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="fixed inset-0 bg-[#000000] z-[300] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">排课计划表</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Weekly Schedule</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      {/* Day Selector */}
      <div className="flex justify-between mb-8 bg-[#1A1A1A] p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
        {WEEK_DAYS.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(idx)}
            className={`
              flex-1 min-w-[40px] py-3 rounded-xl text-[10px] font-black transition-all
              ${selectedDay === idx 
                ? 'bg-[#E60012] text-white shadow-lg' 
                : 'text-[#8E8E93] hover:text-white'}
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule List */}
      <div className="space-y-4 mb-20">
        <div className="flex items-center gap-2 mb-2 ml-1">
           <div className="w-1.5 h-1.5 rounded-full bg-[#E60012]"></div>
           <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">{WEEK_DAYS[selectedDay]}课程安排</p>
        </div>

        {dailyKlasses.length > 0 ? (
          dailyKlasses.map((klass) => (
            <div key={klass.id} className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 relative overflow-hidden group">
               <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{klass.name}</h3>
                    <div className="flex gap-2">
                       <span className="text-[9px] bg-white/10 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">{klass.level_tag}</span>
                       <span className="text-[9px] text-[#8E8E93] border border-white/10 px-2 py-0.5 rounded font-black uppercase tracking-wider">{klass.student_count} 人报名</span>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[#E60012] font-oswald text-xl italic">{klass.startTime}</p>
                     <p className="text-[#8E8E93] text-[10px] font-black uppercase">{klass.endTime}</p>
                  </div>
               </div>
               
               <div className="w-full h-[1px] bg-white/5 my-4"></div>

               <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">查看学员名单</button>
                  <button className="flex-1 py-3 rounded-xl border border-white/10 text-[#8E8E93] text-[10px] font-black uppercase tracking-widest hover:text-[#E60012] hover:border-[#E60012] transition-all">申请调课/请假</button>
               </div>
            </div>
          ))
        ) : (
          <div className="p-12 border-[0.5px] border-dashed border-white/10 rounded-[24px] flex flex-col items-center justify-center text-[#8E8E93] opacity-50">
             <span className="text-3xl mb-2">☕️</span>
             <p className="text-[9px] font-black uppercase tracking-[3px]">今日暂无排课</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-10 left-6 right-6">
         <button className="w-full py-5 rounded-full bg-[#1A1A1A] border border-white/10 text-[#8E8E93] font-oswald text-sm uppercase tracking-[3px] active:scale-95 transition-all">
            下载完整课表 (PDF)
         </button>
      </div>
    </div>
  );
};

export default CoachScheduleView;
