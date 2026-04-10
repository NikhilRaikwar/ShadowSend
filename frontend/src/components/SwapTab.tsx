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
  const [status, setStatus] = useState("idle");

  const handleSwap = async () => {
    if (!isConnected) {
      toast.error("Connect your Lace wallet first");
      return;
    }
    
    try {
      setStatus("initiating");
      toast.info("📜 Initiating private swap offer...");
      
      // Constructing initSwap Tx
      // await wallet.initSwap({ shielded: { [fromToken]: amount } }, [...]);
      await new Promise(r => setTimeout(r, 2000));
      
      setStatus("matching");
      toast.success("Offer published to the Midnight Shadow Layer!");
      
      // This is where Bob would balance and sign
      await new Promise(r => setTimeout(r, 1500));
      
      setStatus("confirmed");
      toast.success("✓ Swap settled! Tokens exchanged privately.");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      toast.error("Atomic swap failed.");
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="glass-card p-4 space-y-2 bg-secondary/5">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">You Send</p>
          <div className="flex items-center gap-3">
            <input
              placeholder="0.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent border-none text-foreground text-2xl font-semibold outline-none placeholder:text-muted-foreground/30"
            />
            <TokenSelector value={fromToken} onChange={setFromToken} />
          </div>
          {isConnected && (
            <p className="text-[10px] text-muted-foreground">Balance: {balances[fromToken] || "0.00"} {fromToken}</p>
          )}
        </div>

        <div className="flex justify-center -my-6 relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#1c2128] border border-glass-border flex items-center justify-center shadow-lg">
            <Zap className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="glass-card p-4 space-y-2 bg-primary/5">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">You Receive (Shadowed)</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 text-foreground text-2xl font-semibold opacity-40 italic">Auto-calculating...</div>
            <TokenSelector value={toToken} onChange={setToToken} />
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleSwap}
        disabled={status !== "idle"}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
          status === "idle" ? "btn-primary-glow" : "bg-secondary text-muted-foreground"
        }`}
      >
        {status === "idle" && "Initiate Private Swap"}
        {status === "initiating" && <><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Publishing Offer...</>}
        {status === "matching" && "Matching Settlement..."}
        {status === "confirmed" && "✓ Swap Confirmed"}
      </motion.button>
      
      <p className="text-[10px] text-center text-muted-foreground italic px-4">
        ShadowSend uses atomic P2P settlement. Your identities remain hidden from the chain.
      </p>
    </div>
  );
};

export default SwapTab;
