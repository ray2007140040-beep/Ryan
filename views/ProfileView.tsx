
import React, { useState } from 'react';
import { User, Klass } from '../types';
import GymProfileManager from './GymProfileManager';
import StaffManager from './StaffManager';
import SubscriptionManager from './SubscriptionManager';
import CoachScheduleView from './CoachScheduleView';
import CoachHistoryView from './CoachHistoryView';
import CoachCertificationsView from './CoachCertificationsView';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onUpdateUser?: (user: User) => void;
  klasses?: Klass[]; // Add klasses prop for CoachSchedule
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onUpdateUser, klasses = [] }) => {
  const [activeSubView, setActiveSubView] = useState<'none' | 'gym' | 'staff' | 'subscription' | 'coach_schedule' | 'coach_history' | 'coach_certs'>('none');

  const MenuItem = ({ icon, label, subLabel, alert = false, onClick }: { icon: string, label: string, subLabel?: string, alert?: boolean, onClick?: () => void }) => (
    <div 
      onClick={onClick}
      className="bg-[#1A1A1A] p-5 rounded-[20px] border border-white/5 flex items-center justify-between active:bg-[#252525] transition-colors mb-3 cursor-pointer group"
    >
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-lg group-hover:border-[#E60012]/50 transition-colors">
             {icon}
          </div>
          <div>
             <h4 className="text-white text-sm font-bold">{label}</h4>
             {subLabel && <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-wider mt-0.5">{subLabel}</p>}
          </div>
       </div>
       <div className="flex items-center gap-3">
          {alert && <div className="w-2 h-2 rounded-full bg-[#E60012] animate-pulse"></div>}
          <span className="text-[#8E8E93] text-xs group-hover:text-white transition-colors">→</span>
       </div>
    </div>
  );

  // Admin Views
  if (activeSubView === 'gym' && onUpdateUser) {
    return <GymProfileManager user={user} onUpdate={onUpdateUser} onBack={() => setActiveSubView('none')} />;
  }
  if (activeSubView === 'staff') {
    return <StaffManager onBack={() => setActiveSubView('none')} />;
  }
  if (activeSubView === 'subscription') {
    return <SubscriptionManager onBack={() => setActiveSubView('none')} />;
  }

  // Coach Views
  if (activeSubView === 'coach_schedule') {
    return <CoachScheduleView klasses={klasses} onBack={() => setActiveSubView('none')} />;
  }
  if (activeSubView === 'coach_history') {
    return <CoachHistoryView onBack={() => setActiveSubView('none')} />;
  }
  if (activeSubView === 'coach_certs') {
    return <CoachCertificationsView onBack={() => setActiveSubView('none')} />;
  }

  return (
    <div className="min-h-screen bg-black pt-32 px-6 pb-32 animate-in slide-in-from-right duration-500 overflow-y-auto no-scrollbar">
      
      {/* Header Profile Card */}
      <div className="flex items-center gap-5 mb-12">
        <div className="w-20 h-20 rounded-full border-[2px] border-[#E60012] p-1">
           <div className="w-full h-full bg-[#1A1A1A] rounded-full flex items-center justify-center text-3xl font-oswald text-white italic">
              {user.name.charAt(0)}
           </div>
        </div>
        <div>
           <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
           <div className="flex items-center gap-2">
              <span className="bg-[#E60012] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                {user.role === 'admin' ? '馆长 (OWNER)' : user.role === 'coach' ? '认证教练 (COACH)' : '会员 (STUDENT)'}
              </span>
              <span className="text-[#8E8E93] text-[10px] uppercase font-black tracking-widest">{user.gymName}</span>
           </div>
        </div>
      </div>

      {/* Stats / Dash for specific roles */}
      {user.role === 'coach' && (
        <section className="grid grid-cols-2 gap-3 mb-10">
           <div className="bg-[#1A1A1A] p-5 rounded-[24px] border border-white/5">
              <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-widest mb-2">本月课时</p>
              <p className="text-3xl font-oswald text-white italic">42 <span className="text-sm not-italic text-[#8E8E93]">H</span></p>
           </div>
           <div className="bg-[#1A1A1A] p-5 rounded-[24px] border border-white/5">
              <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-widest mb-2">学员评分</p>
              <p className="text-3xl font-oswald text-[#E60012] italic">4.9</p>
           </div>
        </section>
      )}

      {user.role === 'student' && (
        <section className="bg-[#1A1A1A] p-6 rounded-[24px] border border-white/5 mb-10 flex justify-between items-center">
           <div>
              <p className="text-[9px] text-[#8E8E93] font-black uppercase tracking-widest mb-1">当前等级</p>
              <p className="text-xl font-oswald text-white italic uppercase">Level 2 / Striking</p>
           </div>
           <div className="w-12 h-12 rounded-full border border-dashed border-[#E60012] flex items-center justify-center text-[#E60012]">
              ★
           </div>
        </section>
      )}

      {/* Menu List */}
      <section className="mb-12">
        <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px] mb-4 ml-1">账户设置 (ACCOUNT)</p>
        
        {user.role === 'admin' && (
           <>
             <MenuItem icon="🏢" label="场馆信息设置" subLabel="Gym Profile" onClick={() => setActiveSubView('gym')} />
             <MenuItem icon="👥" label="员工账号管理" subLabel="Staff Access" alert onClick={() => setActiveSubView('staff')} />
             <MenuItem icon="💳" label="订阅与账单" subLabel="Subscription" onClick={() => setActiveSubView('subscription')} />
           </>
        )}

        {user.role === 'coach' && (
           <>
             <MenuItem icon="📅" label="排课计划表" subLabel="Schedule" onClick={() => setActiveSubView('coach_schedule')} />
             <MenuItem icon="📊" label="历史教学数据" subLabel="History" onClick={() => setActiveSubView('coach_history')} />
             <MenuItem icon="🎓" label="认证与资质" subLabel="Certifications" onClick={() => setActiveSubView('coach_certs')} />
           </>
        )}

        {user.role === 'student' && (
           <>
             <MenuItem icon="🥊" label="我的训练档案" subLabel="Training Log" />
             <MenuItem icon="💳" label="会员卡/课包" subLabel="Membership" />
             <MenuItem icon="📈" label="体测数据" subLabel="Body Metrics" />
           </>
        )}

        <div className="w-full h-[1px] bg-white/5 my-6"></div>
        <MenuItem icon="🔒" label="修改密码" subLabel="Security" />
        <MenuItem icon="🌐" label="语言设置" subLabel="Language" />
        <MenuItem icon="💬" label="帮助与反馈" subLabel="Support" />
      </section>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full py-5 rounded-full border border-white/10 text-[#8E8E93] font-oswald uppercase tracking-[3px] text-sm hover:bg-[#E60012] hover:text-white hover:border-[#E60012] transition-all"
      >
        退出登录 (LOGOUT)
      </button>
    </div>
  );
};

export default ProfileView;
