
import React from 'react';
import { TECH_PACK_LIBRARY } from '../constants';

interface HonorReportProps {
  actualIds: string[];
  onBack: () => void;
}

const HonorReport: React.FC<HonorReportProps> = ({ actualIds, onBack }) => {
  // 获取掌握的动作列表
  const masteredItems = actualIds.map(id => {
    // 检查是否是库中的动作
    const pack = TECH_PACK_LIBRARY.find(p => p.id === id);
    if (pack) return pack.title;
    // 如果是自定义动作，尝试从缓存或其他地方获取（这里简化处理，显示 ID 或默认文案）
    if (id.startsWith('custom_')) return '教练自定义专项训练';
    return '未知技术单元';
  });

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-[#000000] z-[200] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
      {/* 9:16 海报容器 */}
      <div className="relative w-full max-w-[380px] aspect-[9/16] bg-[#1A1A1A] border-[0.5px] border-[#E60012]/30 rounded-[32px] overflow-hidden flex flex-col shadow-[0_0_80px_rgba(230,0,18,0.2)]">
        
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#E60012 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E60012]/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E60012]/5 blur-[80px] rounded-full -ml-24 -mb-24"></div>

        <div className="p-8 flex-1 flex flex-col relative z-10 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 shrink-0">
            <div>
              <p className="text-[#E60012] text-[9px] font-black uppercase tracking-[4px] mb-1 italic">COMBAT BIBLE</p>
              <h2 className="text-4xl font-oswald text-white uppercase italic tracking-tighter leading-none">FIGHT REPORT</h2>
            </div>
            <div className="text-right">
              <p className="text-[#8E8E93] text-[8px] font-black uppercase tracking-widest">{today}</p>
              <div className="mt-2 flex justify-end">
                <div className="w-8 h-8 rounded-full border border-[#E60012]/30 flex items-center justify-center">
                  <span className="text-[#E60012] text-[10px] font-black">CB</span>
                </div>
              </div>
            </div>
          </div>

          {/* 状态数据栏 */}
          <div className="grid grid-cols-2 gap-3 mb-8 shrink-0">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
              <p className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest mb-1">完成度 (COMPLETION)</p>
              <p className="text-2xl font-oswald text-white italic">100%</p>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
              <p className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest mb-1">强度 (INTENSITY)</p>
              <p className="text-2xl font-oswald text-[#E60012] italic">HIGH</p>
            </div>
          </div>

          {/* 今日掌握技术板块 - 核心滚动区域 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-4 shrink-0 px-1">
              <div className="w-1.5 h-1.5 bg-[#E60012] rounded-full"></div>
              <h3 className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px]">今日掌握技术板块</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-3">
              {masteredItems.length > 0 ? masteredItems.map((title, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                  <span className="text-lg font-oswald text-[#E60012] opacity-40 italic">0{idx + 1}</span>
                  <div>
                    <p className="text-white text-sm font-bold tracking-tight">{title}</p>
                    <p className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest mt-0.5">Verified Protocol</p>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-4">
                  <div className="text-2xl mb-2">🥊</div>
                  <p className="text-[9px] font-black uppercase tracking-widest">今日暂未记录掌握技术</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center shrink-0">
            <p className="text-white font-oswald text-lg italic tracking-widest opacity-80 mb-1">FIGHT HARD. STAY TRUE.</p>
            <p className="text-[#8E8E93] text-[7px] font-black uppercase tracking-[5px]">THE COMBAT BIBLE ECOSYSTEM</p>
          </div>
        </div>

        {/* 侧边装饰条 */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#E60012]/40 to-transparent"></div>
      </div>

      {/* 返回/分享控制 */}
      <div className="mt-12 w-full max-w-[380px] space-y-4">
        <button className="w-full py-5 bg-white text-black rounded-full font-oswald text-lg uppercase tracking-[4px] shadow-2xl active:scale-95 transition-all">保存战报分享</button>
        <button onClick={onBack} className="w-full py-4 bg-transparent text-[#8E8E93] font-black text-[10px] uppercase tracking-[4px] active:text-[#E60012] transition-colors">返回场馆控制中心</button>
      </div>
    </div>
  );
};

export default HonorReport;
