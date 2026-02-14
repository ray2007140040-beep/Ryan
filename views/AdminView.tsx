
import React, { useState, useMemo } from 'react';
import ComplianceCard from '../components/ComplianceCard';
import ActionLibraryManager from './ActionLibraryManager';
import ClassManager from './ClassManager';
import CoachDetailView from './CoachDetailView';
import ComplianceDetailView from './ComplianceDetailView';
import ClassFeedbackDetailView from './ClassFeedbackDetailView';
import { Klass, CoachStats, FeedbackRecord } from '../types';

interface AdminViewProps {
  deviations: Array<{
    id: string;
    coach: string;
    student: string;
    pack: string;
    time: string;
  }>;
  klasses: Klass[];
  onUpdateKlasses: (klasses: Klass[]) => void;
}

// Unified Unit Log Data (Session + Feedback)
const MOCK_UNIT_LOGS = [
  { id: 'u_001', coach: '伊万', student: '张三', pack: '泰拳 L2 进阶', time: '18:45', date: '2023-11-01', status: 'normal' as const, intensity: 4, experience: 5, tags: ['高强度', '动作标准'] },
  { id: 'u_002', coach: '莎拉', student: '李思', pack: '踢拳 L1 基础', time: '20:15', date: '2023-11-01', status: 'normal' as const, intensity: 3, experience: 4, tags: ['教学细致'] },
  { id: 'u_003', coach: '麦克', student: '王五', pack: 'MMA 实战班', time: '21:30', date: '2023-10-31', status: 'deviation' as const, intensity: 5, experience: 3, tags: ['挑战大'] },
  { id: 'u_004', coach: '伊万', student: '赵六', pack: '泰拳 L2 进阶', time: '19:00', date: '2023-10-30', status: 'normal' as const, intensity: 4, experience: 4, tags: ['体能提升'] },
];

