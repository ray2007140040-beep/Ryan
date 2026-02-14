
import React, { useState } from 'react';
import { TECH_PACK_LIBRARY } from '../constants';

interface StudentViewProps {
  plan: Array<{ pack_id: string; custom_title?: string; level: 'l1' | 'l2' | 'l3' }>;
  onComplete: (actual_ids: string[], isDeviation: boolean, feedback: { intensity: number, experience: number }) => void;
}

const StudentView: React.FC<StudentViewProps> = ({ plan, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [intensity, setIntensity] = useState<number>(3); // 1-5
  const [experience, setExperience] = useState<number>(3); // 1-5
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentDeviationPack, setCurrentDeviationPack] = useState<string | null>(null);

  const handleSelect = (packId: string, taught: boolean) => {
    if (!taught) {
      setCurrentDeviationPack(packId);
      setShowConfirm(true);
    } else {
      setAnswers(prev => ({ ...prev, [packId]: true }));
    }
  };

  const confirmDeviation = () => {
    if (currentDeviationPack) {
      setAnswers(prev => ({ ...prev, [currentDeviationPack]: false }));
      setCurrentDeviationPack(null);
      setShowConfirm(false);
    }
  };

  const allAnswered = plan.every(p => answers[p.pack_id] !== undefined);
  const isDeviation = Object.values(answers).some(val => val === false);

  const handleSubmit = () => {
    const actualIds = Object.entries(answers)
      .filter(([_, taught]) => taught)
      .map(([id, _]) => id);
    // 扩展 onComplete 以包含新的评分项
    onComplete(actualIds, isDeviation, { intensity, experience });
  };

  const RatingBar = ({ label, value, onChange, options }: { label: string, value: number, onChange: (v: number) => void, options: string[] }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] text-[#8E8E93] font-black uppercase tracking-[3px]">{label}</label>
        <span className="text-[10px] text-[#E60012] font-black italic">{options[value - 1]}</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`
              flex-1 py-4 rounded-xl border font-oswald italic transition-all
              ${value === num 
                ? 'bg-[#E60012] border-[#E60012] text-white shadow-[0_0_15px_rgba(230,0,18,0.2)]' 
                : 'bg-[#1A1A1A] border-white/5 text-[#8E8E93]'}
            `}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#000000] z-[100] flex flex-col px-6 pt-24 pb-10 overflow-y-auto no-scrollbar">
      <div className="mb-12 text-center animate-in fade-in duration-700">
        <p className="text-[#E60012] text-[9px] font-black uppercase tracking-[5px] mb-2 italic">Session Feedback</p>
        <h1 className="text-3xl font-oswald text-[#F2F2F2] mb-3 uppercase tracking-tighter italic">课后学员反馈表</h1>
        <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[2px] leading-relaxed opacity-60">请如实反馈您的训练感受<br/>您的意见是教学标准化的核心依据。</p>
      </div>

      <div className="space-y-12 mb-12">
        {/* 综合评价项 */}
        <section className="bg-[#1A1A1A] p-6 rounded-[28px] border border-white/5 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <RatingBar 
            label="训练强度感受 (INTENSITY)" 
            value={intensity} 
            onChange={setIntensity} 
            options={['极轻', '适中', '较高', '力竭', '超越极限']} 
          />
          <RatingBar 
            label="训练体验评分 (EXPERIENCE)" 
            value={experience} 
            onChange={setExperience} 
            options={['较差', '普通', '良好', '非常棒', '极致完美']} 
          />
        </section>

        {/* 核心教案核销 */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1 h-3 bg-[#E60012]"></div>
            <h2 className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[3px]">教案执行核销 (VERIFICATION)</h2>
          </div>
          
          <div className="space-y-6">
            {plan.map((p) => {
              const pack = TECH_PACK_LIBRARY.find(tp => tp.id === p.pack_id);
              const title = p.custom_title || pack?.title || '未知模块';
              const status = answers[p.pack_id];

              return (
                <div key={p.pack_id} className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold transition-colors ${status === false ? 'text-[#8E8E93]' : 'text-[#F2F2F2]'}`}>
                      {title}
                    </h3>
                    <p className="text-[9px] font-black text-[#E60012] uppercase tracking-[2px] mt-1 italic opacity-60">
                      {p.custom_title ? '特别指令 / CUSTOM' : `${p.level.toUpperCase()} 阶段协议`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSelect(p.pack_id, true)}
                      className={`
                        py-4 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest
                        ${status === true 
                          ? 'bg-[#E60012] border-[#E60012] text-white' 
                          : 'bg-black border-white/5 text-[#8E8E93]'}
                      `}
                    >
                      确认已授课
                    </button>
                    <button
                      onClick={() => handleSelect(p.pack_id, false)}
                      className={`
                        py-4 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest
                        ${status === false 
                          ? 'bg-white border-white text-black' 
                          : 'bg-black border-white/5 text-[#8E8E93]'}
                      `}
                    >
                      未教此项
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="pb-10 animate-in fade-in duration-1000">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`
            w-full py-5 rounded-full font-oswald text-xl uppercase tracking-[4px] transition-all duration-500 shadow-2xl
            ${allAnswered ? 'bg-[#E60012] text-white animate-breathe' : 'bg-[#1A1A1A] text-[#8E8E93] opacity-30'}
          `}
        >
          提交反馈并查看战报
        </button>
      </div>

      {/* 极简确认弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[110] flex items-center justify-center p-8">
          <div className="bg-[#1A1A1A] p-10 rounded-[32px] border-[0.5px] border-[#E60012]/30 text-center max-w-sm shadow-[0_0_100px_rgba(230,0,18,0.2)]">
            <div className="w-16 h-16 border border-[#E60012] rounded-full flex items-center justify-center mx-auto mb-6">
               <span className="text-[#E60012] text-3xl font-oswald italic">!</span>
            </div>
            <h4 className="text-[#F2F2F2] font-black text-xl mb-4 tracking-tight">确认技术偏差？</h4>
            <p className="text-[#8E8E93] text-[10px] uppercase font-black tracking-widest mb-10 leading-loose opacity-80">
              您确定教练今天未教授此项内容吗？<br/>记录将同步至管理后台。
            </p>
            <div className="space-y-4">
              <button onClick={confirmDeviation} className="w-full py-4 bg-[#E60012] text-white rounded-full font-black text-[11px] uppercase tracking-[3px] active:scale-95 transition-all">确认上报偏差</button>
              <button onClick={() => setShowConfirm(false)} className="w-full py-4 bg-transparent text-[#8E8E93] font-black text-[11px] uppercase tracking-[3px] active:text-white transition-all">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentView;
