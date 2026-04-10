import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Loader2, ChevronDown, LogOut, Copy, Check } from "lucide-react";
import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { toast } from "sonner";

const WalletConnectButton = () => {
  const { state, shieldedAddress, connectWallet, disconnectWallet } = useMidnightWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const truncateAddress = (addr: string) =>
    addr.length > 12 ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : addr;

  const handleCopy = () => {
    navigator.clipboard.writeText(shieldedAddress);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (state === "connected") {
    return (
      <div className="relative" ref={menuRef}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-glass-border bg-emerald-500/5 text-emerald-400 text-xs font-bold backdrop-blur-md hover:bg-emerald-500/10 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{truncateAddress(shieldedAddress)}</span>
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-12 right-0 w-64 glass-panel border border-white/10 p-2 z-[100] shadow-2xl overflow-hidden"
            >
              <div className="p-3 border-b border-white/5 mb-1 bg-white/5 rounded-lg">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5">Connected Identity</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-white font-mono truncate">{shieldedAddress}</p>
                  <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors">
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    disconnectWallet();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-all group uppercase tracking-tight"
                >
                  <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  Terminate Connection
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={connectWallet}
      disabled={state === "connecting"}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-glass-border bg-white/5 text-foreground text-sm font-bold backdrop-blur-sm hover:bg-white/10 transition-all disabled:opacity-50"
    >
      {state === "connecting" ? (
        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
      ) : (
        <Wallet className="w-4 h-4 text-purple-400" />
      )}
      <span className="uppercase tracking-tight">
        {state === "connecting" ? "Shielding Session..." : "Connect Wallet"}
      </span>
    </motion.button>
  );
};

export default WalletConnectButton;
