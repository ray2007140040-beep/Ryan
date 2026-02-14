
import React, { useState } from 'react';
import { Role, User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('coach');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock Login Logic
    let mockUser: User = {
      id: `user_${Date.now()}`,
      name: 'User',
      role: selectedRole,
      gymName: 'Iron Fist Gym'
    };

    if (selectedRole === 'admin') {
      mockUser.name = '馆长 王大雷';
    } else if (selectedRole === 'coach') {
      mockUser.name = '教练 麦克';
    } else {
      mockUser.name = '学员 李明';
    }

    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 animate-in fade-in duration-700">
      
      {/* Logo Area */}
      <div className="mb-16 text-center">
        <div className="w-20 h-20 border-[3px] border-[#E60012] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(230,0,18,0.3)]">
           <span className="text-[#E60012] text-3xl font-oswald italic font-bold">CB</span>
        </div>
        <h1 className="text-4xl font-oswald text-white uppercase italic tracking-tighter mb-2">Combat Bible</h1>
        <p className="text-[#E60012] text-[9px] font-black uppercase tracking-[6px]">Professional Gym OS</p>
      </div>

      {/* Role Selector (Demo purpose) */}
      <div className="w-full max-w-sm mb-10">
        <p className="text-[#8E8E93] text-[9px] font-black uppercase tracking-[3px] mb-4 text-center opacity-60">选择登录身份 (Select Role)</p>
        <div className="bg-[#1A1A1A] p-1.5 rounded-2xl flex border border-white/5">
          {(['admin', 'coach', 'student'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`
                flex-1 py-4 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest
                ${selectedRole === role 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-[#8E8E93] hover:text-white'}
              `}
            >
              {role === 'admin' ? '馆长' : role === 'coach' ? '教练' : '学员'}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="w-full max-w-sm space-y-4 mb-12">
        <div className="space-y-1">
           <input 
             type="text" 
             placeholder="账号 / ID"
             value={username}
             onChange={e => setUsername(e.target.value)}
             className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-[#E60012] transition-all text-sm font-bold"
           />
        </div>
        <div className="space-y-1">
           <input 
             type="password" 
             placeholder="密码 / PASSCODE"
             value={password}
             onChange={e => setPassword(e.target.value)}
             className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-[#E60012] transition-all text-sm font-bold"
           />
        </div>
      </div>

      {/* Action */}
      <div className="w-full max-w-sm">
        <button 
          onClick={handleLogin}
          className="w-full py-5 rounded-full bg-[#E60012] text-white font-oswald text-lg uppercase tracking-[4px] shadow-[0_10px_40px_rgba(230,0,18,0.3)] active:scale-95 transition-all animate-pulse"
        >
          进入系统 (ENTER)
        </button>
        <p className="text-[#8E8E93] text-[8px] font-black uppercase tracking-[2px] text-center mt-6 opacity-40">
          V1.0.4 BUILD 2024 · POWERED BY GEMINI
        </p>
      </div>
    </div>
  );
};

export default LoginView;
