
import React from 'react';

interface ClassFeedbackDetailViewProps {
  className: string;
  date: string;
  onBack: () => void;
}

interface StudentFeedbackStatus {
  name: string;
  status: 'completed' | 'pending';
  intensity?: number;
  experience?: number;
  tags?: string[];
}

const MOCK_STUDENTS: StudentFeedbackStatus[] = [
  { name: '张三', status: 'completed', intensity: 4, experience: 5, tags: ['高强度', '动作标准'] },
  { name: '李思', status: 'completed', intensity: 3, experience: 4, tags: ['教学细致'] },
  { name: '王五', status: 'completed', intensity: 5, experience: 3, tags: ['挑战大'] },
  { name: '赵六', status: 'pending' },
  { name: '刘七', status: 'pending' },
  { name: '陈八', status: 'completed', intensity: 4, experience: 4, tags: ['体能提升'] },
];

const ClassFeedbackDetailView: React.FC<ClassFeedbackDetailViewProps> = ({ className, date, onBack }) => {
  const completedFeedback = MOCK_STUDENTS.filter(s => s.status === 'completed');
  const avgIntensity = (completedFeedback.reduce((acc, curr) => acc + (curr.intensity || 0), 0) / completedFeedback.length).toFixed(1);
  const avgExperience = (completedFeedback.reduce((acc, curr) => acc + (curr.experience || 0), 0) / completedFeedback.length).toFixed(1);

  const StatBox = ({ label, value, subValue, icon }: { label: string, value: string, subValue: string, icon: string }) => (
    <div className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 flex flex-col justify-center relative overflow-hidden group">
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] text-6xl group-hover:opacity-[0.05] transition-opacity select-none">{icon}</div>
      <p className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest mb-2 ml-1">{label}</p>
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-3xl font-oswald text-white italic">{value}</span>
        <span className="text-[10px] text-[#8E8E93] font-black uppercase tracking-widest">{subValue}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#000000] z-[300] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter leading-tight">{className}</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px] mt-1">{date} · 教学反馈详情</p>
        </div>
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <StatBox label="平均感受强度" value={avgIntensity} subValue="/ 5.0" icon="⚡️" />
        <StatBox label="平均体验评分" value={avgExperience} subValue="/ 5.0" icon="★" />
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 mb-10">
         <div className="flex justify-between items-center mb-6">
            <h4 className="text-white text-[10px] font-black uppercase tracking-[3px]">反馈完成情况 (COMPLETION)</h4>
            <span className="text-[#8E8E93] text-[10px] font-oswald italic">{completedFeedback.length} / {MOCK_STUDENTS.length}</span>
         </div>
         <div className="w-full h-1 bg-black rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#E60012] transition-all duration-1000"
              style={{ width: `${(completedFeedback.length / MOCK_STUDENTS.length) * 100}%` }}
            />
         </div>
      </div>

      {/* Student List */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2 ml-1">
          <div className="w-1 h-3 bg-[#E60012]"></div>
          <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">学员反馈明细 (STUDENT FEEDBACK)</p>
        </div>

        {MOCK_STUDENTS.map((student, idx) => (
          <div 
            key={idx}
            className={`p-5 rounded-[24px] border transition-all ${student.status === 'pending' ? 'bg-black/40 border-white/5 opacity-60' : 'bg-[#1A1A1A] border-white/10'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black border ${student.status === 'pending' ? 'bg-transparent text-[#8E8E93] border-white/10 border-dashed' : 'bg-[#E60012] text-white border-[#E60012]'}`}>
                   {student.name.charAt(0)}
                </div>
                <div>
                   <h4 className="text-white text-sm font-bold">{student.name}</h4>
                   <p className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${student.status === 'pending' ? 'text-[#E60012] italic' : 'text-[#8E8E93]'}`}>
                     {student.status === 'pending' ? '未打分 / PENDING' : '已提交 / SUBMITTED'}
                   </p>
                </div>
              </div>

              {student.status === 'completed' && (
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[#E60012] text-[10px]">★</span>
                    <span className="text-white font-oswald text-lg italic">{student.experience}.0</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[7px] text-[#8E8E93] font-black uppercase">强度</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-1 h-2 rounded-full ${i <= (student.intensity || 0) ? 'bg-[#E60012]' : 'bg-white/5'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {student.status === 'completed' && student.tags && (
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                {student.tags.map((tag, i) => (
                  <span key={i} className="text-[7px] text-[#8E8E93] font-black border border-white/10 px-2 py-0.5 rounded uppercase">{tag}</span>
                ))}
              </div>
            )}

            {student.status === 'pending' && (
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                 <p className="text-[7px] text-[#8E8E93] italic font-black uppercase tracking-widest">系统已自动推送反馈提醒...</p>
                 <button className="text-[8px] bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-full font-black uppercase hover:bg-white/10 transition-colors">再次催促</button>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Action Footer */}
      <div className="mt-12 mb-10 bg-[#E60012]/5 p-6 rounded-[24px] border border-[#E60012]/20 flex items-start gap-4">
         <div className="w-10 h-10 rounded-full bg-[#E60012]/10 flex items-center justify-center shrink-0">
           <span className="text-[#E60012] text-xl font-black italic">!</span>
         </div>
         <div className="space-y-1">
            <p className="text-[10px] text-white font-bold uppercase tracking-widest">教研数据分析建议</p>
            <p className="text-[10px] text-[#8E8E93] leading-relaxed italic opacity-80">
              当前班级强度反馈波动较大。部分学员反馈“挑战大”，建议在 L2 阶段适当增加热身环节以平衡体能分布。
            </p>
         </div>
      </div>
    </div>
  );
};

export default ClassFeedbackDetailView;
