
import React from 'react';

interface SubscriptionManagerProps {
  onBack: () => void;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 bg-[#000000] z-[300] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">订阅与账单</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Plan & Billing</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-black p-8 rounded-[32px] border border-white/10 relative overflow-hidden mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-9xl font-oswald text-white pointer-events-none italic">PRO</div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <span className="bg-[#E60012] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">Active</span>
               <span className="text-[#8E8E93] text-[9px] font-black uppercase tracking-widest">Since 2023.01</span>
            </div>
            <h3 className="text-4xl font-oswald text-white uppercase italic tracking-tighter mb-2">Professional</h3>
            <p className="text-[#8E8E93] text-xs font-bold mb-8">适用于中型拳馆，支持 10 名教练账号</p>
            
            <div className="flex items-end gap-1 mb-6">
               <span className="text-3xl font-oswald text-white">¥ 2,999</span>
               <span className="text-[#8E8E93] text-[10px] font-black uppercase mb-1">/ Year</span>
            </div>

            <div className="w-full bg-white/5 h-[1px] mb-6"></div>

            <div className="flex gap-4">
               <button className="flex-1 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">续费 / Renew</button>
               <button className="flex-1 py-3 bg-transparent border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest active:scale-95 transition-all">变更方案</button>
            </div>
         </div>
      </div>

      {/* Billing History */}
      <div className="mb-20">
         <h4 className="text-white text-[11px] font-black uppercase tracking-[2px] mb-6 flex items-center gap-2">
            <span className="w-1 h-3 bg-[#E60012]"></span>
            账单记录 (INVOICES)
         </h4>
         <div className="space-y-3">
            {[1, 2, 3].map((i) => (
               <div key={i} className="bg-[#1A1A1A] p-5 rounded-[20px] border border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors">
                  <div>
                     <p className="text-white font-bold text-sm mb-0.5">年度订阅 - Professional</p>
                     <p className="text-[#8E8E93] text-[10px] font-black uppercase">2023.01.15 · WeChat Pay</p>
                  </div>
                  <div className="text-right">
                     <p className="text-white font-oswald italic">¥ 2,999</p>
                     <p className="text-[#E60012] text-[8px] font-black uppercase tracking-wider">已支付</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
