
import React, { useState } from 'react';
import { TECH_PACK_LIBRARY } from '../constants';
import { TechPack, TechLevel } from '../types';

interface SyllabusManagerProps {
  onBack: () => void;
}

const SyllabusManager: React.FC<SyllabusManagerProps> = ({ onBack }) => {
  const [selectedPackId, setSelectedPackId] = useState<string>(TECH_PACK_LIBRARY[0].id);
  const [selectedLvl, setSelectedLvl] = useState<'l1' | 'l2' | 'l3'>('l1');
  const [viewingVideoUrl, setViewingVideoUrl] = useState<string | null>(null);

  const currentPack = TECH_PACK_LIBRARY.find(p => p.id === selectedPackId);
  const currentLvlData = currentPack?.levels[selectedLvl];

  const VideoOverlay = () => viewingVideoUrl && (
    <div className="fixed inset-0 z-[500] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-[32px] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h4 className="text-white font-oswald text-xl uppercase italic tracking-tighter">官方演示资源</h4>
          <button onClick={() => setViewingVideoUrl(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90 transition-all">✕</button>
        </div>
        <div className="bg-black aspect-video">
          <video src={viewingVideoUrl} className="w-full h-full object-contain" controls autoPlay />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto pb-32">
      <VideoOverlay />
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">大纲资源库管理</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Syllabus Configuration</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      {/* Plate Selector */}
      <div className="mb-8">
        <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest block mb-4 ml-1">选择动作板块 / ITEM SELECTION</label>
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
          {TECH_PACK_LIBRARY.map(pack => (
            <button
              key={pack.id}
              onClick={() => setSelectedPackId(pack.id)}
              className={`whitespace-nowrap px-6 py-4 rounded-[16px] border text-xs font-bold transition-all ${selectedPackId === pack.id ? 'bg-white text-black border-white' : 'bg-[#1A1A1A] text-[#8E8E93] border-white/5'}`}
            >
              {pack.title}
            </button>
          ))}
          <button className="whitespace-nowrap px-6 py-4 rounded-[16px] border border-dashed border-[#E60012]/40 text-[#E60012] text-xs font-black">+ 新增板块</button>
        </div>
      </div>

      {/* Level Toggle */}
      <div className="bg-[#1A1A1A] p-1 rounded-2xl flex border border-white/5 mb-8">
        {(['l1', 'l2', 'l3'] as const).map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLvl(lvl)}
            className={`flex-1 py-4 text-[10px] font-black rounded-xl transition-all ${selectedLvl === lvl ? 'bg-black text-[#E60012] shadow-lg border-[0.5px] border-[#E60012]/20' : 'text-[#8E8E93]'}`}
          >
            {lvl.toUpperCase()} 阶段配置
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* Official Video Asset (Read-only) */}
        <div className="bg-[#1A1A1A] rounded-[24px] p-8 border border-white/5">
          <h4 className="text-white text-[11px] font-black uppercase tracking-[2px] mb-6 flex items-center gap-2">
            <span className="w-1 h-3 bg-[#E60012]"></span>
            教学配套视频 (VIDEO ASSET)
          </h4>
          
          {currentLvlData?.videoUrl ? (
            <div className="relative group rounded-[16px] overflow-hidden border border-white/10 aspect-video mb-4 bg-black">
               <video src={currentLvlData.videoUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <button onClick={() => setViewingVideoUrl(currentLvlData.videoUrl!)} className="w-16 h-16 rounded-full bg-[#E60012] flex items-center justify-center text-white shadow-xl scale-95 group-hover:scale-100 transition-transform">▶</button>
               </div>
               <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/5">
                  <p className="text-[8px] text-white font-black uppercase tracking-widest italic text-center">官方预设资产 · 只读</p>
               </div>
            </div>
          ) : (
            <div className="p-12 border-[0.5px] border-dashed border-white/10 rounded-[16px] flex flex-col items-center justify-center text-[#8E8E93] mb-4">
              <div className="text-3xl mb-2 opacity-20">🎞️</div>
              <p className="text-[9px] font-black tracking-[4px] uppercase text-center leading-loose opacity-40 italic">当前级别暂无官方演示资产</p>
            </div>
          )}
        </div>

        {/* Training Methods */}
        <div className="bg-[#1A1A1A] rounded-[24px] p-8 border border-white/5">
          <h4 className="text-white text-[11px] font-black uppercase tracking-[2px] mb-6 flex items-center gap-2">
            <span className="w-1 h-3 bg-[#E60012]"></span>
            训练方法 (TRAINING METHODS)
          </h4>
          <div className="space-y-4">
            {currentLvlData?.methods.map((method, idx) => (
              <div key={method.id} className="bg-black/50 p-5 rounded-2xl border border-white/5 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                   <span className="font-oswald text-[#E60012] opacity-40">0{idx+1}</span>
                   <div>
                      <div className="text-white text-sm font-bold">{method.name}</div>
                      <div className="text-[10px] text-[#8E8E93] italic mt-1">{method.description}</div>
                   </div>
                </div>
                <button className="text-[#8E8E93] opacity-0 group-hover:opacity-100 transition-opacity">编辑</button>
              </div>
            ))}
            <button className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-[9px] text-[#8E8E93] font-black uppercase tracking-widest active:bg-white/5">+ 添加新的训练方法</button>
          </div>
        </div>

        {/* Technical Steps */}
        <div className="bg-[#1A1A1A] rounded-[24px] p-8 border border-white/5">
          <h4 className="text-white text-[11px] font-black uppercase tracking-[2px] mb-6 flex items-center gap-2">
            <span className="w-1 h-3 bg-[#E60012]"></span>
            核心步骤 (TECH STEPS)
          </h4>
          <div className="space-y-3">
            {/* Added optional chaining for steps collection for safety */}
            {currentLvlData?.steps?.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                 <span className="text-[#8E8E93] text-[10px] font-black py-1">STEP {idx+1}</span>
                 <input defaultValue={step} className="flex-1 bg-transparent border-b border-white/10 pb-2 text-sm text-[#F2F2F2] outline-none focus:border-[#E60012]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
         <button className="w-full py-5 rounded-full bg-[#E60012] text-white font-oswald text-xl uppercase tracking-[4px] shadow-2xl active:scale-95 transition-all">确认保存大纲修改</button>
      </div>
    </div>
  );
};

export default SyllabusManager;
