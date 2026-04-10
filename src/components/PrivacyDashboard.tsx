import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { Shield, ArrowUpRight, Clock, Info, ExternalLink, Lock, EyeOff, Eye, Zap } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyDashboard = () => {
  const { balances, transactions, isConnected } = useMidnightWallet();

  const getTxType = (tx: any) => {
    if (tx.metadata?.type === "shielded") return "Shielded";
    return "Public";
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Real-time Balances */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-1">
          Midnight Identities & Resources
        </span>
        
        <div className="space-y-2">
          {/* tNIGHT Balance Card */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center group">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight flex items-center gap-1">
                <Shield size={10} className="text-purple-400" /> tNIGHT Portfolio
              </span>
              <span className="text-xl font-black text-white font-mono tracking-tighter">
                {balances.tNIGHT || "0.00"} <span className="text-xs font-normal text-slate-500 uppercase">tNIGHT</span>
              </span>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
              <RefreshCw size={18} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* tDUST Card (The Gas Resource) */}
            <div className="p-3 bg-white/5 rounded-xl border border-sky-500/20 flex flex-col gap-1">
              <span className="text-[9px] text-sky-400 font-bold uppercase tracking-tight flex items-center gap-1">
                <Zap size={10} /> tDUST (Energy)
              </span>
              <span className="text-sm font-black text-white font-mono">
                {balances.tDUST || "0.00"}
              </span>
            </div>
            {/* Private Pool */}
            <div className="p-3 bg-white/5 rounded-xl border border-emerald-500/20 flex flex-col gap-1">
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-tight flex items-center gap-1">
                <EyeOff size={10} /> Shielded
              </span>
              <span className="text-sm font-black text-white font-mono">
                {balances.tNIGHT_SHIELDED || "0.00"}
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
          <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase">Synced</span>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 divide-y divide-white/5 overflow-hidden font-mono">
          {!isConnected ? (
            <div className="p-8 text-center text-slate-600 italic text-xs">
              Waiting for identity connection...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-600 italic text-xs">
              No recent ZK-Logs found.
            </div>
          ) : (
            transactions.map((tx, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                key={tx.txHash || i} 
                className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-purple-500"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${tx.blockHeight ? 'bg-emerald-500/5 text-emerald-500' : 'bg-yellow-500/5 text-yellow-500'}`}>
                    <Clock size={12} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 leading-none mb-1 uppercase font-bold tracking-tighter">
                      {tx.blockHeight ? 'Confirmed' : 'Generating Proof'}
                    </span>
                    <span className="text-[10px] text-white">
                      {tx.txHash ? `${tx.txHash.slice(0, 10)}...` : 'Processing...'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded text-white font-bold uppercase ${getTxType(tx) === 'Shielded' ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}>
                    {getTxType(tx)}
                  </span>
                  <a 
                    href={`https://explorer.preprod.midnight.network/transaction/${tx.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] text-purple-400 mt-1 flex items-center gap-0.5 hover:text-purple-300 transition-colors"
                  >
                    TX-SCAN <ExternalLink size={8} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-3 items-start">
        <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={14} />
        <p className="text-[10px] text-slate-400 leading-tight">
          <span className="text-blue-300 font-bold uppercase tracking-tight">tDUST Battery</span>: Hold tNIGHT to generate Energy (DUST). Used automatically for zero-knowledge proving fees.
        </p>
      </div>
    </div>
  );
};

const RefreshCw = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
);

export default PrivacyDashboard;
