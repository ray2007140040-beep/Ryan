
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { TECH_PACK_LIBRARY } from '../constants';
import { PlannedItem, Klass, TechPack, TechLevel, TrainingMode } from '../types';

interface CoachViewProps {
  onGeneratePlan: (plan: PlannedItem[]) => void;
  onExecutePlan: (plan: PlannedItem[]) => void;
  selectedKlass: Klass | null;
  onSelectKlass: (klass: Klass) => void;
  onBackToSchedule: () => void;
  savedPlans: Record<string, PlannedItem[]>;
  completedKlassIds: string[];
  klasses: Klass[];
}

const TRAINING_MODES: { key: TrainingMode; label: string }[] = [
  { key: 'shadow', label: '空击' },
  { key: 'props', label: '道具' },
  { key: 'bag', label: '沙袋' },
  { key: 'mitts', label: '手靶' },
  { key: 'partner', label: '对练' },
  { key: 'custom', label: '自定义' },
];

const CoachView: React.FC<CoachViewProps> = ({ 
  onGeneratePlan, onExecutePlan, selectedKlass, onSelectKlass, onBackToSchedule, savedPlans, completedKlassIds, klasses
}) => {
  const [activeItems, setActiveItems] = useState<PlannedItem[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [viewingVideoUrl, setViewingVideoUrl] = useState<string | null>(null);

  const [library, setLibrary] = useState<TechPack[]>(TECH_PACK_LIBRARY);
  const [isComboMode, setIsComboMode] = useState(false);
  const [comboSelectedIds, setComboSelectedIds] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResult, setAiResult] = useState<TechPack | null>(null);

  const dateKey = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);
  const currentSavedPlan = useMemo(() => selectedKlass ? savedPlans[`${selectedKlass.id}_${dateKey}`] : null, [selectedKlass, dateKey, savedPlans]);
  const filteredKlasses = useMemo(() => klasses.filter(k => k.days.includes(selectedDate.getDay())), [klasses, selectedDate]);
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear(), month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [selectedDate]);

  const handleKlassClick = (klass: Klass) => {
    onSelectKlass(klass);
    const existing = savedPlans[`${klass.id}_${dateKey}`];
    if (existing) { setActiveItems(existing); setIsEditingExisting(false); }
    else { setActiveItems([]); setIsEditingExisting(true); }
  };

  const toggleComboSelection = (id: string) => {
    setComboSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addPackFromLibrary = (packId: string) => {
    if (activeItems.some(p => p.pack_id === packId)) return;
    setActiveItems(prev => [
      ...prev,
      {
        pack_id: packId,
        level: 'l1',
        frequency: '3',
        reps: '12',
        duration: 10,
        training_mode: 'shadow',
        selected_action_ids: []
      }
    ]);
    setShowLibrary(false);
  };

  const updateItem = (packId: string, updates: Partial<PlannedItem>) => {
    setActiveItems(prev => prev.map(p => {
      if (p.pack_id !== packId) return p;
      let newSelectedIds = p.selected_action_ids;
      if (updates.level && updates.level !== p.level) newSelectedIds = [];
      return { ...p, ...updates, selected_action_ids: newSelectedIds };
    }));
  };

  const toggleActionSelection = (packId: string, actionId: string) => {
    setActiveItems(prev => prev.map(item => {
      if (item.pack_id !== packId) return item;
      const currentIds = item.selected_action_ids || [];
      const newIds = currentIds.includes(actionId) ? currentIds.filter(id => id !== actionId) : [...currentIds, actionId];
      return { ...item, selected_action_ids: newIds };
    }));
  };

  if (!selectedKlass) {
    return (
      <div className="min-h-screen bg-black pt-28 pb-40 px-6 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-white font-oswald text-xl uppercase italic tracking-tighter">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <div className="flex gap-2">
              <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#8E8E93]">‹</button>
              <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#8E8E93]">›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, idx) => {
              const isSelected = date?.toDateString() === selectedDate.toDateString();
              return <div key={idx} onClick={() => date && setSelectedDate(new Date(date))} className={`aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold cursor-pointer transition-all ${!date ? 'opacity-0 pointer-events-none' : ''} ${isSelected ? 'bg-[#E60012] text-white shadow-lg' : 'text-[#8E8E93] hover:bg-white/5'}`}>{date?.getDate()}</div>;
            })}
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-[#8E8E93] text-[9px] font-black tracking-[5px] uppercase">今日课表 / SCHEDULE</h2>
          {filteredKlasses.map(klass => {
            const isCompleted = completedKlassIds.includes(klass.id);
            return (
              <div key={klass.id} onClick={() => handleKlassClick(klass)} className={`bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 flex justify-between items-center group ${isCompleted ? 'opacity-50' : ''}`}>
                <div className="flex gap-6 items-center">
                   <div className="text-center min-w-[60px]">
                      <p className="font-oswald text-sm italic text-[#E60012]">{klass.startTime}</p>
                      <p className="font-oswald text-sm italic text-[#E60012]">{klass.endTime}</p>
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-white">{klass.name}</h3>
                      <span className="text-[9px] text-[#8E8E93] font-black uppercase">{klass.level_tag}</span>
                   </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#E60012]">→</div>
              </div>
            );
          })}
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-80 px-5 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-8 px-1">
        <button onClick={onBackToSchedule} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#8E8E93] active:scale-90 transition-all">←</button>
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#E60012] rounded-full animate-pulse"></span><span className="text-[#E60012] font-mono text-[10px] font-black italic">Planning Session</span></div>
      </div>
      
      <div className="space-y-8">
        {activeItems.map((item, index) => {
          const pack = library.find(p => p.id === item.pack_id);
          const isOfficial = pack?.origin === 'official';
          return (
            <div key={item.pack_id} className={`rounded-[28px] border border-white/5 p-6 relative overflow-hidden group ${isOfficial ? 'bg-gradient-to-br from-[#1A1A1A] via-[#241A1A] to-[#1A1A1A]' : 'bg-[#1A1A1A]'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    {pack?.title}
                    {isOfficial ? <span className="text-[12px]">🛡️</span> : <span className="text-[12px]">🔲</span>}
                  </h3>
                  <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isOfficial ? 'text-[#E60012]' : 'text-[#8E8E93]'}`}>
                    {isOfficial ? '格斗宝典标准' : '本馆私有动作'}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block mb-2">训练阶段</label>
                  <div className="flex bg-black rounded-lg p-1 border border-white/10">
                    {(['l1', 'l2', 'l3'] as const).map(lvl => (
                      <button key={lvl} onClick={() => updateItem(item.pack_id, { level: lvl })} className={`flex-1 py-1.5 rounded text-[9px] font-black uppercase transition-all ${item.level === lvl ? 'bg-[#E60012] text-white' : 'text-[#8E8E93]'}`}>{lvl}</button>
                    ))}
                  </div>
                </div>
                {pack?.levels[item.level]?.actions && pack.levels[item.level].actions.length > 0 && (
                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                    <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block mb-2">选择核心动作</label>
                    <div className="flex flex-wrap gap-2">
                      {pack.levels[item.level].actions.map(action => (
                        <button key={action.id} onClick={() => toggleActionSelection(item.pack_id, action.id)} className={`px-2 py-1.5 rounded text-[10px] font-bold border transition-all ${item.selected_action_ids?.includes(action.id) ? 'bg-[#E60012] text-white border-[#E60012]' : 'bg-black text-[#8E8E93] border-white/10'}`}>{action.name}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black p-3 rounded-xl border border-white/10">
                    <label className="text-[7px] text-[#8E8E93] font-black uppercase block mb-1">组数</label>
                    <input type="number" value={item.frequency} onChange={e => updateItem(item.pack_id, { frequency: e.target.value })} className="w-full bg-transparent text-white font-oswald text-lg outline-none text-center" />
                  </div>
                  <div className="bg-black p-3 rounded-xl border border-white/10">
                    <label className="text-[7px] text-[#8E8E93] font-black uppercase block mb-1">次数</label>
                    <input type="number" value={item.reps} onChange={e => updateItem(item.pack_id, { reps: e.target.value })} className="w-full bg-transparent text-white font-oswald text-lg outline-none text-center" />
                  </div>
                  <div className="bg-black p-3 rounded-xl border border-white/10">
                    <label className="text-[7px] text-[#8E8E93] font-black uppercase block mb-1">时长</label>
                    <input type="number" value={item.duration} onChange={e => updateItem(item.pack_id, { duration: parseInt(e.target.value) || 0 })} className="w-full bg-transparent text-white font-oswald text-lg outline-none text-center" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-28 left-6 right-6 z-[100] flex flex-col gap-3 max-w-md mx-auto pointer-events-none">
        <div className="pointer-events-auto bg-white/5 backdrop-blur-2xl rounded-full p-1.5 border border-white/10 shadow-2xl flex gap-2">
           <button onClick={() => setShowLibrary(true)} className="flex-1 py-5 rounded-full bg-[#1A1A1A] text-white font-oswald text-lg uppercase tracking-[2px] border border-white/5">添加动作</button>
           <button onClick={() => onGeneratePlan(activeItems)} disabled={activeItems.length === 0} className="flex-[2] py-5 rounded-full bg-[#E60012] text-white font-oswald text-lg uppercase tracking-[4px] disabled:opacity-50 animate-breathe transition-all">生成教案</button>
        </div>
      </div>

      {showLibrary && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex flex-col animate-in fade-in duration-300">
           <div className="pt-16 px-6 pb-6 border-b border-white/10 flex justify-between items-end">
              <div>
                 <p className="text-[#E60012] text-[9px] font-black uppercase tracking-[4px] mb-1 italic">Asset Library</p>
                 <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">动作资产库</h2>
              </div>
              <button onClick={() => setShowLibrary(false)} className="w-12 h-12 bg-[#1A1A1A] rounded-full text-white flex items-center justify-center text-xl">✕</button>
           </div>
           <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-32">
              <div className="space-y-3">
                 {library.map(pack => (
                    <div key={pack.id} onClick={() => addPackFromLibrary(pack.id)} className={`p-5 rounded-[20px] border transition-all flex justify-between items-center active:scale-95 ${pack.origin === 'official' ? 'bg-gradient-to-br from-[#1A1A1A] via-[#241A1A] to-[#1A1A1A] border-white/10' : 'bg-[#1A1A1A] border-white/5'}`}>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <p className={`text-[8px] font-black uppercase tracking-widest ${pack.origin === 'official' ? 'text-[#E60012]' : 'text-[#8E8E93]'}`}>{pack.category}</p>
                             {pack.origin === 'official' ? <span className="text-[10px]">🛡️</span> : <span className="text-[10px]">🔲</span>}
                          </div>
                          <h4 className="font-bold text-lg text-[#F2F2F2]">{pack.title}</h4>
                       </div>
                       <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white">+</div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CoachView;
