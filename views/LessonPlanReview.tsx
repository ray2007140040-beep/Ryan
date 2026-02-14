
import React, { useState } from 'react';
import { PlannedItem } from '../types';
import { TECH_PACK_LIBRARY } from '../constants';

interface LessonPlanReviewProps {
  plan: PlannedItem[];
  onConfirm: () => void;
  onBack: () => void;
  onSaveDailyPlan: () => void;
  onReturnToClass: () => void;
}

const TRAINING_MODE_LABELS: Record<string, string> = {
    shadow: '空击',
    props: '道具',
    bag: '沙袋',
    mitts: '手靶',
    partner: '对练',
    custom: '自定义'
};

const LessonPlanReview: React.FC<LessonPlanReviewProps> = ({ 
  plan, onConfirm, onBack, onSaveDailyPlan, onReturnToClass 
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [viewingVideoUrl, setViewingVideoUrl] = useState<string | null>(null);
  const totalDuration = plan.reduce((sum, item) => sum + item.duration, 0);

  const handleSave = () => {
    onSaveDailyPlan();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const VideoOverlay = () => viewingVideoUrl && (
    <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-white font-oswald text-xl uppercase italic tracking-tighter">动作参考预览</h4>
          <button onClick={() => setViewingVideoUrl(null)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90">✕</button>
        </div>
        <div className="rounded-[24px] overflow-hidden border border-white/10 shadow-2xl bg-[#1A1A1A]">
          <video src={viewingVideoUrl} className="w-full aspect-video" controls autoPlay />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#000] z-[200] flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-20 duration-500 no-scrollbar">
      <VideoOverlay />
      <div className="mt-20 mb-12 flex justify-between items-end border-l-[6px] border-[#E60012] pl-6">
        <div><h2 className="text-4xl font-oswald text-white uppercase italic tracking-tighter mb-1">协议内容确认</h2><p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[4px] opacity-60 italic tracking-widest">PROTOCOL REVIEW</p></div>
        <button onClick={onReturnToClass} className="text-[#8E8E93] text-[10px] font-black uppercase border-b border-white/10 pb-1 active:text-[#E60012] transition-colors">返回班级</button>
      </div>

      <div className="bg-[#1A1A1A] rounded-[32px] p-8 border-[0.5px] border-white/5 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-[120px] font-oswald text-white leading-none pointer-events-none italic">ACTION</div>
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8 relative z-10">
          <div className="space-y-1"><span className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">预计训练总时长</span></div>
          <div className="text-right"><span className="text-5xl font-oswald text-[#E60012] italic">{totalDuration}</span><span className="text-[10px] font-black text-[#E60012] ml-2 tracking-widest italic">MINS</span></div>
        </div>
        <div className="space-y-10 relative z-10">
          {plan.map((item, index) => {
            const pack = TECH_PACK_LIBRARY.find(tp => tp.id === item.pack_id);
            const modeLabel = item.training_mode ? TRAINING_MODE_LABELS[item.training_mode] : '默认';
            
            // Show only selected actions
            const selectedActions = pack?.levels[item.level]?.actions?.filter(a => 
                item.selected_action_ids?.includes(a.id)
            ) || [];

            return (
              <div key={item.pack_id} className="relative pl-12 group">
                <div className="absolute left-0 top-0 bottom-[-40px] w-[0.5px] bg-gradient-to-b from-[#E60012] via-white/5 to-transparent last:bottom-0"></div>
                <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full bg-[#E60012] shadow-lg"></div>
                <div className="mb-3 flex flex-col">
                    <span className="text-[8px] font-black text-[#8E8E93] uppercase italic mb-1">UNIT 0{index + 1}</span>
                    <span className="text-lg font-bold text-[#F2F2F2] tracking-tight">{item.custom_title || pack?.title}</span>
                </div>
                
                {/* 详情标签行 */}
                <div className="flex flex-wrap gap-2.5 items-center mb-2">
                    <div className="px-3 py-1 bg-white text-black rounded-lg border border-white/5 flex items-center gap-2">
                        <span className="text-[7px] font-black uppercase tracking-wider">方式</span>
                        <span className="text-[10px] font-black uppercase">
                            {modeLabel}
                            {item.training_mode === 'custom' && item.custom_training_mode && ` : ${item.custom_training_mode}`}
                        </span>
                    </div>

                    <div className="px-3 py-1 bg-black/40 rounded-lg border border-white/5 flex items-center gap-2">
                        <span className="text-[7px] text-[#8E8E93] font-black uppercase">阶段</span>
                        <span className="text-[10px] text-[#E60012] font-black uppercase">{item.level.toUpperCase()}</span>
                    </div>
                    
                    <div className="px-3 py-1 bg-black/40 rounded-lg border border-white/5 flex items-center gap-2">
                        <span className="text-[7px] text-[#8E8E93] font-black uppercase">量级</span>
                        <span className="text-[10px] text-white font-black">{item.frequency}X{item.reps}</span>
                    </div>
                </div>

                {/* Display Selected Actions Only */}
                {selectedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedActions.map((act, i) => (
                            <button 
                              key={i} 
                              onClick={() => act.videoUrl && setViewingVideoUrl(act.videoUrl)}
                              className={`text-[9px] text-[#D1D1D6] bg-white/5 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1 ${act.videoUrl ? 'active:bg-[#E60012]/10 active:border-[#E60012]/30' : ''}`}
                            >
                                <span className="w-1 h-1 bg-[#E60012] rounded-full"></span>
                                {act.name}
                                {act.videoUrl && <span className="ml-1 opacity-60">▶</span>}
                            </button>
                        ))}
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#E60012]/5 p-6 rounded-[24px] border-[0.5px] border-[#E60012]/20 mb-56 flex items-start gap-5">
         <div className="w-10 h-10 rounded-full bg-[#E60012]/10 flex items-center justify-center shrink-0"><span className="text-[#E60012] text-xl font-black italic">!</span></div>
         <div className="space-y-1"><p className="text-[10px] text-white font-bold uppercase tracking-widest">技术执行合规预警</p><p className="text-[10px] text-[#8E8E93] leading-relaxed italic opacity-80">确认后协议将同步。漏教将被记录为偏差。</p></div>
      </div>

      <div className="fixed bottom-10 left-6 right-6 z-[210] flex flex-col gap-4 max-w-md mx-auto pointer-events-none">
        <button onClick={handleSave} disabled={isSaved} className={`w-full py-4 rounded-full font-oswald text-xs uppercase tracking-widest transition-all border border-white/10 backdrop-blur-xl pointer-events-auto ${isSaved ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 text-[#8E8E93]'}`}>
          {isSaved ? '已保存至本日技术协议库' : '保存为本日技术动作协议 (SAVE)'}
        </button>
        <div className="bg-white/5 backdrop-blur-2xl rounded-full p-1.5 border border-white/10 shadow-2xl pointer-events-auto flex gap-2">
          <button onClick={onBack} className="flex-1 py-5 rounded-full bg-[#1A1A1A] text-[#8E8E93] font-oswald text-sm uppercase tracking-[3px] active:scale-95 transition-all">调整</button>
          <button onClick={onConfirm} className="flex-[3] py-5 rounded-full bg-[#E60012] text-white font-oswald text-lg uppercase tracking-[4px] shadow-lg animate-breathe active:scale-95 transition-all">确认执行教案</button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanReview;
