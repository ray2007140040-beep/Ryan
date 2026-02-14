
import React, { useState, useEffect } from 'react';
import { TECH_PACK_LIBRARY as INITIAL_LIBRARY } from '../constants';
import { TechPack, TechLevel, SubAction } from '../types';
import ComboEditor from './ComboEditor';

interface ActionLibraryManagerProps { onBack: () => void; }

const ActionLibraryManager: React.FC<ActionLibraryManagerProps> = ({ onBack }) => {
  const [localLibrary, setLocalLibrary] = useState<TechPack[]>(INITIAL_LIBRARY);
  const [filter, setFilter] = useState<'all' | 'official' | 'private'>('all');
  const [isComboEditing, setIsComboEditing] = useState(false);
  
  // Logic to handle filtered list
  const filteredLibrary = localLibrary.filter(p => {
    if (filter === 'all') return true;
    return p.origin === filter;
  });

  const [selectedPackId, setSelectedPackId] = useState<string>(filteredLibrary[0]?.id || '');
  const [selectedLvl, setSelectedLvl] = useState<'l1' | 'l2' | 'l3'>('l1');
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewingVideoUrl, setViewingVideoUrl] = useState<string | null>(null);
  
  // Modals/States for Actions
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitCategory, setNewUnitCategory] = useState('自定义分类');

  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newActionName, setNewActionName] = useState('');
  const [renamingActionId, setRenamingActionId] = useState<string | null>(null);
  const [renamingUnitId, setRenamingUnitId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'unit' | 'action', id: string, name: string } | null>(null);

  const currentPack = localLibrary.find(p => p.id === selectedPackId);
  const isOfficial = currentPack?.origin === 'official';
  const currentLvlData = currentPack?.levels[selectedLvl];
  const activeAction = currentLvlData?.actions.find(a => a.id === activeActionId);

  useEffect(() => {
    if (currentLvlData?.actions.length) {
      if (!activeActionId || !currentLvlData.actions.some(a => a.id === activeActionId)) {
        setActiveActionId(currentLvlData.actions[0].id);
      }
    } else {
      setActiveActionId(null);
    }
  }, [selectedPackId, selectedLvl, currentLvlData]);

  // Ensure selectedPackId is valid after filter changes
  useEffect(() => {
    if (!filteredLibrary.some(p => p.id === selectedPackId)) {
        setSelectedPackId(filteredLibrary[0]?.id || '');
    }
  }, [filter, localLibrary]);

  // Unit Operations
  const handleAddUnit = () => {
    if (!newUnitTitle.trim()) return;
    const newId = `tp_custom_${Date.now()}`;
    const newUnit: TechPack = {
      id: newId,
      title: newUnitTitle.trim(),
      category: newUnitCategory,
      origin: 'private',
      can_edit: true,
      levels: {
        l1: { actions: [], points: [], methods: [], steps: [] },
        l2: { actions: [], points: [], methods: [], steps: [] },
        l3: { actions: [], points: [], methods: [], steps: [] }
      }
    };
    setLocalLibrary(prev => [...prev, newUnit]);
    setNewUnitTitle('');
    setIsAddingUnit(false);
    setSelectedPackId(newId);
  };

  const handleSaveCombo = (newCombos: TechPack[]) => {
    setLocalLibrary(prev => [...prev, ...newCombos]);
    // Select the first one from the batch
    if (newCombos.length > 0) {
      setSelectedPackId(newCombos[0].id);
    }
    setIsComboEditing(false);
  };

  const startDeletingUnit = (pack: TechPack, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({ type: 'unit', id: pack.id, name: pack.title });
  };

  const startDeletingAction = (action: SubAction, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteTarget({ type: 'action', id: action.id, name: action.name });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'unit') {
      const remainingLibrary = localLibrary.filter(p => p.id !== deleteTarget.id);
      setLocalLibrary(remainingLibrary);
      if (selectedPackId === deleteTarget.id) {
        const remainingFiltered = filteredLibrary.filter(p => p.id !== deleteTarget.id);
        setSelectedPackId(remainingFiltered[0]?.id || '');
      }
    } else if (deleteTarget.type === 'action') {
      setLocalLibrary(prev => prev.map(pack => pack.id === selectedPackId ? {
        ...pack,
        levels: {
          ...pack.levels,
          [selectedLvl]: {
            ...pack.levels[selectedLvl],
            actions: pack.levels[selectedLvl].actions.filter(a => a.id !== deleteTarget.id)
          }
        }
      } : pack));
      if (activeActionId === deleteTarget.id) {
        setActiveActionId(null);
      }
    }
    setDeleteTarget(null);
  };

  const startRenamingUnit = (pack: TechPack, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingUnitId(pack.id);
    setEditValue(pack.title);
  };

  const submitRenameUnit = () => {
    if (!editValue.trim() || !renamingUnitId) return;
    setLocalLibrary(prev => prev.map(p => p.id === renamingUnitId ? { ...p, title: editValue.trim() } : p));
    setRenamingUnitId(null);
  };

  // Action Operations
  const handleAddSubAction = () => {
    if (!newActionName.trim() || !currentPack || isOfficial) return;
    const newAction: SubAction = { id: `act_${Date.now()}`, name: newActionName.trim(), steps: ['基础准备'] };
    setLocalLibrary(prev => prev.map(pack => pack.id === selectedPackId ? {
      ...pack,
      levels: {
        ...pack.levels,
        [selectedLvl]: { ...pack.levels[selectedLvl], actions: [...(pack.levels[selectedLvl].actions || []), newAction] }
      }
    } : pack));
    setNewActionName('');
    setIsAddingAction(false);
    setActiveActionId(newAction.id);
  };

  const startRenamingAction = (action: SubAction, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingActionId(action.id);
    setEditValue(action.name);
  };

  const submitRenameAction = () => {
    if (!editValue.trim() || !renamingActionId) return;
    setLocalLibrary(prev => prev.map(pack => pack.id === selectedPackId ? {
        ...pack,
        levels: {
            ...pack.levels,
            [selectedLvl]: {
                ...pack.levels[selectedLvl],
                actions: pack.levels[selectedLvl].actions.map(a => a.id === renamingActionId ? { ...a, name: editValue.trim() } : a)
            }
        }
    } : pack));
    setRenamingActionId(null);
  };

  // Step Operations
  const handleUpdateActionStep = (index: number, val: string) => {
    if (!activeActionId || isOfficial) return;
    setLocalLibrary(prev => prev.map(pack => pack.id === selectedPackId ? {
      ...pack,
      levels: {
        ...pack.levels,
        [selectedLvl]: { 
          ...pack.levels[selectedLvl], 
          actions: pack.levels[selectedLvl].actions.map(a => a.id === activeActionId ? {
            ...a,
            steps: a.steps.map((s, i) => i === index ? val : s)
          } : a)
        }
      }
    } : pack));
  };

  const handleAddActionStep = () => {
    if (!activeActionId || isOfficial) return;
    setLocalLibrary(prev => prev.map(pack => pack.id === selectedPackId ? {
      ...pack,
      levels: {
        ...pack.levels,
        [selectedLvl]: { 
          ...pack.levels[selectedLvl], 
          actions: pack.levels[selectedLvl].actions.map(a => a.id === activeActionId ? {
            ...a,
            steps: [...a.steps, '新增执行步骤...']
          } : a)
        }
      }
    } : pack));
  };

  const handleRemoveActionStep = (index: number) => {
    if (!activeActionId || isOfficial) return;
    setLocalLibrary(prev => prev.map(pack => pack.id === selectedPackId ? {
      ...pack,
      levels: {
        ...pack.levels,
        [selectedLvl]: { 
          ...pack.levels[selectedLvl], 
          actions: pack.levels[selectedLvl].actions.map(a => a.id === activeActionId ? {
            ...a,
            steps: a.steps.filter((_, i) => i !== index)
          } : a)
        }
      }
    } : pack));
  };

  const handleSaveLibrary = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  if (isComboEditing) {
    return (
      <ComboEditor 
        existingLibrary={localLibrary} 
        onSave={handleSaveCombo} 
        onCancel={() => setIsComboEditing(false)} 
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto pb-48 no-scrollbar">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">技术动作库管理</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Technical Action Assets</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      {/* Filter Segmented Control */}
      <div className="bg-[#1A1A1A] p-1.5 rounded-2xl flex border border-white/10 mb-8 max-w-sm mx-auto w-full">
        {(['all', 'official', 'private'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`flex-1 py-3 text-[10px] font-black rounded-xl uppercase transition-all ${filter === f ? 'bg-white text-black shadow-lg' : 'text-[#8E8E93]'}`}
          >
            {f === 'all' ? '全部' : f === 'official' ? '宝典标准' : '本馆私有'}
          </button>
        ))}
      </div>

      {/* Unit Selector */}
      <div className="mb-8">
        <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest block mb-4 px-1">技术单元选择 / UNIT SELECTION</label>
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
          {filteredLibrary.map(pack => (
            <div key={pack.id} className="relative shrink-0">
               <button 
                onClick={() => setSelectedPackId(pack.id)} 
                className={`px-6 py-4 rounded-[16px] border text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${selectedPackId === pack.id ? 'bg-white text-black border-white' : 'bg-[#1A1A1A] text-[#8E8E93] border-white/5'}`}
               >
                {pack.title}
                {pack.origin === 'official' ? <span className="text-[#E60012] text-[10px]">🛡️</span> : <span className="text-[#8E8E93] text-[10px]">🔲</span>}
               </button>
               {pack.origin === 'private' && (
                 <div className="absolute -top-2 -right-2 flex gap-1">
                    <button onClick={(e) => startRenamingUnit(pack, e)} className="w-5 h-5 bg-white border border-black/10 rounded-full text-[8px] text-black flex items-center justify-center shadow-lg active:scale-90 transition-transform">✎</button>
                    <button onClick={(e) => startDeletingUnit(pack, e)} className="w-5 h-5 bg-black border border-white/10 rounded-full text-[8px] text-[#E60012] flex items-center justify-center shadow-lg active:scale-90 transition-transform">✕</button>
                 </div>
               )}
            </div>
          ))}
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => setIsComboEditing(true)}
              className="whitespace-nowrap px-6 py-4 rounded-[16px] bg-[#E60012]/10 border border-[#E60012]/40 text-[#E60012] text-xs font-black active:scale-95 transition-transform flex items-center gap-2"
            >
              <span>✨</span> AI 智能组合
            </button>
            <button 
              onClick={() => setIsAddingUnit(true)}
              className="whitespace-nowrap px-6 py-4 rounded-[16px] border border-dashed border-white/20 text-[#8E8E93] text-xs font-black active:scale-95 transition-transform"
            >
              + 新增特色单元
            </button>
          </div>
        </div>
      </div>

      {/* Level Toggle */}
      <div className="bg-[#1A1A1A] p-1 rounded-2xl flex border border-white/5 mb-8">
        {(['l1', 'l2', 'l3'] as const).map(lvl => (
          <button key={lvl} onClick={() => setSelectedLvl(lvl)} className={`flex-1 py-4 text-[10px] font-black rounded-xl transition-all ${selectedLvl === lvl ? 'bg-black text-[#E60012] shadow-lg border-[0.5px] border-[#E60012]/20' : 'text-[#8E8E93]'}`}>{lvl.toUpperCase()} 阶段配置</button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="space-y-8">
        {/* Actions Selection List */}
        <div className={`rounded-[24px] p-8 border border-white/5 relative overflow-hidden ${isOfficial ? 'bg-gradient-to-br from-[#1A1A1A] via-[#241A1A] to-[#1A1A1A]' : 'bg-[#1A1A1A]'}`}>
             {isOfficial && <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none select-none text-8xl font-oswald text-white italic">OFFICIAL</div>}
             <div className="flex justify-between items-center mb-6 relative z-10">
                <h4 className="text-white text-[11px] font-black uppercase tracking-[2px] flex items-center gap-2">
                    <span className="w-1 h-3 bg-[#E60012]"></span>
                    动作指令集 (ACTIONS)
                </h4>
                {isOfficial ? (
                    <span className="px-2 py-0.5 bg-[#E60012] text-white text-[8px] font-black rounded uppercase italic shadow-lg">🛡️ 格斗宝典标准</span>
                ) : (
                    <span className="px-2 py-0.5 bg-black border border-white/10 text-[#8E8E93] text-[8px] font-black rounded uppercase italic">🔲 本馆私有</span>
                )}
             </div>

             <div className="grid grid-cols-1 gap-2 relative z-10">
                {currentLvlData?.actions.map((action, idx) => (
                    <div 
                      key={action.id} 
                      onClick={() => setActiveActionId(action.id)}
                      className={`group/item p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${activeActionId === action.id ? 'bg-[#E60012]/10 border-[#E60012] shadow-lg' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] text-[#E60012] font-black font-oswald w-6 opacity-60">0{idx + 1}</span>
                            <span className="text-sm font-bold text-white">{action.name}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            {action.videoUrl && (
                                <button onClick={(e) => { e.stopPropagation(); setViewingVideoUrl(action.videoUrl!); }} className="w-8 h-8 rounded-full bg-[#E60012] text-white flex items-center justify-center text-[10px] shadow-lg">▶</button>
                            )}
                            {!isOfficial && (
                                <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    <button onClick={(e) => startRenamingAction(action, e)} className="w-8 h-8 rounded-full bg-white/5 text-[10px] text-[#8E8E93] hover:text-white flex items-center justify-center border border-white/5 transition-colors">✎</button>
                                    <button onClick={(e) => startDeletingAction(action, e)} className="w-8 h-8 rounded-full bg-white/5 text-[10px] text-[#E60012] hover:bg-[#E60012] hover:text-white flex items-center justify-center border border-white/5 transition-colors">✕</button>
                                </div>
                            )}
                         </div>
                    </div>
                ))}
                {!isOfficial && (
                    <button onClick={() => setIsAddingAction(true)} className="py-4 border border-dashed border-[#E60012]/30 text-[#E60012] text-[10px] font-black uppercase rounded-2xl mt-2 hover:bg-[#E60012]/5 transition-colors">+ 添加本馆特色细分动作</button>
                )}
             </div>
        </div>

        {/* Dynamic Associated Steps */}
        <div className="bg-[#1A1A1A] rounded-[24px] p-8 border border-white/5 animate-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <div>
               <h4 className="text-white text-[11px] font-black uppercase tracking-[2px] flex items-center gap-2">关联执行步骤</h4>
               <p className="text-[8px] text-[#8E8E93] font-black uppercase mt-1">FOR: <span className="text-white">{activeAction?.name || '未选中动作'}</span></p>
            </div>
            {activeActionId && !isOfficial && (
              <button onClick={handleAddActionStep} className="text-[8px] font-black uppercase border border-white/10 px-2 py-1 rounded text-[#8E8E93] hover:text-white">+ 增加步骤</button>
            )}
            {isOfficial && <span className="text-[8px] text-[#E60012] font-black uppercase italic tracking-widest">官方协议·不可篡改</span>}
          </div>
          
          <div className="space-y-4">
            {!activeActionId ? (
                <div className="py-10 text-center text-[#8E8E93] text-[9px] font-black uppercase tracking-[4px] opacity-40 italic">请点击上方动作以查看其教学步骤</div>
            ) : (
                activeAction?.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start group/step">
                        <span className="text-[#8E8E93] text-[10px] font-black py-2 shrink-0">S.{idx+1}</span>
                        <textarea 
                            value={step} 
                            readOnly={isOfficial}
                            onChange={(e) => handleUpdateActionStep(idx, e.target.value)}
                            rows={1}
                            className={`flex-1 bg-transparent py-1 text-sm text-[#F2F2F2] outline-none transition-all resize-none overflow-hidden ${isOfficial ? 'border-none' : 'border-b border-white/10 focus:border-[#E60012]'}`}
                            onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }}
                        />
                        {!isOfficial && (
                             <button onClick={() => handleRemoveActionStep(idx)} className="text-[#8E8E93] opacity-0 group-hover/step:opacity-100 p-2 hover:text-[#E60012] transition-opacity">✕</button>
                        )}
                    </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Save Button for Private Content */}
      <div className="fixed bottom-10 left-6 right-6 z-[210] flex justify-center pointer-events-none">
         <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl rounded-full p-1.5 border border-white/10 shadow-2xl pointer-events-auto">
            <button 
              onClick={handleSaveLibrary}
              disabled={isSaving || saveSuccess}
              className={`w-full py-5 rounded-full font-oswald text-lg uppercase tracking-[4px] transition-all ${saveSuccess ? 'bg-green-500 text-white' : 'bg-[#E60012] text-white animate-breathe'} active:scale-95`}
            >
              {isSaving ? '同步中...' : saveSuccess ? '✓ 已同步' : '保存本馆特色库'}
            </button>
         </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
          <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in fade-in duration-300">
              <div className="bg-[#1A1A1A] border border-[#E60012]/30 rounded-[32px] p-8 max-w-sm w-full shadow-[0_0_100px_rgba(230,0,18,0.2)] text-center animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 border border-[#E60012] rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-[#E60012] text-3xl font-oswald italic">!</span>
                  </div>
                  <h3 className="text-xl font-oswald text-white uppercase italic tracking-tighter mb-4">确认彻底删除？</h3>
                  <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-[3px] leading-relaxed mb-8">
                      您正在尝试删除私有资产：<br/>
                      <span className="text-white">“{deleteTarget.name}”</span><br/>
                      此操作不可撤销，且会影响已生成的历史教案。
                  </p>
                  <div className="space-y-3">
                      <button onClick={confirmDelete} className="w-full py-4 bg-[#E60012] text-white rounded-full font-black text-[11px] uppercase tracking-[3px] active:scale-95 transition-transform">确认彻底删除</button>
                      <button onClick={() => setDeleteTarget(null)} className="w-full py-4 bg-transparent text-[#8E8E93] font-black text-[11px] uppercase tracking-[3px]">取消</button>
                  </div>
              </div>
          </div>
      )}

      {/* Rename Modal */}
      {(renamingUnitId || renamingActionId) && (
          <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-in zoom-in-95 duration-200">
             <div className="bg-[#1A1A1A] border border-white/10 rounded-[32px] p-8 max-w-sm w-full">
                  <h3 className="text-xl font-oswald text-white uppercase italic mb-6">修改名称</h3>
                  <input 
                    value={editValue} 
                    onChange={e => setEditValue(e.target.value)} 
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white mb-6 outline-none focus:border-[#E60012]" 
                    autoFocus 
                  />
                  <div className="flex gap-3">
                      <button onClick={renamingUnitId ? submitRenameUnit : submitRenameAction} className="flex-1 py-4 bg-[#E60012] text-white rounded-full font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform">确认修改</button>
                      <button onClick={() => { setRenamingUnitId(null); setRenamingActionId(null); }} className="flex-1 py-4 bg-transparent text-[#8E8E93] font-bold text-xs uppercase tracking-widest">取消</button>
                  </div>
             </div>
          </div>
      )}

      {/* Video Preview Overlay */}
      {viewingVideoUrl && (
        <div className="fixed inset-0 z-[500] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h4 className="text-white font-oswald text-xl uppercase italic tracking-tighter">官方演示资源预览</h4>
              <button onClick={() => setViewingVideoUrl(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90">✕</button>
            </div>
            <div className="bg-black aspect-video">
              <video src={viewingVideoUrl} className="w-full h-full object-contain" controls autoPlay />
            </div>
          </div>
        </div>
      )}

      {/* New Unit Modal */}
      {isAddingUnit && (
          <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-in zoom-in-95 duration-200">
              <div className="bg-[#1A1A1A] border border-white/10 rounded-[32px] p-8 max-w-sm w-full">
                  <p className="text-[#E60012] text-[9px] font-black uppercase tracking-[4px] mb-2 italic">Creator Lab</p>
                  <h3 className="text-xl font-oswald text-white uppercase italic mb-6">新增本馆技术单元</h3>
                  <div className="space-y-4 mb-8">
                      <div className="space-y-1.5">
                         <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">单元名称 / UNIT TITLE</label>
                         <input value={newUnitTitle} onChange={e => setNewUnitTitle(e.target.value)} placeholder="输入名称 (例: 本馆特色缠抱)" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#E60012]" autoFocus />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">所属分类 / CATEGORY</label>
                         <input value={newUnitCategory} onChange={e => setNewUnitCategory(e.target.value)} placeholder="例: 近战技巧" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#E60012]" />
                      </div>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={handleAddUnit} className="flex-1 py-4 bg-[#E60012] text-white rounded-full font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform">确认录入</button>
                      <button onClick={() => setIsAddingUnit(false)} className="flex-1 py-4 bg-transparent text-[#8E8E93] font-bold text-xs uppercase tracking-widest">返回</button>
                  </div>
              </div>
          </div>
      )}

      {/* New Action Modal */}
      {isAddingAction && (
          <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-in zoom-in-95 duration-200">
              <div className="bg-[#1A1A1A] border border-white/10 rounded-[32px] p-8 max-w-sm w-full">
                  <h3 className="text-xl font-oswald text-white uppercase italic mb-6">新增细分动作</h3>
                  <input value={newActionName} onChange={e => setNewActionName(e.target.value)} placeholder="输入动作名..." className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white mb-6" autoFocus />
                  <div className="flex gap-3">
                      <button onClick={handleAddSubAction} className="flex-1 py-4 bg-[#E60012] text-white rounded-full font-bold text-xs uppercase tracking-widest">确认录入</button>
                      <button onClick={() => setIsAddingAction(false)} className="flex-1 py-4 bg-transparent text-[#8E8E93] font-bold text-xs uppercase tracking-widest">返回</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ActionLibraryManager;
