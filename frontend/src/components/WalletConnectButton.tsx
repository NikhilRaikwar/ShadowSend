import { motion } from "framer-motion";
import { Wallet, Loader2 } from "lucide-react";
import { useMidnightWallet } from "@/contexts/MidnightWalletContext";

const WalletConnectButton = () => {
  const { state, shieldedAddress, connectWallet, disconnectWallet } = useMidnightWallet();

  const truncateAddress = (addr: string) =>
    addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  if (state === "connected") {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={disconnectWallet}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-glass-border bg-secondary/60 text-secondary-foreground text-sm font-medium backdrop-blur-sm hover:bg-secondary/80 transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span>{truncateAddress(shieldedAddress)}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={connectWallet}
      disabled={state === "connecting"}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-glass-border bg-secondary/40 text-foreground text-sm font-medium backdrop-blur-sm hover:bg-secondary/60 transition-all disabled:opacity-50"
    >
      {state === "connecting" ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span>
        {state === "connecting"
          ? "Connecting..."
          : state === "not-installed"
            ? "Install Lace"
            : state === "rejected"
              ? "Rejected"
              : state === "timeout"
                ? "Timeout"
                : "Connect Wallet"}
      </span>
    </motion.button>
  );
};

export default WalletConnectButton;
