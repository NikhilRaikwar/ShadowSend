import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { Shield, Clock, ExternalLink, Lock, Eye, Zap, RefreshCw, Database, Activity, ShieldAlert, ShieldCheck, Info } from "lucide-react";
import { motion } from "framer-motion";
import DustRegistration from "./DustRegistration";

const PrivacyDashboard = () => {
  const { balances, transactions, isConnected, state, refreshAll } = useMidnightWallet();

  const getTxType = (tx: any) => {
    if (tx.metadata?.type === "shielded") return "Shielded";
    return "Public";
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-700">
        <div className="p-6 bg-white/5 rounded-full border border-white/10 relative">
          <ShieldAlert size={48} className="text-slate-500" />
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl" 
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest">Identity Required</h3>
          <p className="text-xs text-slate-500 max-w-[240px] leading-relaxed mx-auto uppercase font-bold tracking-tighter">
            Your private DeFi portal is locked. Connect your Midnight Lace wallet to decrypt your shielded portfolio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-4">
      {/* ⚠️ DUST Required check (Onboarding) */}
      <DustRegistration />

      {/* Balance Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Public Pool */}
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Eye size={40} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Public Portfolio (Visible)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-mono font-bold text-white">{balances.unshielded || "0.00"}</h2>
            <span className="text-xs font-bold text-slate-400">tNIGHT</span>
          </div>
          <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1">
            <Info size={10} /> Public funds are traceable on explorer.
          </p>
        </div>

        {/* Private Pool */}
        <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Lock size={40} className="text-emerald-500" />
          </div>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Private Assets (Shielded)</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-mono font-bold text-emerald-400">{balances.shielded || "0.00"}</h2>
            <span className="text-xs font-bold text-emerald-500">tNIGHT</span>
          </div>
          
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Net Energy (tDUST)</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-mono font-bold text-amber-400">{balances['tDUST'] || "0.00"}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold uppercase">Required for ZK</span>
            </div>
          </div>

          {parseFloat(balances['tDUST'] || '0') <= 0 && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Zap size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-tight">Zero Energy Detected</p>
                <p className="text-[10px] text-amber-500/70 leading-tight">Use Lace Wallet to 'Redesignate' tNIGHT to DUST. Proofs cannot be generated without energy.</p>
              </div>
            </div>
          )}

          <p className="text-[9px] text-emerald-500/70 mt-2 flex items-center gap-1">
            <ShieldCheck size={10} /> Ready for Private Atomic Swaps.
          </p>
        </div>
      </div>

      {/* System Resources */}
      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">tDUST Energy</p>
            <p className="text-sm font-mono font-bold text-white">{balances.tDUST || "0.00"}</p>
          </div>
        </div>
        <button 
          onClick={() => refreshAll()}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
        >
          <RefreshCw size={14} className={state === 'connecting' ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Transition History */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
            <Activity size={12} /> Recent Operations
          </span>
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Live Sync</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden font-mono">
          {transactions.length === 0 ? (
            <div className="p-10 text-center text-slate-600 italic text-xs flex flex-col items-center gap-3">
              No recent ledger activity detected.
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
                    {getTxType(tx) === 'Shielded' ? <Lock size={14} /> : <Eye size={14} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 leading-none mb-1 uppercase font-bold tracking-tighter">
                      {tx.blockHeight ? `Block ${tx.blockHeight}` : 'Proving Identity'}
                    </span>
                    <span className="text-[10px] text-white font-bold">
                      {tx.txHash ? `${tx.txHash.slice(0, 16)}...` : 'Processing...'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className={`text-[8px] px-2 py-0.5 rounded-md text-white font-bold uppercase tracking-widest ${getTxType(tx) === 'Shielded' ? 'bg-purple-500/30' : 'bg-blue-500/30'}`}>
                     {getTxType(tx)}
                   </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyDashboard;
