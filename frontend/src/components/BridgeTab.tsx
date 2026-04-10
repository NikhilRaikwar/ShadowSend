import { useState } from "react";
import { motion } from "framer-motion";
import TokenSelector from "./TokenSelector";
import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { toast } from "sonner";

const chains = ["Ethereum", "Polygon", "Arbitrum", "Optimism"];

const BridgeTab = () => {
  const { isConnected } = useMidnightWallet();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("tDUST");
  const [chain, setChain] = useState("Ethereum");
  const [recipientAddress, setRecipientAddress] = useState("");

  const handleBridge = () => {
    if (!isConnected) {
      toast.error("Connect your Lace wallet first");
      return;
    }
    console.log("Bridge:", { amount, token, chain, recipientAddress });
    toast.success("Private bridge submitted!");
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center border border-glass-border">
        <span className="text-4xl">🌉</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Cross-chain Bridge</h3>
        <p className="text-sm text-muted-foreground max-w-[240px]">
          We are working hard to bring secure, private bridging to Midnight Network.
        </p>
      </div>
      <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
        <span className="text-xs font-medium text-primary uppercase tracking-wider">Coming Soon</span>
      </div>
    </div>
  );
};

export default BridgeTab;
