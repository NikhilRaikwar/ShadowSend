import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { Shield, ArrowUpRight, Clock, Info, ExternalLink, Lock, EyeOff, Eye, Zap, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import DustRegistration from "./DustRegistration";

const PrivacyDashboard = () => {
  const { balances, transactions, isConnected, refreshAll } = useMidnightWallet();

  const getTxType = (tx: any) => {
    if (tx.metadata?.type === "shielded") return "Shielded";
    return "Public";
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* CRITICAL: DUST Onboarding for first-time users */}
      <DustRegistration />

      {/* Real-time Balances */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Midnight Portfolio
          </span>
          <button 
            onClick={() => refreshAll()}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <RefreshCw size={12} />
          </button>
        </div>
        
        <div className="space-y-2">
          {/* tNIGHT Balance Card */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center group hover:bg-white/[0.07] transition-all">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-1.5 mb-1">
                <Shield size={10} className="text-purple-400" /> Global tNIGHT Identity
              </span>
              <span className="text-2xl font-black text-white font-mono tracking-tighter">
                {balances.tNIGHT || "0.0000"} <span className="text-xs font-normal text-slate-500 uppercase">tNIGHT</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* tDUST Card (The Gas Resource) */}
            <div className="p-3.5 bg-sky-500/5 rounded-xl border border-sky-500/10 flex flex-col gap-1 hover:bg-sky-500/10 transition-colors">
              <span className="text-[9px] text-sky-400 font-bold uppercase tracking-tight flex items-center gap-1.5">
                <Zap size={10} /> tDUST (Energy)
              </span>
              <span className="text-sm font-black text-white font-mono">
                {balances.tDUST || "0.0000"}
              </span>
            </div>
            {/* Private Pool */}
            <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex flex-col gap-1 hover:bg-emerald-500/10 transition-colors">
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-tight flex items-center gap-1.5">
                <EyeOff size={10} /> Shielded Pool
              </span>
              <span className="text-sm font-black text-white font-mono">
                {balances.tNIGHT_SHIELDED || "0.0000"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Identity Persistence
          </span>
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Synced</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden font-mono">
          {!isConnected ? (
            <div className="p-10 text-center text-slate-600 italic text-xs">
              Waiting for identity connection...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-slate-600 italic text-xs flex flex-col items-center gap-3">
              <div className="p-3 bg-white/5 rounded-full opacity-20"><Lock size={20} /></div>
              No recent ZK-Logs found.
            </div>
          ) : (
            transactions.map((tx, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                key={tx.txHash || i} 
                className="p-3.5 flex items-center justify-between hover:bg-white/[0.08] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.blockHeight ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {tx.blockHeight ? <ShieldCheck size={14} /> : <Clock size={14} className="animate-pulse" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 leading-none mb-1 uppercase font-bold tracking-tighter">
                      {tx.blockHeight ? `CONFIRMED BH-${tx.blockHeight}` : 'GENERATING PROOF'}
                    </span>
                    <span className="text-[10px] text-white font-bold">
                      {tx.txHash ? `${tx.txHash.slice(0, 14)}...` : 'Processing Identity...'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[8px] px-2 py-0.5 rounded-md text-white font-bold uppercase tracking-widest ${getTxType(tx) === 'Shielded' ? 'bg-purple-500/30' : 'bg-blue-500/30'}`}>
                    {getTxType(tx)}
                  </span>
                  <a 
                    href={`https://explorer.preprod.midnight.network/transaction/${tx.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] text-slate-500 mt-1.5 flex items-center gap-1 hover:text-purple-400 transition-colors"
                  >
                    SCAN <ExternalLink size={8} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10 flex gap-4 items-start">
        <Info className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
        <p className="text-[10px] text-slate-400 leading-relaxed">
          <span className="text-purple-300 font-bold uppercase tracking-tight">System Model</span>: Hold tNIGHT to generate DUST energy. Transactions use DUST for zero-knowledge proving fees, keeping your NIGHT balance protected.
        </p>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
);

export default PrivacyDashboard;