const AdminView: React.FC<AdminViewProps> = ({ deviations, klasses, onUpdateKlasses }) => {
  const [activeSubView, setActiveSubView] = useState<'none' | 'actionLibrary' | 'classes' | 'coachDetail' | 'complianceDetail' | 'classFeedback'>('none');
  const [selectedCoach, setSelectedCoach] = useState<CoachStats | null>(null);
  const [selectedFeedbackClass, setSelectedFeedbackClass] = useState<{name: string, date: string} | null>(null);
  
  // Export Modal State
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState<'config' | 'processing' | 'done'>('config');

  // Dynamic Compliance Calculation
  const totalPlannedUnits = klasses.reduce((acc, k) => acc + k.student_count, 0) || 50;
  const complianceRate = useMemo(() => {
    const rate = 100 - (deviations.length / totalPlannedUnits) * 100;
    return Math.max(0, Math.round(rate));
  }, [deviations, totalPlannedUnits]);

  const coachList = [
    { name: '教练 伊万', rate: 98, score: 9.9, id: 'ivan' },
    { name: '教练 莎拉', rate: 92, score: 9.4, id: 'sarah' },
    { name: '教练 迈克', rate: 74, score: 6.2, alert: true, id: 'mike' },
  ];

  const handleCoachClick = (name: string, rate: number, score: number) => {
    const data: CoachStats = {
      id: `coach_${name}`,
      name: name,
      level: rate > 90 ? 'Senior Coach' : 'Junior Coach',
      joinDate: '2023-05-12',
      complianceRate: rate,
      preparationRate: rate + 2,
      avgExperience: Math.min(5.0, score / 2 + 0.5),
      avgIntensity: 4.1,
      feedbackHistory: MOCK_UNIT_LOGS.map(u => ({
        id: u.id,
        studentName: u.student,
        className: u.pack,
        date: u.date,
        intensity: u.intensity,
        experience: u.experience,
        tags: u.tags
      }))
    };
    setSelectedCoach(data);
    setActiveSubView('coachDetail');
  };

  const handleFeedbackClick = (pack: string, date: string) => {
    setSelectedFeedbackClass({ name: pack, date: date });
    setActiveSubView('classFeedback');
  };

  const handleStartExport = () => {
    setIsExporting(true);
    setExportStep('config');
  };

  const executeExport = () => {
    setExportStep('processing');
    setTimeout(() => {
      setExportStep('done');
    }, 2000);
  };

  if (activeSubView === 'actionLibrary') {
    return <ActionLibraryManager onBack={() => setActiveSubView('none')} />;
  }

  if (activeSubView === 'classes') {
    return (
      <ClassManager 
        klasses={klasses} 
        onUpdateKlasses={onUpdateKlasses} 
        onBack={() => setActiveSubView('none')} 
      />
    );
  }

  if (activeSubView === 'coachDetail' && selectedCoach) {
    return (
      <CoachDetailView 
        coach={selectedCoach} 
        onBack={() => { setActiveSubView('none'); setSelectedCoach(null); }} 
      />
    );
  }

  if (activeSubView === 'complianceDetail') {
    return (
      <ComplianceDetailView 
        deviations={deviations}
        totalUnits={totalPlannedUnits}
        complianceRate={complianceRate}
        unitLogs={MOCK_UNIT_LOGS}
        onBack={() => setActiveSubView('none')}
        onViewFeedback={handleFeedbackClick}
      />
    );
  }

  if (activeSubView === 'classFeedback' && selectedFeedbackClass) {
    return (
      <ClassFeedbackDetailView 
        className={selectedFeedbackClass.name}
        date={selectedFeedbackClass.date}
        onBack={() => { setActiveSubView('none'); setSelectedFeedbackClass(null); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] pt-32 pb-40 px-5 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      
      {/* 核心合规率看板 */}
      <section className="mb-12 relative">
        <div className="flex justify-between items-center mb-6 px-1">
          <div>
            <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px] mb-1">场馆教学合规指数</p>
            <h2 className="text-2xl font-oswald text-white uppercase italic tracking-tighter">Global Compliance</h2>
          </div>
          <button 
            onClick={handleStartExport}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] text-white font-black uppercase tracking-widest active:bg-[#E60012] transition-colors"
          >
            导出分析报表
          </button>
        </div>

        <div 
          onClick={() => setActiveSubView('complianceDetail')}
          className="bg-[#1A1A1A] p-8 rounded-[32px] border-[0.5px] border-white/5 relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
        >
           <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-[100px] font-oswald text-white italic select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity">INDEX</div>
           
           <div className="flex justify-between items-end mb-6 relative z-10">
              <div className="text-6xl font-oswald italic tracking-tighter text-white">
                {complianceRate}<span className="text-xl text-[#8E8E93] ml-1">%</span>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${complianceRate < 80 ? 'text-[#E60012]' : 'text-green-500'}`}>
                  {complianceRate < 80 ? '⚠️ 高风险偏差状态' : '✓ 运行状态良好'}
                </p>
                <p className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest">基于最近 {totalPlannedUnits} 组教学单元分析</p>
                <p className="text-[7px] text-[#E60012] font-black uppercase tracking-[2px] mt-2 italic group-hover:translate-x-1 transition-transform">查看明细列表 →</p>
              </div>
           </div>

           <div className="w-full h-2 bg-black rounded-full overflow-hidden relative z-10">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${complianceRate < 80 ? 'bg-[#E60012]' : 'bg-white'}`}
                style={{ width: `${complianceRate}%` }}
              />
           </div>

           <div className="grid grid-cols-3 gap-2 mt-8 relative z-10">
              {[
                { label: '备课率', val: '98%' },
                { label: '核销率', val: '94%' },
                { label: '学员反馈率', val: '88%' }
              ].map((stat, i) => (
                <div key={i} className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
                   <p className="text-[7px] text-[#8E8E93] font-black uppercase mb-1">{stat.label}</p>
                   <p className="text-xs font-oswald text-white italic">{stat.val}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 快捷入口 */}
      <section className="grid grid-cols-2 gap-4 mb-12">
        <div onClick={() => setActiveSubView('actionLibrary')} className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 active:scale-95 transition-all">
          <p className="text-[#E60012] text-[7px] font-black uppercase tracking-widest mb-2 italic">Standardized</p>
          <h3 className="text-white font-oswald text-lg uppercase italic tracking-tighter">动作资产库</h3>
        </div>
        <div onClick={() => setActiveSubView('classes')} className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 active:scale-95 transition-all">
          <p className="text-[#8E8E93] text-[7px] font-black uppercase tracking-widest mb-2 italic">Management</p>
          <h3 className="text-white font-oswald text-lg uppercase italic tracking-tighter">班级列表库</h3>
        </div>
      </section>

      {/* 风险偏差实时流 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[3px]">高风险技术偏差报告</p>
          <span className="w-2 h-2 rounded-full bg-[#E60012] animate-pulse"></span>
        </div>
        <div className="space-y-4">
          {deviations.length === 0 ? (
            <div className="p-12 border border-dashed border-white/10 rounded-[24px] text-center">
              <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-widest italic opacity-40">今日暂无偏差报告</p>
            </div>
          ) : (
            deviations.map((dev) => (
              <ComplianceCard 
                key={dev.id}
                status="deviation"
                title={`${dev.pack}`}
                subtitle={`教练: ${dev.coach} | 学员: ${dev.student}`}
              >
                <div className="flex justify-between items-center text-[9px] font-black uppercase text-white/60">
                  <span>检测时间: {dev.time}</span>
                  <button className="underline underline-offset-4">追踪干预 →</button>
                </div>
              </ComplianceCard>
            ))
          )}
        </div>
      </section>

      {/* 班级课后反馈记录 - Unified Section */}
      <section className="mb-12">
        <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[3px] mb-6 px-1">班级课后反馈记录 (UNIT LOGS)</p>
        <div className="space-y-4">
          {MOCK_UNIT_LOGS.map(log => (
            <div 
              key={log.id} 
              onClick={() => handleFeedbackClick(log.pack, log.date)}
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
                <span className="text-[7px] text-[#E60012] font-black uppercase tracking-[2px] italic">查看全班反馈 →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 教练合规排名 */}
      <section>
        <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[3px] mb-6 px-1">教练合规力榜单</p>
        <div className="bg-[#1A1A1A] rounded-[24px] border border-white/5 divide-y divide-white/5 overflow-hidden">
          {coachList.map((coach, idx) => (
            <div 
              key={coach.id} 
              onClick={() => handleCoachClick(coach.name, coach.rate, coach.score)}
              className="p-6 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <span className="text-xl font-oswald text-[#8E8E93] opacity-30 italic">0{idx + 1}</span>
                <span className={`text-lg font-bold ${coach.alert ? 'text-[#E60012]' : 'text-white'}`}>{coach.name}</span>
              </div>
              <div className="text-right">
                <p className={`text-sm font-oswald italic ${coach.alert ? 'text-[#E60012]' : 'text-white'}`}>{coach.rate}% 合规</p>
                <p className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest mt-1">评分 {coach.score} →</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Export Report Modal */}
      {isExporting && (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-[32px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(230,0,18,0.1)]">
            {exportStep === 'config' && (
              <div className="animate-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-oswald text-white uppercase italic tracking-tighter mb-4">报表导出配置</h3>
                <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[3px] mb-8 leading-loose">请选择需要导出的数据周期与包含内容。</p>
                <div className="space-y-4 mb-10">
                   <div className="bg-black p-4 rounded-xl border border-white/10 flex justify-between items-center">
                      <span className="text-[10px] text-[#F2F2F2] font-black uppercase tracking-widest">统计周期</span>
                      <span className="text-[10px] text-[#E60012] font-black">今日实时</span>
                   </div>
                   <div className="bg-black p-4 rounded-xl border border-white/10 flex justify-between items-center">
                      <span className="text-[10px] text-[#F2F2F2] font-black uppercase tracking-widest">格式</span>
                      <span className="text-[10px] text-[#8E8E93] font-black">PDF (.audit)</span>
                   </div>
                </div>
                <div className="space-y-3">
                  <button onClick={executeExport} className="w-full py-4 bg-[#E60012] text-white rounded-full font-black text-[11px] uppercase tracking-[3px] active:scale-95 transition-transform">立即生成报表</button>
                  <button onClick={() => setIsExporting(false)} className="w-full py-4 bg-transparent text-[#8E8E93] font-black text-[11px] uppercase tracking-[3px]">取消</button>
                </div>
              </div>
            )}

            {exportStep === 'processing' && (
              <div className="flex flex-col items-center justify-center py-10 animate-in fade-in">
                <div className="w-16 h-16 border-t-2 border-[#E60012] rounded-full animate-spin mb-6"></div>
                <p className="text-white font-oswald text-xl uppercase italic tracking-widest animate-pulse">Data Packing...</p>
                <p className="text-[8px] text-[#8E8E93] font-black uppercase tracking-[4px] mt-4">正在计算教练绩效与合规权重</p>
              </div>
            )}

            {exportStep === 'done' && (
              <div className="text-center animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <span className="text-white text-3xl">✓</span>
                </div>
                <h3 className="text-2xl font-oswald text-white uppercase italic tracking-tighter mb-4">导出就绪</h3>
                <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[3px] mb-10">文件已加密处理，可随时分发给审计部门。</p>
                <button 
                  onClick={() => setIsExporting(false)} 
                  className="w-full py-5 bg-white text-black rounded-full font-black text-[12px] uppercase tracking-[4px] active:scale-95 transition-all"
                >
                  确认并关闭 (OK)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
