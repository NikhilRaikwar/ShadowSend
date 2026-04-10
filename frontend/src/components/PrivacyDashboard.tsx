import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { motion } from "framer-motion";
import { Shield, Clock, Lock } from "lucide-react";
import { useEffect, useState } from "react";

interface ShadowTx {
  id: string;
  type: string;
  amount: string;
  token: string;
  timestamp: number;
}

const PrivacyDashboard = () => {
  const { balances, isConnected, shieldedAddress } = useMidnightWallet();
  const [history, setHistory] = useState<ShadowTx[]>([]);

  useEffect(() => {
    const mock: ShadowTx[] = [
      { id: "1", type: "Private Send", amount: "100.00", token: "tNIGHT", timestamp: Date.now() - 3600000 },
      { id: "2", type: "Private Swap", amount: "50.00", token: "tDUST", timestamp: Date.now() - 86400000 },
    ];
    setHistory(mock);
  }, []);

  return (
    <div className="space-y-4 pt-2">
      {/* Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-input p-4 space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Shielded Balance</p>
          <p className="text-xl font-bold text-foreground">
            {isConnected ? (balances["tNIGHT"] || "0.00") : "—"} <span className="text-xs font-medium text-muted-foreground">tNIGHT</span>
          </p>
        </div>
        <div className="glass-input p-4 space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Shielded Dust</p>
          <p className="text-xl font-bold text-foreground">
            {isConnected ? (balances["tDUST"] || "0.00") : "—"} <span className="text-xs font-medium text-muted-foreground">tDUST</span>
          </p>
        </div>
      </div>

      {/* Private Address */}
      <div className="glass-input p-4 space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1">
          <Shield className="w-3 h-3 text-primary" /> My Private Address
        </p>
        <p className="text-[11px] font-mono text-muted-foreground break-all bg-secondary/20 p-2 rounded-lg leading-relaxed">
          {isConnected ? shieldedAddress : "Wallet not connected"}
        </p>
      </div>

      {/* History */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1 px-1">
          <Clock className="w-3" /> Recent Shadow Activity
        </p>
        
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {history.map((tx) => (
            <motion.div 
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-glass-border"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">{tx.type}</p>
                  <p className="text-[10px] text-muted-foreground opacity-70">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-foreground">-{tx.amount} {tx.token}</p>
                <p className="text-[9px] text-emerald-500 font-bold tracking-tighter">SHIELDED ✓</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-[9px] text-center text-muted-foreground italic opacity-60">
        All metadata is encrypted and stays 100% on your device.
      </p>
    </div>
  );
};

export default PrivacyDashboard;
