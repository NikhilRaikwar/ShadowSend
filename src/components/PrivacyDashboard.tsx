import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { Shield, Clock, ExternalLink, Lock, EyeOff, Zap, RefreshCw, Database, Activity } from "lucide-react";
import { motion } from "framer-motion";
import DustRegistration from "./DustRegistration";

const PrivacyDashboard = () => {
  const { balances, transactions, isConnected, refreshAll } = useMidnightWallet();

  const getTxType = (tx: any) => {
    if (tx.metadata?.type === "shielded") return "Shielded";
    return "Public";
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-4">
      {/* ⚠️ DUST Required check (Onboarding) */}
      <DustRegistration />

      {/* ── SDK State: Protected Resources ── */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
            <Database size={12} /> Midnight Ledger State
          </span>
          <button 
            onClick={() => refreshAll()}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <RefreshCw size={12} />
          </button>
        </div>
        
        <div className="space-y-2">
          {/* Main Shielded Pool Card (SDK: state.shielded.balances) */}
          <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/20 flex justify-between items-center group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 opacity-10">
               <Lock size={80} />
            </div>
            <div className="flex flex-col relative z-10">
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <Shield size={10} /> Private Pool (Shielded tNIGHT)
              </span>
              <span className="text-3xl font-black text-white font-mono tracking-tighter">
                {balances.tNIGHT_SHIELDED || "0.0000"} <span className="text-xs font-normal text-slate-500 uppercase">tNIGHT</span>
              </span>
              <div className="flex items-center gap-3 mt-2">
                 <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available Coins
                 </div>
                 <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" /> Pending Coins
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Public Balance (SDK: state.unshielded.balances) */}
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex flex-col gap-1 hover:bg-white/[0.08] transition-colors">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-1.5">
                🌐 Public Balance
              </span>
              <span className="text-sm font-black text-white font-mono">
                {balances.tNIGHT_UNSHIELDED || "0.0000"}
              </span>
            </div>
            
            {/* DUST Energy (SDK: state.dust.walletBalance) */}
            <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/10 flex flex-col gap-1 hover:bg-amber-500/10 transition-colors">
              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-tight flex items-center gap-1.5">
                <Zap size={10} /> DUST (Energy/Fees)
              </span>
              <span className="text-sm font-black text-white font-mono">
                {balances.tDUST || "0.0000"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Transaction history (SDK: transactionHistory) ── */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
            <Activity size={12} /> ZK-Persistence Status
          </span>
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden font-mono">
          {!isConnected ? (
            <div className="p-10 text-center text-slate-600 italic text-xs">
              Connect Identity to view history...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-10 text-center text-slate-600 italic text-xs flex flex-col items-center gap-3">
              No recent history in Ledger.
            </div>
          ) : (
            transactions.map((tx, i) => (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={tx.txHash || i} 
                className="p-3.5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTxType(tx) === 'Shielded' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {getTxType(tx) === 'Shielded' ? <Lock size={14} /> : <Database size={14} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 leading-none mb-1 uppercase font-bold tracking-tighter">
                      {tx.blockHeight ? `Settled on Midnight` : 'Proof Generation'}
                    </span>
                    <span className="text-[10px] text-white font-bold">
                      {tx.txHash ? `${tx.txHash.slice(0, 16)}...` : 'Generating...'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] px-2 py-0.5 rounded-md text-white font-bold uppercase tracking-widest ${getTxType(tx) === 'Shielded' ? 'bg-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-blue-500/30'}`}>
                        {getTxType(tx)}
                      </span>
                   </div>
                   <a 
                    href={`https://explorer.preprod.midnight.network/transaction/${tx.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] text-slate-600 mt-1.5 flex items-center gap-1 hover:text-purple-400 transition-colors"
                  >
                    TX-SCAN <ExternalLink size={8} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex gap-4 items-center">
        <Info className="text-slate-500 flex-shrink-0" size={16} />
        <p className="text-[9px] text-slate-500 leading-relaxed uppercase font-bold tracking-tighter">
          Shielded history is only visible to your identity and is not indexable by public scrapers.
        </p>
      </div>
    </div>
  );
};

export default PrivacyDashboard;
