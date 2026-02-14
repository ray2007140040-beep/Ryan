
import React, { useState } from 'react';
import { PlannedItem, TechPack, SubAction } from '../types';
import { TECH_PACK_LIBRARY } from '../constants';

interface CoachOngoingViewProps {
  plan: PlannedItem[];
  onEndLesson: (finalPlan: PlannedItem[]) => void;
  onBack?: () => void;
}

const TRAINING_MODE_LABELS: Record<string, string> = {
    shadow: '空击',
    props: '道具',
    bag: '沙袋',
    mitts: '手靶',
    partner: '对练',
    custom: '自定义'
};

const CoachOngoingView: React.FC<CoachOngoingViewProps> = ({ plan, onEndLesson, onBack }) => {
  const [livePlan, setLivePlan] = useState<PlannedItem[]>([...plan]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [viewingVideoUrl, setViewingVideoUrl] = useState<string | null>(null);
  
  // 选中的预览动作（用于展示步骤）
  const [activeActionPreview, setActiveActionPreview] = useState<SubAction | null>(null);

  const updateActual = (packId: string, updates: Partial<PlannedItem>) => setLivePlan(prev => prev.map(p => p.pack_id === packId ? { ...p, ...updates } : p));
  const removeDrill = (packId: string) => setLivePlan(prev => prev.filter(p => p.pack_id !== packId));
  
  const VideoOverlay = () => viewingVideoUrl && (
    <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-white font-oswald text-xl uppercase italic tracking-tighter">实时技术参考</h4>
          <button onClick={() => setViewingVideoUrl(null)} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">✕</button>
        </div>
        <div className="rounded-[24px] overflow-hidden border border-white/10 shadow-2xl bg-[#1A1A1A]">
          <video src={viewingVideoUrl} className="w-full aspect-video" controls autoPlay />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-32 pb-64 px-5 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <VideoOverlay />
      
      {/* 实时步骤悬浮窗 - 当点击细分动作时显示 */}
      {activeActionPreview && (
          <div className="fixed bottom-36 left-6 right-6 z-[150] bg-[#E60012] text-white p-6 rounded-[32px] shadow-[0_20px_50px_rgba(230,0,18,0.4)] animate-in slide-in-from-bottom-10">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-oswald text-lg uppercase italic tracking-tighter">{activeActionPreview.name} 执行细节</h4>
                  <button onClick={() => setActiveActionPreview(null)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-black">✕</button>
              </div>
              <div className="space-y-3">
                  {activeActionPreview.steps.map((s, i) => (
                      <div key={i} className="flex gap-3 text-sm font-bold items-start border-b border-white/10 pb-2">
                          <span className="opacity-50 font-oswald italic">S.{i+1}</span>
                          <span>{s}</span>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="mb-10 flex justify-between items-end border-b border-white/10 pb-6 px-1">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-[#8E8E93] active:scale-90 transition-all">←</button>
          )}
          <div>
            <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px] mb-1 italic">Active Session</p>
            <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">实时授课面板</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-widest opacity-60">SESSION CLOCK</p>
          <p className="text-xl font-mono font-bold text-[#F2F2F2]">00:45:12</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center px-1">
          <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px] opacity-60">执行队列 (QUEUE)</p>
        </div>
        
        {livePlan.map((item, idx) => {
            const pack = TECH_PACK_LIBRARY.find(p => p.id === item.pack_id);
            const title = item.custom_title || pack?.title || '未知模块';
            const modeLabel = item.training_mode ? TRAINING_MODE_LABELS[item.training_mode] : '默认';

            // 获取选中的细分动作数据
            const selectedActionsData = pack?.levels[item.level]?.actions?.filter(a => 
                item.selected_action_ids?.includes(a.id)
            ) || [];

            return (
              <div key={item.pack_id} className="bg-[#1A1A1A] rounded-[28px] border-[0.5px] border-white/10 p-7 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-5">
                    <div className="w-9 h-9 rounded-full bg-black/60 border border-[#E60012]/30 flex items-center justify-center text-[#E60012] font-oswald italic">{idx + 1}</div>
                    <div>
                      <h3 className="text-lg font-bold text-[#F2F2F2] tracking-tight">{title}</h3>
                      <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-[#8E8E93] font-black uppercase tracking-wider italic opacity-60">{item.level.toUpperCase()} 阶段协议</span>
                          <span className="text-[9px] bg-[#E60012] text-white px-2 py-0.5 rounded font-black uppercase">{modeLabel}</span>
                      </div>
                      
                      {/* 点击动作展开步骤预览 */}
                      {selectedActionsData.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                           {selectedActionsData.map((act, i) => (
                              <button 
                                key={i} 
                                onClick={() => setActiveActionPreview(act)}
                                className={`text-[9px] text-white bg-[#E60012]/10 px-3 py-1.5 rounded-full border border-[#E60012]/30 flex items-center gap-2 active:bg-[#E60012] transition-all`}
                              >
                                <span className="w-1.5 h-1.5 bg-[#E60012] rounded-full"></span>
                                {act.name}
                                {act.videoUrl && <span className="text-[10px] opacity-60">▶</span>}
                              </button>
                           ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => removeDrill(item.pack_id)} className="text-[#8E8E93] text-[10px] font-black uppercase opacity-40 p-2">移除</button>
                </div>
                
                <div className="bg-black/40 rounded-[20px] p-5 border border-white/5 grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-center">
                        <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block">当前组数</label>
                        <input type="number" value={item.frequency} onChange={(e) => updateActual(item.pack_id, { frequency: e.target.value })} className="w-full bg-transparent text-xl text-white font-oswald outline-none text-center" />
                    </div>
                    <div className="space-y-1 text-center">
                        <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block">当前次数</label>
                        <input type="number" value={item.reps} onChange={(e) => updateActual(item.pack_id, { reps: e.target.value })} className="w-full bg-transparent text-xl text-white font-oswald outline-none text-center" />
                    </div>
                </div>
              </div>
            );
        })}
      </div>

      <div className="fixed bottom-28 left-6 right-6 z-[110] flex justify-center max-w-md mx-auto pointer-events-none">
        <div className="w-full bg-white/5 backdrop-blur-2xl rounded-full p-1.5 border border-white/10 shadow-2xl pointer-events-auto">
          <button onClick={() => onEndLesson(livePlan)} className="w-full py-5 rounded-full bg-[#E60012] text-white font-oswald text-lg uppercase tracking-[4px] animate-breathe active:scale-95 transition-all">结束并提交教学报告</button>
        </div>
      </div>
    </div>
  );
};

export default CoachOngoingView;
