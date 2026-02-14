
import React from 'react';

interface CoachCertificationsViewProps {
  onBack: () => void;
}

const CERTS_DATA = [
  { id: 'c1', title: 'WMC 泰拳教练认证 Level 3', issuer: 'World Muaythai Council', date: '2022.05.12', status: 'verified' },
  { id: 'c2', title: '红十字会急救员证 (CPR+AED)', issuer: 'Red Cross China', date: '2023.01.10', status: 'verified' },
  { id: 'c3', title: 'NSCA-CPT 私人教练认证', issuer: 'NSCA', date: '2023.08.20', status: 'pending' },
];

const CoachCertificationsView: React.FC<CoachCertificationsViewProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 bg-[#000000] z-[300] flex flex-col pt-20 px-6 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic tracking-tighter">认证与资质</h2>
          <p className="text-[#E60012] text-[10px] font-black uppercase tracking-[4px]">Qualifications</p>
        </div>
        <button onClick={onBack} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-xl active:scale-90 transition-all">✕</button>
      </div>

      {/* Certs List */}
      <div className="space-y-6 mb-32">
        <div onClick={() => {}} className="bg-[#1A1A1A] p-6 rounded-[24px] border border-dashed border-[#E60012]/40 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all group">
            <span className="text-[#E60012] text-2xl group-active:scale-110 transition-transform">+</span>
            <span className="text-[#E60012] text-[10px] font-black uppercase tracking-widest">上传新的证书</span>
        </div>

        {CERTS_DATA.map((cert) => (
           <div key={cert.id} className="bg-[#1A1A1A] rounded-[24px] border border-white/5 overflow-hidden relative group">
              {/* Background Decoration */}
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-[#E60012]/10 transition-colors"></div>
              
              <div className="p-6 relative z-10">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xl">📜</div>
                    {cert.status === 'verified' ? (
                       <span className="bg-[#E60012] text-white text-[8px] font-black uppercase px-2 py-1 rounded tracking-widest">已认证 Verified</span>
                    ) : (
                       <span className="bg-[#8E8E93]/20 text-[#8E8E93] text-[8px] font-black uppercase px-2 py-1 rounded tracking-widest">审核中 Pending</span>
                    )}
                 </div>
                 
                 <h3 className="text-white font-bold text-lg mb-1 leading-tight">{cert.title}</h3>
                 <p className="text-[#8E8E93] text-[10px] font-black uppercase tracking-wider opacity-60">Issuer: {cert.issuer}</p>
                 
                 <div className="w-full h-[1px] bg-white/5 my-4"></div>
                 
                 <div className="flex justify-between items-center">
                    <p className="text-[#8E8E93] text-[9px] font-black uppercase">Date: {cert.date}</p>
                    <button className="text-white text-[9px] font-black uppercase border-b border-white/20 pb-0.5 hover:text-[#E60012] hover:border-[#E60012] transition-all">查看原件</button>
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default CoachCertificationsView;
