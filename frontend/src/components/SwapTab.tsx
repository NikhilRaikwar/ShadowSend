import { useState } from "react";
import { motion } from "framer-motion";
import TokenSelector from "./TokenSelector";
import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const SwapTab = () => {
  const { isConnected, balances } = useMidnightWallet();
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("tDUST");
  const [toToken, setToToken] = useState("USDC");

  const handleSwap = () => {
    if (!isConnected) {
      toast.error("Connect your Lace wallet first");
      return;
    }
    console.log("Swap:", { amount, fromToken, toToken });
    toast.success("Private swap submitted!");
  };

  return (
    <div className="space-y-4">
      <div className="glass-input flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 min-w-0 relative z-30">
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-transparent text-foreground text-md sm:text-lg outline-none placeholder:text-muted-foreground min-w-0"
        />
        <button
          onClick={() => setAmount("0")}
          className="px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded bg-secondary/80 text-secondary-foreground flex-shrink-0"
        >
          MAX
        </button>
        <div className="flex-shrink-0">
          <TokenSelector value={fromToken} onChange={setFromToken} />
        </div>
      </div>

      {isConnected && (
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Private balance
            </span>
            <span className="text-xs sm:text-sm text-foreground font-medium">
              {(balances[fromToken] || "0.00") + " " + fromToken}
            </span>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/40 hover:bg-secondary/60 border border-glass-border text-xs font-medium transition-all">
            <Plus className="w-3 h-3" /> Top Up
          </button>
        </div>
      )}

      <div className="glass-input flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 min-w-0 relative z-20">
        <span className="flex-1 text-muted-foreground text-xs sm:text-sm truncate mr-1">Swap to private {toToken}</span>
        <div className="flex-shrink-0">
          <TokenSelector value={toToken} onChange={setToToken} />
        </div>
      </div>

      {isConnected && (
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Expected Output
          </span>
          <span className="text-xs sm:text-sm text-foreground font-medium italic">
            Private balance: Loading..
          </span>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleSwap}
        className="w-full py-3.5 rounded-xl btn-primary-glow text-sm font-semibold transition-all relative z-10"
      >
        🔄 Swap Privately
      </motion.button>
    </div>
  );
};

export default SwapTab;
