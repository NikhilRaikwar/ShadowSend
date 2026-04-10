import { useState } from "react";
import { Plus, Trash2, ShieldCheck, Zap, Lock, EyeOff, Send, AlertCircle, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TokenSelector from "./TokenSelector";
import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { toast } from "sonner";

interface Recipient {
  id: string;
  address: string;
  amount: string;
}

const SendPrivatelyTab = () => {
  const { isConnected, walletAPI, balances, refreshAll, addPendingTx } = useMidnightWallet();
  const [token, setToken] = useState("tNIGHT");
  const [status, setStatus] = useState<"idle" | "generating" | "submitting" | "confirmed" | "error">("idle");
  const [isShieldingActive, setIsShieldingActive] = useState(true);
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "1", address: "", amount: "" },
  ]);

  const addRecipient = () => {
    setRecipients([...recipients, { id: Date.now().toString(), address: "", amount: "" }]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length <= 1) return;
    setRecipients(recipients.filter((r) => r.id !== id));
  };

  const updateRecipient = (id: string, field: keyof Omit<Recipient, "id">, value: string) => {
    setRecipients(recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handlePrivateSend = async () => {
    if (!isConnected || !walletAPI) {
      toast.error("Connect your Lace wallet first");
      return;
    }

    // Comprehensive Validation + Clean Up
    for (const r of recipients) {
      const cleanAddress = r.address.trim();
      const isValidPrefix = cleanAddress.startsWith('mn_addr_preprod') || cleanAddress.startsWith('mn_shield-addr_preprod');
      
      if (!isValidPrefix) {
        toast.error("Invalid Address: Must be a Midnight Preprod address");
        return;
      }
      if (!r.amount || parseFloat(r.amount) <= 0) {
        toast.error("Enter a valid amount");
        return;
      }
    }
    
    try {
      setStatus("generating");
      toast.info(isShieldingActive ? "🔒 Shielding assets on Preprod..." : "📡 Sending unshielded assets...");

      // Construct Transfer Data with OFFICIAL ASSET ID (64 zeros)
      const NATIVE_ID = "0000000000000000000000000000000000000000000000000000000000000000";
      
      const transferItems = recipients.map(r => {
        const trimmedAddr = r.address.trim();
        const detectKind = trimmedAddr.startsWith('mn_shield-addr') ? 'shielded' : 'unshielded';
        
        return {
          kind: detectKind,
          type: NATIVE_ID, 
          value: BigInt(Math.floor(parseFloat(r.amount) * 1_000_000)).toString(), // Pass as string to avoid polyfill object issues
          recipient: trimmedAddr
        };
      });

      console.log("Requesting transfer from wallet...");
      const tx = await walletAPI.makeTransfer(transferItems);
      
      setStatus("submitting");
      toast.info("💎 ZK Proof Generated! Submitting to Midnight...");

      const result = await walletAPI.submitTransaction(tx);
      const txHash = typeof result === 'string' ? result : result.txHash;
      console.log("Transaction Submitted! Hash:", txHash);

      // Add to local session feed
      addPendingTx(txHash, isShieldingActive ? 'shielded' : 'unshielded');

      // Trigger instant balance sync
      await refreshAll();

      setStatus("confirmed");
      toast.success(isShieldingActive ? "🔥 Private transfer successful!" : "✅ Public transfer successful!");
      
      setRecipients([{ id: "1", address: "", amount: "" }]);
      setTimeout(() => setStatus("idle"), 5000);
    } catch (e: any) {
      console.error("Transfer failed:", e);
      toast.error(`Transfer Failed: ${e.message || "Unknown error"}`);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Preprod Balance
          </span>
          <span className="text-xs sm:text-sm text-foreground font-medium">
            {(balances[token] || "0.00") + " " + token}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
          <Zap size={12} className="text-purple-400" />
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter">Preprod Testnet</span>
        </div>
      </div>

      <div className="space-y-3 relative z-20 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
            <Lock size={10} /> Send to:
          </span>
          <button onClick={addRecipient} className="text-muted-foreground hover:text-foreground transition-colors p-1 bg-white/5 rounded-md">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <AnimatePresence mode="popLayout">
          {recipients.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex gap-2"
            >
              <div className="flex-1 flex flex-col gap-2">
                <input
                  placeholder="mn_addr_preprod..."
                  value={r.address}
                  onChange={(e) => updateRecipient(r.id, "address", e.target.value)}
                  className="w-full glass-input px-3 py-2.5 bg-transparent text-foreground text-xs outline-none font-mono focus:border-purple-500/50 transition-colors"
                />
                <div className="flex gap-2">
                  <input
                    placeholder="0.00"
                    type="number"
                    value={r.amount}
                    onChange={(e) => updateRecipient(r.id, "amount", e.target.value)}
                    className="flex-1 glass-input px-3 py-2.5 bg-transparent text-foreground text-xs outline-none"
                  />
                  <div className="w-28 flex-shrink-0">
                    <TokenSelector value={token} onChange={setToken} />
                  </div>
                </div>
              </div>
              {recipients.length > 1 && (
                <button onClick={() => removeRecipient(r.id)} className="p-2 self-start text-muted-foreground hover:text-destructive bg-white/5 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div 
        onClick={() => setIsShieldingActive(!isShieldingActive)}
        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all select-none group"
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg transition-colors ${isShieldingActive ? 'bg-emerald-500/10' : 'bg-slate-500/10'}`}>
            {isShieldingActive ? <EyeOff className="text-emerald-500" size={16} /> : <Eye className="text-slate-400" size={16} />}
          </div>
          <div>
            <p className="text-[11px] font-bold text-white uppercase tracking-tighter">
              {isShieldingActive ? 'Shielding Active' : 'Public Mode'}
            </p>
            <p className="text-[10px] text-slate-400">
              {isShieldingActive ? 'Amounts and recipients are hidden' : 'Transaction data will be public'}
            </p>
          </div>
        </div>
        <div className={`w-10 h-5 rounded-full relative transition-all ${isShieldingActive ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-700'}`}>
          <motion.div 
            animate={{ x: isShieldingActive ? 20 : 2 }}
            className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-md"
          />
        </div>
      </div>

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handlePrivateSend}
          disabled={status !== "idle" && status !== "confirmed" && status !== "error"}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            status === "idle" ? "btn-primary-glow" : 
            status === "confirmed" ? "bg-emerald-600 text-white shadow-lg" :
            status === "error" ? "bg-red-600 text-white" :
            "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {status === "idle" && <><Send className="w-4 h-4" /> {isShieldingActive ? 'Send Shielded' : 'Send Public'}</>}
          {status === "generating" && <><ShieldCheck className="w-4 h-4 animate-pulse text-emerald-400" /> Shielding Assets...</>}
          {status === "submitting" && <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Submitting...</>}
          {status === "confirmed" && <>✅ Sent Successfully</>}
          {status === "error" && <><AlertCircle className="w-4 h-4" /> Error - Try Again</>}
        </motion.button>
      </div>
    </div>
  );
};

export default SendPrivatelyTab;
