
import React, { useState } from 'react';
import { User } from '../types';

interface GymProfileManagerProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onBack: () => void;
}

const GymProfileManager: React.FC<GymProfileManagerProps> = ({ user, onUpdate, onBack }) => {
  const [gymName, setGymName] = useState(user.gymName || '');
  const [ownerName, setOwnerName] = useState(user.name || '');
  const [address, setAddress] = useState('上海市静安区南京西路 1266 号');
  const [phone, setPhone] = useState('021-8888-9999');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdate({ ...user, name: ownerName, gymName: gymName });
      setIsSaving(false);
      onBack();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-[#000000] z-[300] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">场馆信息设置</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Gym Profile Configuration</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      <div className="space-y-8 mb-32">
        {/* Logo Upload Placeholder */}
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-[24px] bg-[#1A1A1A]">
           <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center text-3xl font-oswald text-[#E60012] shadow-lg mb-4 italic">
              {gymName.charAt(0) || 'G'}
           </div>
           <button className="text-[9px] font-black uppercase tracking-widest text-[#8E8E93] border border-white/10 px-4 py-2 rounded-full active:bg-white/10">点击更换场馆 LOGO</button>
        </div>

        {/* Inputs */}
        <div className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 space-y-6">
           <div className="space-y-2">
              <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">场馆名称 (GYM NAME)</label>
              <input 
                value={gymName} 
                onChange={(e) => setGymName(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#E60012] transition-all font-bold"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">馆长/负责人姓名 (OWNER NAME)</label>
              <input 
                value={ownerName} 
                onChange={(e) => setOwnerName(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#E60012] transition-all font-bold"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">联系电话 (CONTACT)</label>
              <input 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#E60012] transition-all font-bold"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[8px] text-[#8E8E93] font-black uppercase tracking-widest ml-1">场馆地址 (ADDRESS)</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white outline-none focus:border-[#E60012] transition-all font-bold h-24 resize-none"
              />
           </div>
        </div>
      </div>

      <div className="fixed bottom-10 left-6 right-6">
         <button 
           onClick={handleSave}
           disabled={isSaving}
           className="w-full py-5 rounded-full bg-[#E60012] text-white font-oswald text-lg uppercase tracking-[4px] shadow-2xl active:scale-95 transition-all animate-breathe disabled:opacity-50"
         >
           {isSaving ? '保存中...' : '确认更新信息 (UPDATE)'}
         </button>
      </div>
    </div>
  );
};

export default GymProfileManager;
