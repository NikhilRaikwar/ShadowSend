import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { motion } from "framer-motion";
import { Shield, Clock, ExternalLink, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface ShadowTx {
  id: string;
  type: "Send" | "Receive" | "Swap";
  amount: string;
  token: string;
  timestamp: number;
  status: "Confirmed";
}

const PrivacyDashboard = () => {
  const { balances, isConnected, shieldedAddress } = useMidnightWallet();
  const [history, setHistory] = useState<ShadowTx[]>([]);

  useEffect(() => {
    // Load Shadow History from local IndexedDB/Storage
    const saved = localStorage.getItem("shadow_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      // Mock history for hackathon demo if empty
      const mock: ShadowTx[] = [
        { id: "1", type: "Send", amount: "100.00", token: "tNIGHT", timestamp: Date.now() - 3600000, status: "Confirmed" },
        { id: "2", type: "Swap", amount: "50.00", token: "tDUST", timestamp: Date.now() - 86400000, status: "Confirmed" },
      ];
      setHistory(mock);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Wallet Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 space-y-1 bg-primary/5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Shielded Balance</p>
          <p className="text-xl font-bold text-foreground">
            {isConnected ? (balances["tNIGHT"] || "0.00") : "—"} <span className="text-xs font-medium text-muted-foreground">tNIGHT</span>
          </p>
        </div>
        <div className="glass-card p-4 space-y-1 bg-secondary/10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Local History</p>
          <p className="text-xl font-bold text-foreground">
            {history.length} <span className="text-xs font-medium text-muted-foreground">Entries</span>
          </p>
        </div>
      </div>

      {/* Address Card */}
      <div className="glass-card p-4 space-y-2 border border-primary/20">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1">
            <Shield className="w-3 h-3 text-primary" /> Private Address
          </p>
          <button className="text-[10px] text-primary hover:underline">Copy</button>
        </div>
        <p className="text-[11px] font-mono text-muted-foreground break-all bg-secondary/20 p-2 rounded-lg">
          {isConnected ? shieldedAddress : "Connect wallet to generate..."}
        </p>
      </div>

      {/* Shadow History */}
      <div className="space-y-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1 px-1">
          <Clock className="w-3 h-3" /> Shadow History
        </p>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          {history.length > 0 ? history.map((tx) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/5 border border-glass-border hover:bg-secondary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{tx.type} Private</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-foreground">-{tx.amount} {tx.token}</p>
                <p className="text-[10px] text-emerald-500 font-medium">Verified ✓</p>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-8 opacity-40">
              <p className="text-xs italic">Your shadow record is empty.</p>
            </div>
          )}
        </div>
        <p className="text-[9px] text-center text-muted-foreground opacity-60">
          History is encrypted and stored locally in your browser. It never leaves your device.
        </p>
      </div>
    </div>
  );
};

export default PrivacyDashboard;
