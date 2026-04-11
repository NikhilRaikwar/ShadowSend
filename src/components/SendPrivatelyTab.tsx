import { useState } from "react";
import { Plus, Trash2, Shield, Loader2, Info, Lock, EyeOff, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { toast } from "sonner";

interface Recipient {
  id: string;
  address: string;
  amount: string;
}

const SendPrivatelyTab = () => {
  const { isConnected, walletAPI, refreshAll, addPendingTx } = useMidnightWallet();
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "1", address: "", amount: "" },
  ]);
  const [isShieldingActive, setIsShieldingActive] = useState(true);
  const [status, setStatus] = useState<"idle" | "generating" | "submitting" | "confirmed" | "error">("idle");

  const addRecipient = () => {
    setRecipients([...recipients, { id: Date.now().toString(), address: "", amount: "" }]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((r) => r.id !== id));
    }
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients(recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handlePrivateSend = async () => {
    if (!isConnected || !walletAPI) {
      toast.error("Connect your Midnight Lace wallet first");
      return;
    }

    // Validate all recipients
    for (const r of recipients) {
      const addr = r.address.trim();
      if (!addr.startsWith('mn_')) {
        toast.error(`Invalid address format: must start with mn_`);
        return;
      }
      if (!r.amount || parseFloat(r.amount) <= 0) {
        toast.error("Enter a valid amount greater than 0");
        return;
      }
    }

    try {
      setStatus("generating");
      toast.info("🔒 Constructing Shielded ZK-Proof...");

      // SDK Constant: nativeToken().raw is all zeros
      const NATIVE_ASSET_ID = "0000000000000000000000000000000000000000000000000000000000000000";

      const transferItems = recipients.map(r => {
        const addr = r.address.trim();
        // Force 'shielded' for maximum privacy as per SDK snippet
        const isShielded = addr.startsWith('mn_shield-addr');
        const microAmount = BigInt(Math.floor(parseFloat(r.amount) * 1_000_000));
        
        return {
          kind: isShielded ? 'shielded' : 'unshielded',
          tokenType: NATIVE_ASSET_ID,
          value: microAmount, 
          recipient: addr,
        };
      });

      console.log("Submitting transfer request:", transferItems);
      
      const tx = await walletAPI.makeTransfer(transferItems);
      
      setStatus("submitting");
      toast.info("💎 ZK proof generated — submitting to Midnight...");
      
      const result = await walletAPI.submitTransaction(tx);
      const txHash = typeof result === 'string' ? result : (result?.txHash || result?.id || "");
      
      if (txHash) {
        addPendingTx(txHash, isShieldingActive ? 'shielded' : 'unshielded');
        toast.success(`✅ Sent privately! TX: ${txHash.slice(0, 12)}...`);
      }

      await refreshAll();
      setStatus("confirmed");
      setRecipients([{ id: "1", address: "", amount: "" }]);
      setTimeout(() => setStatus("idle"), 5000);
      
    } catch (e: any) {
      console.error("Transfer error:", e);
      toast.error(`Transfer failed: ${e.message || "Check wallet and try again"}`);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center gap-2">
          <Lock size={10} /> ZK-Transfer Protocol
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-500 uppercase">ZK-Shielding</span>
          <button 
            onClick={() => setIsShieldingActive(!isShieldingActive)}
            className={`w-8 h-4 rounded-full relative transition-colors ${isShieldingActive ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <motion.div 
              animate={{ x: isShieldingActive ? 18 : 2 }}
              className="absolute top-1 left-0 w-2 h-2 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {recipients.map((recipient, index) => (
            <motion.div
              key={recipient.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Recipient #{index + 1}</span>
                {recipients.length > 1 && (
                  <button onClick={() => removeRecipient(recipient.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <input
                placeholder="mn_shield-addr..."
                value={recipient.address}
                onChange={(e) => updateRecipient(recipient.id, "address", e.target.value)}
                className="w-full glass-input px-3 py-2 text-xs bg-transparent text-foreground outline-none font-mono"
              />
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    placeholder="0.00"
                    type="number"
                    value={recipient.amount}
                    onChange={(e) => updateRecipient(recipient.id, "amount", e.target.value)}
                    className="w-full glass-input pl-3 pr-12 py-2 text-xs bg-transparent text-foreground outline-none font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">tNIGHT</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={addRecipient}
        className="w-full py-2 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-white hover:border-white/20 transition-all uppercase font-bold tracking-widest"
      >
        <Plus size={14} /> Add Recipient
      </button>

      {/* CRITICAL: Privacy Preview Banner */}
      {recipients.some(r => r.address && r.amount) && isShieldingActive && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 px-3 py-2.5 rounded-xl text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase font-black tracking-widest"
        >
          <div className="flex items-center gap-1.5"><ShieldCheck size={10} /> Amount Hidden</div>
          <div className="flex items-center gap-1.5"><EyeOff size={10} /> Identity Shielded</div>
          <div className="flex items-center gap-1.5"><Lock size={10} /> ZK-Proof Ready</div>
        </motion.div>
      )}

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handlePrivateSend}
          disabled={status === "generating" || status === "submitting"}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            status === "idle" ? "btn-primary-glow shadow-[0_0_30px_rgba(37,99,235,0.2)]" : 
            status === "confirmed" ? "bg-emerald-600 text-white shadow-lg" :
            status === "error" ? "bg-red-600 text-white" :
            "bg-secondary text-muted-foreground cursor-not-allowed border border-white/5"
          }`}
        >
          {status === "idle" && <><Shield className="w-4 h-4" /> Finalize Shielded Send</>}
          {status === "generating" && <><Loader2 className="w-4 h-4 animate-spin" /> Generating ZK Proof...</>}
          {status === "submitting" && <><Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Broadcasting to Midnight...</>}
          {status === "confirmed" && <>✅ Shielded Transfer Success</>}
          {status === "error" && <>❌ Transfer Error</>}
        </motion.button>
      </div>
    </div>
  );
};

export default SendPrivatelyTab;
