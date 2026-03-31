"use client";

import React, { useState } from "react";
import { X, Wallet, ShieldCheck, Check, ChevronRight } from "lucide-react";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const presets = [100, 250, 500];

export function TopUpModal({ isOpen, onClose, onConfirm }: TopUpModalProps) {
  const [amount, setAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState<"chapa" | "telebirr">("telebirr");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-card rounded-[32px] shadow-none overflow-hidden animate-in fade-in zoom-in duration-300 border-none">
        
        {/* Header */}
        <div className="p-8 pb-0 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
              <Wallet className="text-white w-6 h-6" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black tracking-tight text-foreground">Top Up Wallet</h2>
          <p className="text-xs font-semibold text-muted-foreground mt-1">Add credits to your ParkAddis account</p>
        </div>

        {/* Amount Input Section */}
        <div className="p-8 flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-6">Enter Amount (ETB)</p>
          
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-2xl font-bold text-primary">ETB</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="text-6xl font-black tracking-tighter text-foreground bg-transparent border-none focus:ring-0 focus:outline-none w-44 text-center placeholder:text-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
            />
          </div>

          <div className="flex gap-3">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                className={`px-6 py-2 rounded-full text-xs font-black transition-all border-2 ${
                  amount === p 
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                  : "bg-muted border-transparent text-muted-foreground hover:border-border"
                }`}
              >
                +{p}
              </button>
            ))}
          </div>
        </div>

        {/* Separator */}
        <div className="px-8 flex items-center gap-4">
           <div className="h-[1px] flex-1 bg-border/50 border-t border-dotted border-border" />
           <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 shrink-0">Select Payment Method</p>
           <div className="h-[1px] flex-1 bg-border/50 border-t border-dotted border-border" />
        </div>

        {/* Payment Methods Section */}
        <div className="p-8 grid grid-cols-2 gap-4">
          <button 
            onClick={() => setPaymentMethod("chapa")}
            className={`relative p-4 rounded-2xl border-2 transition-all group flex flex-col items-center justify-center gap-2 ${
              paymentMethod === "chapa" 
              ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
              : "border-border bg-muted/30 hover:border-border/80"
            }`}
          >
            {paymentMethod === "chapa" && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Check className="text-white w-2.5 h-2.5 stroke-[4px]" />
              </div>
            )}
            <div className="h-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100">
               <span className="text-sm font-black text-[#5C2D91]">CHAPA</span>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground">Faster Processing</p>
          </button>

          <button 
            onClick={() => setPaymentMethod("telebirr")}
            className={`relative p-4 rounded-2xl border-2 transition-all group flex flex-col items-center justify-center gap-2 ${
              paymentMethod === "telebirr" 
              ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
              : "border-border bg-muted/30 hover:border-border/80"
            }`}
          >
            {paymentMethod === "telebirr" && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Check className="text-white w-2.5 h-2.5 stroke-[4px]" />
              </div>
            )}
            <div className="h-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100">
               <span className="text-sm font-black text-[#00AEEF]">telebirr</span>
            </div>
            <p className="text-[9px] font-bold text-muted-foreground">Popular Entry</p>
          </button>
        </div>

        {/* Progress Action Button */}
        <div className="px-8 pb-8">
          <button 
            onClick={() => onConfirm(amount)}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98]"
          >
            Pay ETB {amount.toLocaleString()}.00
            <ChevronRight size={18} />
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-1.5 opacity-40">
            <ShieldCheck size={12} strokeWidth={3} className="text-muted-foreground" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Secure Encrypted Transaction</span>
          </div>
        </div>

      </div>
    </div>
  );
}
