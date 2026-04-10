import { useState } from "react";
import { RefreshCw, Shield, Zap, Info, Lock, ArrowDown, ShieldCheck, AlertCircle } from "lucide-react";
import TokenSelector from "./TokenSelector";
import { motion, AnimatePresence } from "framer-motion";
import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { toast } from "sonner";

const SwapTab = () => {
  const { isConnected, walletAPI, shieldedAddress, balances, refreshAll, addPendingTx } = useMidnightWallet();
  const [amount, setAmount] = useState("");
  const [tokenFrom, setTokenFrom] = useState("tNIGHT");
  const [tokenTo, setTokenTo] = useState("tNIGHT_SHIELDED");
  const [status, setStatus] = useState<"idle" | "exchanging" | "confirmed" | "error">("idle");

  const handleSwap = async () => {
    if (!isConnected || !walletAPI) {
      toast.error("Connect your Lace wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      setStatus("exchanging");
      toast.info(`🔐 Initiating Private Atomic Swap...`);

      const microAmount = BigInt(Math.floor(parseFloat(amount) * 1_000_000));
      const NATIVE_ID = "0000000000000000000000000000000000000000000000000000000000000000";

      // 1. Create Atomic Intent (Offering and Requesting)
      const unbalancedTx = await walletAPI.makeIntent(
        [{ kind: 'shielded', type: NATIVE_ID, value: microAmount }],
        [{ kind: 'shielded', type: NATIVE_ID, value: microAmount, recipient: shieldedAddress }],
        { intentId: "random", payFees: true }
      );

      toast.info("💎 Balancing Intent Transaction...");
      
      // 2. Balance the sealed transaction (As per official docs example)
      const balancedTx = await walletAPI.balanceSealedTransaction(unbalancedTx);

      // 3. Submit the finalized transaction
      const result = await walletAPI.submitTransaction(balancedTx);

      const txHash = typeof result === 'string' ? result : result.txHash;
      if (txHash) addPendingTx(txHash, 'shielded');

      await refreshAll();
      toast.success("🔥 Private Swap Settled & Submitted!");
      setStatus("confirmed");
      setAmount("");
      setTimeout(() => setStatus("idle"), 5000);
    } catch (e: any) {
      console.error("Swap failed", e);
      toast.error(`Swap Failed: ${e.message}`);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Balance display cards omitted for brevity, same as previous version */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Available Balance
          </span>
          <span className="text-xs sm:text-sm text-foreground font-medium">
            {(balances[tokenFrom] || "0.00") + " " + tokenFrom}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
          <Zap size={12} className="text-purple-400" />
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter">Verified Logic</span>
        </div>
      </div>

      <div className="space-y-3 relative z-20 pt-1">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
            <Lock size={10} /> Private Atomic Swap
          </span>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/10 group">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">You Offer</span>
            <div className="flex gap-2">
              <input
                placeholder="0.00"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 glass-input px-3 py-2.5 bg-transparent text-foreground text-sm outline-none font-mono focus:border-purple-500/50 transition-colors"
              />
              <div className="w-28 flex-shrink-0">
                <TokenSelector value={tokenFrom} onChange={setTokenFrom} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-2 relative z-30">
          <div className="p-1.5 bg-slate-900 border border-white/10 rounded-lg text-purple-400">
            <ArrowDown size={14} />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-2 p-3 bg-white/5 rounded-xl border border-white/10 border-dashed">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">You Request</span>
            <div className="flex gap-2">
              <input
                placeholder="0.00"
                readOnly
                value={amount}
                className="flex-1 glass-input px-3 py-2.5 bg-white/5 text-foreground/50 text-sm outline-none font-mono"
              />
              <div className="w-28 flex-shrink-0 opacity-80">
                <TokenSelector value={tokenTo} onChange={setTokenTo} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
        <Info className="text-sky-400 flex-shrink-0 mt-0.5" size={14} />
        <div>
          <p className="text-[10px] text-white font-bold uppercase tracking-tighter mb-0.5">Balancing Protocol</p>
          <p className="text-[10px] text-slate-400 leading-tight">
            Transactions are balanced natively to ensure zero-collision when settling shielded intents.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSwap}
          disabled={status !== "idle" && status !== "confirmed" && status !== "error"}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            status === "idle" ? "btn-primary-glow" : 
            status === "confirmed" ? "bg-emerald-600 text-white shadow-lg" :
            status === "error" ? "bg-red-600 text-white" :
            "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {status === "idle" && <><RefreshCw className="w-4 h-4" /> Finalize Swap</>}
          {status === "exchanging" && <><ShieldCheck className="w-4 h-4 animate-pulse text-emerald-400" /> Constructing Snark...</>}
          {status === "confirmed" && <>✅ Swap Completed</>}
          {status === "error" && <>❌ Swap Error</>}
        </motion.button>
      </div>
    </div>
  );
};

export default SwapTab;
