
import React, { useState } from 'react';

interface UnitLogRecord {
  id: string;
  coach: string;
  student: string;
  pack: string;
  time: string;
  date: string;
  status: 'normal' | 'deviation';
  experience: number;
  tags: string[];
}

interface ComplianceDetailViewProps {
  deviations: Array<{
    id: string;
    coach: string;
    student: string;
    pack: string;
    time: string;
  }>;
  totalUnits: number;
  complianceRate: number;
  unitLogs: UnitLogRecord[];
  onBack: () => void;
  onViewFeedback: (pack: string, date: string) => void;
}

const ComplianceDetailView: React.FC<ComplianceDetailViewProps> = ({ 
  deviations, totalUnits, complianceRate, unitLogs, onBack, onViewFeedback 
}) => {
  const [filter, setFilter] = useState<'all' | 'deviation'>('all');

  const filteredUnits = unitLogs.filter(u => filter === 'all' || u.status === 'deviation');

  const StatBox = ({ label, value, colorClass = 'text-white' }: { label: string, value: string | number, colorClass?: string }) => (
    <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 flex flex-col justify-center">
      <p className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-oswald italic ${colorClass}`}>{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#000000] z-[300] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">合规细分明细</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Compliance Breakdown</p>
        </div>
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all"
        >
          ✕
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        <StatBox label="合规指数" value={`${complianceRate}%`} colorClass={complianceRate < 80 ? 'text-[#E60012]' : 'text-green-500'} />
        <StatBox label="分析单元总数" value={totalUnits} />
        <StatBox label="检测到偏差" value={deviations.length} colorClass="text-[#E60012]" />
        <StatBox label="平均核销时间" value="4.2m" />
      </div>

      {/* Breakdown Filters */}
      <div className="mb-8">
        <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 text-[10px] font-black rounded-lg uppercase transition-all ${filter === 'all' ? 'bg-white text-black shadow-lg' : 'text-[#8E8E93]'}`}
          >
            全部教学单元 ({unitLogs.length})
          </button>
          <button 
            onClick={() => setFilter('deviation')}
            className={`flex-1 py-3 text-[10px] font-black rounded-lg uppercase transition-all ${filter === 'deviation' ? 'bg-[#E60012] text-white shadow-lg' : 'text-[#8E8E93]'}`}
          >
            高风险偏差 ({unitLogs.filter(u => u.status === 'deviation').length})
          </button>
        </div>
      </div>

      {/* Detailed List */}
      <section className="space-y-4">
        <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px] ml-1">班级课后反馈记录 (UNIT LOGS)</p>
        
        {filteredUnits.length > 0 ? (
          filteredUnits.map((log) => (
            <div 
              key={log.id} 
              onClick={() => onViewFeedback(log.pack, log.date)}
              className={`p-5 rounded-[24px] border transition-all flex flex-col gap-4 active:scale-[0.98] cursor-pointer group ${log.status === 'deviation' ? 'bg-[#E60012]/5 border-[#E60012]/30' : 'bg-[#1A1A1A] border-white/5'}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border ${log.status === 'deviation' ? 'bg-[#E60012] text-white border-[#E60012]' : 'bg-black text-[#8E8E93] border-white/10'}`}>
                    {log.status === 'deviation' ? '!' : '✓'}
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold group-hover:text-[#E60012] transition-colors">{log.pack}</h4>
                    <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-wider mt-1 italic">
                      {log.coach} 教练 · 学员: {log.student}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-oswald italic text-xs">{log.time}</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <span className="text-[#E60012] text-[8px]">★</span>
                    <span className="text-white font-oswald text-[10px] italic">{log.experience}.0</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex gap-1.5">
                  {log.tags.map((tag, i) => (
                    <span key={i} className="text-[7px] text-[#8E8E93] font-black border border-white/10 px-2 py-0.5 rounded uppercase">{tag}</span>
                  ))}
                </div>
                {log.status === 'deviation' ? (
                  <button className="text-[8px] bg-white text-black px-3 py-1.5 rounded font-black uppercase hover:scale-105 active:scale-95 transition-all">
                    发起调查
                  </button>
                ) : (
                  <span className="text-[7px] text-[#E60012] font-black uppercase tracking-[2px] italic">查看明细 →</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 border-[0.5px] border-dashed border-white/10 rounded-2xl text-center">
             <p className="text-[#8E8E93] text-xs font-bold italic opacity-40 uppercase tracking-widest">暂无相关流水数据</p>
          </div>
        )}
      </section>

      {/* Distribution Chart Simulation */}
      <section className="mt-12 mb-20 bg-[#1A1A1A] p-6 rounded-[32px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-6xl font-oswald text-white pointer-events-none italic">TREND</div>
        <h4 className="text-white text-[11px] font-black uppercase tracking-[2px] mb-6 flex items-center gap-2">
           <span className="w-1 h-3 bg-[#E60012]"></span>
           偏差分布趋势 (RISK TREND)
        </h4>
        <div className="flex items-end justify-between h-32 gap-1 px-2">
           {[40, 70, 30, 90, 20, 50, 65, 30, 45, 80].map((h, i) => (
             <div key={i} className="flex-1 group relative">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-700 ${h > 70 ? 'bg-[#E60012]' : 'bg-white/20 hover:bg-white/40'}`} 
                  style={{ height: `${h}%` }}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[6px] text-[#8E8E93] font-black uppercase">
                  {i+1}H
                </div>
             </div>
           ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/5">
           <p className="text-[8px] text-[#8E8E93] font-black uppercase leading-relaxed text-center opacity-60">
             * 峰值出现在 19:00 - 21:00 黄金时段，建议加强该时段场内巡查。
           </p>
        </div>
      </section>
    </div>
  );
};

export default ComplianceDetailView;
