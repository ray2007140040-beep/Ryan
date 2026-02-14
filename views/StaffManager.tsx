
import React, { useState } from 'react';
import { StaffMember } from '../types';

interface StaffManagerProps {
  onBack: () => void;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: 's1', name: '麦克教练', role: 'coach', joinDate: '2023-01-15', status: 'active', phone: '13800138000' },
  { id: 's2', name: 'Sarah', role: 'coach', joinDate: '2023-03-22', status: 'active', phone: '13900139000' },
  { id: 's3', name: '前台 小王', role: 'reception', joinDate: '2023-06-01', status: 'active', phone: '13700137000' },
];

const StaffManager: React.FC<StaffManagerProps> = ({ onBack }) => {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [isAdding, setIsAdding] = useState(false);
  
  // New Staff Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'coach'|'reception'>('coach');
  const [newPhone, setNewPhone] = useState('');

  const handleAddStaff = () => {
    if (!newName || !newPhone) return;
    const newMember: StaffMember = {
      id: `s_${Date.now()}`,
      name: newName,
      role: newRole,
      phone: newPhone,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setStaff(prev => [...prev, newMember]);
    setIsAdding(false);
    setNewName('');
    setNewPhone('');
  };

  const handleRemove = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-[#000000] z-[300] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">员工账号管理</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Staff Access Control</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      {!isAdding ? (
        <>
          <div className="space-y-4 mb-32">
            <div onClick={() => setIsAdding(true)} className="bg-[#1A1A1A] p-6 rounded-[24px] border border-dashed border-[#E60012]/40 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all group">
               <span className="text-[#E60012] text-2xl group-active:scale-110 transition-transform">+</span>
               <span className="text-[#E60012] text-[10px] font-black uppercase tracking-widest">添加新员工账号</span>
            </div>

            {staff.map(member => (
               <div key={member.id} className="bg-[#1A1A1A] p-5 rounded-[24px] border border-white/5 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border border-white/5 ${member.role === 'coach' ? 'bg-[#E60012]/10 text-[#E60012]' : 'bg-white/10 text-white'}`}>
                        {member.name.charAt(0)}
                     </div>
                     <div>
                        <h4 className="text-white font-bold">{member.name}</h4>
                        <div className="flex gap-2 mt-1">
                           <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-[#8E8E93] uppercase font-black tracking-wider">{member.role === 'coach' ? '教练' : '前台'}</span>
                           <span className="text-[8px] text-[#8E8E93] uppercase font-black tracking-wider">{member.phone}</span>
                        </div>
                     </div>
                  </div>
                  <button onClick={() => handleRemove(member.id)} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-[#8E8E93] active:bg-[#E60012] active:text-white transition-all">✕</button>
               </div>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
           <div className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 space-y-6 mb-8">
              <div className="space-y-2">
                 <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">员工姓名 (NAME)</label>
                 <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#E60012] font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">手机号 (PHONE)</label>
                 <input value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#E60012] font-bold" />
              </div>
              <div className="space-y-2">
                 <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">角色权限 (ROLE)</label>
                 <div className="flex gap-2">
                    <button onClick={() => setNewRole('coach')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newRole === 'coach' ? 'bg-[#E60012] text-white border-[#E60012]' : 'bg-black text-[#8E8E93] border-white/10'}`}>教练 (Coach)</button>
                    <button onClick={() => setNewRole('reception')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newRole === 'reception' ? 'bg-white text-black border-white' : 'bg-black text-[#8E8E93] border-white/10'}`}>前台 (Reception)</button>
                 </div>
              </div>
           </div>
           
           <button onClick={handleAddStaff} className="w-full py-5 rounded-full bg-[#E60012] text-white font-oswald text-lg uppercase tracking-[4px] shadow-lg active:scale-95 transition-all mb-4">确认添加</button>
           <button onClick={() => setIsAdding(false)} className="w-full py-4 rounded-full text-[#8E8E93] font-black text-[10px] uppercase tracking-[3px] active:text-white">取消</button>
        </div>
      )}
    </div>
  );
};

export default StaffManager;
