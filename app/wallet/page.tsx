"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { 
  Wallet, 
  PlusCircle, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ChevronRight,
  Filter,
  Download,
  Calendar,
  CreditCard,
  User,
  Activity,
  History
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { TopUpModal } from "@/components/wallet/TopUpModal";
import { useSession } from "@/components/session/AppSessionProvider"; // For context if available, but we'll fetch explicitly to be safe


export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [userName, setUserName] = useState("NOAH SAMUEL");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 1. Get User
      const userRes = await fetch("/api/auth/me", {
        credentials: "include"
      });
      if (!userRes.ok) throw new Error("Auth failed");
      const userData = await userRes.json();
      setUserId(userData.userId);
      setUserName(userData.fullName?.toUpperCase() || "NOAH SAMUEL");

      // 2. Get Wallet
      const walletRes = await fetch("/api/wallet/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: userData.userId })
      });
      

      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWalletId(walletData.id);
        setBalance(parseFloat(walletData.balance));

        // 3. Get Transactions
        const txRes = await fetch("/api/wallet/transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ walletId: walletData.id })
        });
        
        if (txRes.ok) {
          const txData = await txRes.json();
          console.log(txData)
          setTransactions(txData);
        }
      }
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleTopUp = async (amount: number) => {
    if (!userId) return;
    
    try {
      const response = await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, amount })
      });

      if (response.ok) {
        setIsModalOpen(false);
        // Refresh all data to get updated balance and new transaction
        fetchAllData();
        alert(`Successfully topped up ETB ${amount.toFixed(2)}!`);
      } else {
        alert("Failed to top up. Please try again.");
      }
    } catch (err) {
      console.error("Top-up error:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayout title="Digital Wallet">
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Digital Wallet</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <PlusCircle size={18} />
            <span>Top Up Wallet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Main Balance Card - Balanced Width */}
          <div className="relative overflow-hidden bg-[#064e3b] rounded-[32px] p-8 text-white shadow-2xl flex flex-col justify-between min-h-[260px]">
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/80 mb-6">PARKADDIS WALLET</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-emerald-400/80">ETB</span>
                    <span className="text-5xl font-black tracking-tighter">
                      {isLoading ? "---" : balance.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="w-14 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                  <Wallet size={28} className="text-white" />
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-6 mt-auto">
              <div>
                <p className="text-[9px] uppercase font-bold tracking-widest text-emerald-400/60 mb-1">Card Holder</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold uppercase tracking-tight">{userName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase font-bold tracking-widest text-emerald-400/60 mb-1">Account No.</p>
                <p className="text-sm font-bold tracking-tight">PA-8842-1092</p>
              </div>
            </div>
          </div>

          {/* Stats & Promo Column - Balanced Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            
            {/* Spending Card */}
            <div className="bg-card border border-border rounded-[28px] p-6 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-orange-100 dark:bg-orange-500/10 rounded-xl">
                  <TrendingDown className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">This Month</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Parking Spend</p>
                <h3 className="text-2xl font-black tracking-tight text-foreground">ETB 1,240.50</h3>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                <ArrowDownLeft size={14} />
                <span>12% lower than last month</span>
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-indigo-600 rounded-[28px] p-6 text-white overflow-hidden relative group cursor-pointer shadow-lg shadow-indigo-600/20">
               <h4 className="text-lg font-bold leading-tight mb-2 relative z-10">Save 5% on Monthly Passes</h4>
               <p className="text-[11px] text-indigo-100/80 relative z-10">Set up auto-top up and get rewards instantly.</p>
               
               <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform relative z-10">
                 <span>Learn More</span>
                 <ChevronRight size={14} />
               </div>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-sm relative mt-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <History className="text-primary w-5 h-5" />
              Transaction History
            </h2>
            <div className="flex gap-2">
               <button className="px-4 py-2 rounded-xl border border-border text-[11px] font-bold text-muted-foreground hover:bg-muted transition-colors">
                 <Filter size={14} className="inline mr-1" />
                 Filter
               </button>
               <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold hover:opacity-90 transition-colors">
                 <Download size={14} className="inline mr-1" />
                 Export PDF
               </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Transaction Details</th>
                  <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Type</th>
                  <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Date & Time</th>
                  <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground">Reference</th>
                  <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground text-right">Amount</th>
                  <th className="pb-4 text-[9px] uppercase tracking-widest font-extrabold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-6"><div className="h-10 w-40 bg-muted rounded-xl" /></td>
                      <td><div className="h-6 w-16 bg-muted rounded-full" /></td>
                      <td><div className="h-8 w-24 bg-muted rounded-lg" /></td>
                      <td><div className="h-4 w-20 bg-muted rounded-md" /></td>
                      <td><div className="h-6 w-16 bg-muted rounded-md ml-auto" /></td>
                      <td><div className="h-8 w-24 bg-muted rounded-xl ml-auto" /></td>
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <History size={48} className="text-muted-foreground" />
                        <p className="text-sm font-bold text-muted-foreground">No transactions found yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center border border-border group-hover:bg-card transition-colors">
                            <div className={`text-sm font-black ${tx.amount > 0 ? "text-emerald-600" : "text-primary"}`}>
                              {(tx.description || tx.type || "T")[0].toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{tx.description || tx.type}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{tx.type === 'TOPUP' ? 'Wallet Recharge' : 'Parking Session'}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${
                          tx.type === "TOPUP" 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                          : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground text-[11px]">{formatDate(tx.createdAt)}</p>
                          <p className="text-[10px] text-muted-foreground font-medium tracking-tight">{formatTime(tx.createdAt)}</p>
                        </div>
                      </td>
                      <td>
                        <p className="text-[10px] text-muted-foreground font-mono font-bold">#{tx.referenceId?.substring(0, 8).toUpperCase() || "N/A"}</p>
                      </td>
                      <td className="text-right">
                        <p className={`font-bold text-[11px] font-sans tracking-wide ${tx.amount > 0 ? "text-emerald-600" : "text-foreground"}`}>
                          {tx.amount > 0 ? "+" : ""}ETB {Math.abs(parseFloat(tx.amount)).toFixed(2)}
                        </p>
                      </td>
                      <td className="text-right">
                        <button className="text-[11px] font-bold text-white bg-[#004D40] hover:bg-[#004D40]/90 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex items-center justify-between">
            <p className="text-[10px] font-medium text-muted-foreground">Showing <span className="text-foreground font-bold">1-4</span> of <span className="text-foreground font-bold">28</span> results</p>
            <div className="flex gap-2">
               <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50" disabled>
                 <ChevronRight className="w-3.5 h-3.5 rotate-180 text-muted-foreground" />
               </button>
               <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-primary text-white text-[10px] font-bold">1</button>
               <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-foreground text-[10px] font-bold">2</button>
               <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
                 <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
               </button>
            </div>
          </div>
        </div>
      </div>

      <TopUpModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleTopUp} 
      />
    </DashboardLayout>
  );
}
