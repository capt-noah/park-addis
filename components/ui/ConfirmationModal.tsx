"use client";

import React from 'react';
import { X, AlertTriangle, LogOut, Wallet, CalendarDays, CheckCircle2 } from 'lucide-react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmationModalProps extends ConfirmationOptions {
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  onConfirm, 
  onCancel,
  onClose 
}) => {
  // Map icons based on keywords in title/message
  const getIcon = () => {
    const t = title.toLowerCase();
    const m = message.toLowerCase();
    if (t.includes('logout') || m.includes('logout')) return <LogOut className="text-[#064e3b] w-8 h-8" />;
    if (t.includes('topup') || t.includes('wallet') || m.includes('topup')) return <Wallet className="text-[#064e3b] w-8 h-8" />;
    if (t.includes('reserve') || t.includes('booking') || m.includes('reserve')) return <CalendarDays className="text-[#064e3b] w-8 h-8" />;
    if (t.includes('success') || m.includes('success')) return <CheckCircle2 className="text-[#064e3b] w-8 h-8" />;
    return <AlertTriangle className="text-[#064e3b] w-8 h-8" />;
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
        onClick={() => {
            if (onCancel) onCancel();
            onClose();
        }}
      />
      
      {/* Modal Card: Physical Ticket Metaphor */}
      <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 scale-100">
        
        {/* Top Section: Visual Branding */}
        <div className="p-10 text-center bg-[#f8fafc] border-b border-dashed border-[#e2e8f0] relative">
          <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm border border-[#f1f5f9] flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-105 duration-300">
            {getIcon()}
          </div>
          
          <h2 className="text-2xl font-black tracking-tight text-[#0f172a]">{title}</h2>
          
          {/* Ticket Notch Left */}
          <div className="absolute -bottom-[12px] -left-[12px] w-[24px] h-[24px] bg-[#0f172a]/10 rounded-full blur-[1px] mix-blend-multiply" />
          <div className="absolute -bottom-[12px] -left-[12px] w-[24px] h-[24px] bg-[#0f172a]/40 rounded-full backdrop-blur-sm shadow-inner" />
          
          {/* Ticket Notch Right */}
          <div className="absolute -bottom-[12px] -right-[12px] w-[24px] h-[24px] bg-[#0f172a]/10 rounded-full blur-[1px] mix-blend-multiply" />
          <div className="absolute -bottom-[12px] -right-[12px] w-[24px] h-[24px] bg-[#0f172a]/40 rounded-full backdrop-blur-sm shadow-inner" />
        </div>

        {/* Content Section */}
        <div className="p-10 text-center">
          <p className="text-sm font-semibold text-[#475569] leading-relaxed mb-10 px-2 opacity-80">
            {message}
          </p>

          <div className="flex flex-col gap-3">
             <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="w-full bg-[#064e3b] text-white py-4.5 rounded-2xl font-black text-sm tracking-tight hover:opacity-90 transition-all shadow-lg shadow-[#064e3b]/20 active:scale-[0.98] outline-none"
            >
              {confirmText}
            </button>
            <button 
              onClick={() => {
                if (onCancel) onCancel();
                onClose();
              }}
              className="w-full bg-transparent text-[#64748b] py-4 rounded-2xl font-bold text-sm tracking-tight border border-[#e2e8f0] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-all active:scale-[0.98] outline-none"
            >
              {cancelText}
            </button>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="px-10 py-5 bg-[#f1f5f9]/50 border-t border-[#f1f5f9] flex justify-between items-center">
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">System Ticket</span>
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#94a3b8]">Verified</span>
        </div>
      </div>
    </div>
  );
};
