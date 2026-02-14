
import React, { useState } from 'react';
import { Klass } from '../types';

interface ClassManagerProps {
  klasses: Klass[];
  onUpdateKlasses: (klasses: Klass[]) => void;
  onBack: () => void;
}

const WEEK_DAYS = [
  { label: '一', value: 1 },
  { label: '二', value: 2 },
  { label: '三', value: 3 },
  { label: '四', value: 4 },
  { label: '五', value: 5 },
  { label: '六', value: 6 },
  { label: '日', value: 0 },
];

const COACH_POOL = [
  { id: 'c1', name: '麦克' },
  { id: 'c2', name: '伊万' },
  { id: 'c3', name: '莎拉' },
  { id: 'c4', name: '杰克' },
  { id: 'c5', name: '大雷' },
];

const MultiSelectDropdown = ({ 
  label, 
  options, 
  selectedIds, 
  onToggle, 
  placeholder 
}: { 
  label: string, 
  options: {id: string, name: string}[], 
  selectedIds: string[], 
  onToggle: (id: string) => void,
  placeholder: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedNames = options.filter(o => selectedIds.includes(o.id)).map(o => o.name);

  return (
    <div className="space-y-1.5 relative">
      <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 flex justify-between items-center cursor-pointer hover:border-white/20 transition-all"
      >
        <span className={`text-sm ${selectedNames.length > 0 ? 'text-white font-bold' : 'text-white/30'}`}>
          {selectedNames.length > 0 ? selectedNames.join('、') : placeholder}
        </span>
        <span className={`text-[#E60012] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[200]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-[100%] left-0 right-0 mt-2 bg-[#252525] border border-white/10 rounded-2xl shadow-2xl z-[210] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-48 overflow-y-auto no-scrollbar py-2">
              {options.map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => onToggle(opt.id)}
                  className="px-6 py-4 hover:bg-white/5 flex items-center justify-between group active:bg-white/10"
                >
                  <span className={`text-sm ${selectedIds.includes(opt.id) ? 'text-white font-bold' : 'text-[#8E8E93]'}`}>
                    {opt.name}
                  </span>
                  {selectedIds.includes(opt.id) && (
                    <span className="text-[#E60012] text-xs font-black">✓</span>
                  )}
                </div>
              ))}
            </div>
            {selectedIds.length > 0 && (
              <div className="bg-black/40 px-6 py-2 border-t border-white/5">
                <p className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest">已选 {selectedIds.length} 位</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const ClassManager: React.FC<ClassManagerProps> = ({ klasses, onUpdateKlasses, onBack }) => {
  const [newName, setNewName] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newTag, setNewTag] = useState('Basic');
  const [newCount, setNewCount] = useState('10');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedCoachIds, setSelectedCoachIds] = useState<string[]>([]);
  const [selectedAssistantIds, setSelectedAssistantIds] = useState<string[]>([]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const toggleCoach = (id: string) => {
    setSelectedCoachIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleAssistant = (id: string) => {
    setSelectedAssistantIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleAdd = () => {
    if (!newName.trim() || !newStartTime.trim() || !newEndTime.trim() || selectedDays.length === 0) return;
    
    const newKlass: Klass = {
      id: `k${Date.now()}`,
      name: newName,
      startTime: newStartTime,
      endTime: newEndTime,
      startDate: newStartDate || undefined,
      endDate: newEndDate || undefined,
      days: [...selectedDays],
      student_count: parseInt(newCount) || 10,
      level_tag: newTag,
      coach_ids: selectedCoachIds,
      assistant_ids: selectedAssistantIds
    };
    
    onUpdateKlasses([...klasses, newKlass]);
    setNewName('');
    setNewStartTime('');
    setNewEndTime('');
    setNewStartDate('');
    setNewEndDate('');
    setSelectedDays([]);
    setSelectedCoachIds([]);
    setSelectedAssistantIds([]);
  };

  const handleDelete = (id: string) => {
    onUpdateKlasses(klasses.filter(k => k.id !== id));
  };

  const getCoachNames = (ids?: string[]) => {
    if (!ids || ids.length === 0) return '未指派';
    return ids.map(id => COACH_POOL.find(c => c.id === id)?.name).filter(Boolean).join('、');
  };

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto pb-32 no-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">班级列表库管理</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Class List Configuration</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      <section className="bg-[#1A1A1A] rounded-[24px] p-6 border border-white/5 mb-10">
        <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px] mb-6 ml-1">录入新班级 (NEW CLASS ENTRY)</p>
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">班级名称 (NAME)</label>
            <input 
              type="text" 
              placeholder="例如：泰拳核心训练班"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-[#E60012]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">开始日期 (START DATE)</label>
              <input 
                type="date" 
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-[#E60012]/50 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">结束日期 (END DATE)</label>
              <input 
                type="date" 
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-[#E60012]/50 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">开始时间 (START TIME)</label>
              <input 
                type="time" 
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-[#E60012]/50 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">结束时间 (END TIME)</label>
              <input 
                type="time" 
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-[#E60012]/50 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">授课容量 (CAPACITY)</label>
              <input 
                type="number" 
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-[#E60012]/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">等级标签 (TAG)</label>
              <select 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm text-white outline-none focus:border-[#E60012]/50"
              >
                <option value="Basic">Basic (基础)</option>
                <option value="Intermediate">Intermediate (进阶)</option>
                <option value="Advanced">Advanced (高级)</option>
                <option value="Professional">Professional (专业)</option>
              </select>
            </div>
          </div>

          <MultiSelectDropdown 
            label="授课教练 (TEACHING COACHES)"
            options={COACH_POOL}
            selectedIds={selectedCoachIds}
            onToggle={toggleCoach}
            placeholder="点击选择教练 (可多选)"
          />

          <MultiSelectDropdown 
            label="授课助教 (ASSISTANT COACHES)"
            options={COACH_POOL}
            selectedIds={selectedAssistantIds}
            onToggle={toggleAssistant}
            placeholder="点击选择助教 (可多选)"
          />

          <div className="space-y-2.5">
            <label className="text-[7px] text-[#8E8E93] font-black uppercase tracking-widest block ml-1">循环周期 (WEEKLY CYCLE)</label>
            <div className="flex justify-between gap-1">
              {WEEK_DAYS.map(day => (
                <button
                  key={day.value}
                  onClick={() => toggleDay(day.value)}
                  className={`flex-1 aspect-square rounded-full border text-[10px] font-black transition-all ${selectedDays.includes(day.value) ? 'bg-[#E60012] border-[#E60012] text-white shadow-[0_0_10px_rgba(230,0,18,0.4)]' : 'bg-black border-white/5 text-[#8E8E93]'}`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleAdd}
            disabled={!newName.trim() || !newStartTime.trim() || !newEndTime.trim() || selectedDays.length === 0}
            className="w-full py-4 bg-[#E60012] text-white rounded-full font-oswald text-sm uppercase tracking-[3px] shadow-[0_10px_30px_rgba(230,0,18,0.3)] disabled:opacity-30 active:scale-95 transition-all"
          >
            确认录入班级
          </button>
        </div>
      </section>

      <section>
        <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px] mb-6 ml-1">当前场馆架构 (CURRENT STRUCTURE)</p>
        <div className="space-y-4">
          {klasses.map((klass) => (
            <div key={klass.id} className="bg-[#1A1A1A] p-5 rounded-[24px] border border-white/5 flex justify-between items-center relative overflow-hidden group">
              <div className="flex items-center gap-5">
                <div className="text-center min-w-[70px]">
                  <p className="text-[#E60012] font-oswald text-[11px] italic leading-tight uppercase">
                    {klass.startTime}<br/>
                    <span className="text-[#8E8E93] text-[7px] not-italic opacity-40">TO</span><br/>
                    {klass.endTime}
                  </p>
                </div>
                <div className="w-[0.5px] h-12 bg-white/10"></div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm truncate max-w-[150px]">{klass.name}</h4>
                  <div className="flex flex-col gap-1 mt-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] text-[#8E8E93] font-black uppercase bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{klass.level_tag}</span>
                      <span className="text-[8px] text-[#E60012] font-black opacity-60 uppercase">周 {klass.days.map(d => WEEK_DAYS.find(wd => wd.value === d)?.label).join('/')}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <p className="text-[7px] text-[#8E8E93] font-black uppercase truncate max-w-[180px]">
                         <span className="text-white/60">教练:</span> {getCoachNames(klass.coach_ids)}
                       </p>
                       <p className="text-[7px] text-[#8E8E93] font-black uppercase truncate max-w-[180px]">
                         <span className="text-white/40">助教:</span> {getCoachNames(klass.assistant_ids)}
                       </p>
                    </div>
                    {klass.startDate && (
                      <p className="text-[7px] text-[#8E8E93] font-black uppercase opacity-40 italic mt-0.5">
                        {klass.startDate} → {klass.endDate || '至今'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(klass.id)}
                className="text-[#8E8E93] text-[10px] font-black uppercase hover:text-[#E60012] p-2 transition-colors shrink-0"
              >
                移除
              </button>
            </div>
          ))}
          {klasses.length === 0 && (
            <div className="text-center py-20 border-[0.5px] border-dashed border-white/10 rounded-2xl">
               <p className="text-[#8E8E93] text-xs font-bold italic opacity-40 uppercase tracking-widest">暂无班级架构数据</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClassManager;
