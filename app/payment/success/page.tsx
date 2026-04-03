"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Wallet, Calendar, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tx_ref = searchParams.get("tx_ref") || searchParams.get("trx_ref");
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!tx_ref) {
      setStatus("error");
      return;
    }

    // Verify payment status (optional but good for UX)
    const verify = async () => {
       try {
         // In a real app, we might wait for the callback to finish 
         // or poll the server to confirm SUCCESS status
         setTimeout(() => setStatus("success"), 1500);
       } catch (e) {
         setStatus("error");
       }
    };

    verify();
  }, [tx_ref]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold">Verifying Payment...</h2>
        <p className="text-sm text-muted-foreground mt-2">Please don't close this window.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pt-10 pb-20 px-6">
      <div className="bg-card rounded-[40px] border border-border shadow-2xl shadow-primary/5 overflow-hidden animate-in fade-in zoom-in duration-500">
        
        {/* Animated Success Header */}
        <div className="bg-primary/5 p-10 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />
          
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6 shadow-xl shadow-primary/30 relative z-10">
            <CheckCircle2 className="text-white w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Payment Received!</h1>
          <p className="text-sm font-semibold text-muted-foreground max-w-[240px]">
            Your transaction has been processed successfully.
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Transaction Summary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-border/50">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-xl border border-border">
                    <Wallet size={16} className="text-primary" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Reference ID</span>
               </div>
               <span className="text-xs font-mono font-bold text-foreground">#{tx_ref?.substring(0, 10).toUpperCase()}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-border/50">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-xl border border-border">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Status</span>
               </div>
               <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Confirmed</span>
               </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Link 
              href="/dashboard"
              className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>
            
            <Link 
              href="/wallet"
              className="w-full bg-muted text-muted-foreground py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-muted/80 transition-all active:scale-[0.98]"
            >
              View Wallet
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-muted/20 border-t border-border flex justify-center">
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Secure payment via Chapa</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
