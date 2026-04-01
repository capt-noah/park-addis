"use client";

import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, BellRing } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const styles = {
    success: {
      bg: 'bg-[#064e3b]',
      border: 'border-emerald-400/20',
      iconBg: 'bg-emerald-400/20',
      iconColor: 'text-emerald-400',
      icon: CheckCircle2
    },
    error: {
      bg: 'bg-rose-950',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400',
      icon: AlertCircle
    },
    info: {
      bg: 'bg-slate-900',
      border: 'border-slate-700',
      iconBg: 'bg-slate-800',
      iconColor: 'text-slate-300',
      icon: Info
    }
  }[type];

  const Icon = styles.icon;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-md px-4 pointer-events-none">
      <div className={`${styles.bg} ${styles.border} border rounded-[24px] p-1.5 shadow-2xl shadow-black/40 animate-in fade-in slide-in-from-top-6 flex items-center gap-4 pointer-events-auto group`}>
        <div className="flex-1 flex items-center gap-4 pl-3 py-2">
          <div className={`${styles.iconBg} ${styles.iconColor} p-2.5 rounded-2xl`}>
             <Icon size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">Notification</p>
            <p className="text-[13px] font-bold text-white tracking-tight leading-tight">{message}</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="h-14 w-14 flex items-center justify-center rounded-2xl hover:bg-white/5 transition-colors text-white/20 hover:text-white"
        >
          <X size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
