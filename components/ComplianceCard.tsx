
import React from 'react';
import { ComplianceStatus } from '../types';

interface ComplianceCardProps {
  status: ComplianceStatus;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

const ComplianceCard: React.FC<ComplianceCardProps> = ({ 
  status, 
  title, 
  subtitle, 
  children,
  onClick 
}) => {
  const isDeviation = status === 'deviation';

  return (
    <div 
      onClick={onClick}
      className={`
        relative w-full p-5 rounded-[12px] border-[0.5px] border-[#8E8E93]/20 transition-all duration-300
        ${isDeviation ? 'bg-[#E60012] text-white animate-pulse' : 'bg-[#1A1A1A] text-[#F2F2F2]'}
        ${onClick ? 'active:scale-[0.98]' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className={`text-lg font-bold ${isDeviation ? 'text-white' : 'text-[#F2F2F2]'}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-sm ${isDeviation ? 'text-white/80' : 'text-[#8E8E93]'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {isDeviation && (
          <div className="bg-white text-[#E60012] px-2 py-0.5 rounded text-[10px] font-black uppercase">
            Deviation Detected
          </div>
        )}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default ComplianceCard;
