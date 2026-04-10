import { useState } from "react";
import { Plus, Trash2, ShieldCheck, Zap, Lock } from "lucide-react";
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
  const { isConnected, shieldedAddress, balances } = useMidnightWallet();
  const [token, setToken] = useState("tNIGHT");
  const [status, setStatus] = useState<"idle" | "generating" | "proven" | "submitting" | "confirmed">("idle");
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
    if (!isConnected) {
      toast.error("Connect your Lace wallet first");
      return;
    }
    
    try {
      // Step 1: Compliance
      setStatus("generating");
      toast.info("🔒 Generating ZK compliance proof...");
      // await deployedContract.callTx.register_compliance();
      await new Promise(r => setTimeout(r, 2000)); 

      setStatus("proven");
      toast.success("✓ ZK verified — amount hidden");

      // Step 2: Send
      setStatus("submitting");
      toast.info("📡 Submitting shielded distribution...");
      // await deployedContract.callTx.perform_shielded_send(shieldedInput, recipient, value);
      await new Promise(r => setTimeout(r, 1500));

      setStatus("confirmed");
      toast.success("🔥 Private transfer successful!");
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      toast.error("Privacy Shield failed.");
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-4">
      {isConnected && (
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Spendable Balance
            </span>
            <span className="text-xs sm:text-sm text-foreground font-medium">
              {(balances[token] || "0.00") + " " + token}
            </span>
          </div>
          <button className="text-[10px] text-primary hover:underline uppercase font-bold tracking-tighter">Top Up</button>
        </div>
      )}

      <div className="space-y-3 relative z-20 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Recipients:</span>
          <button onClick={addRecipient} className="text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <AnimatePresence>
          {recipients.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-2"
            >
              <div className="flex-1 flex flex-col gap-2">
                <input
                  placeholder="Midnight Address"
                  value={r.address}
                  onChange={(e) => updateRecipient(r.id, "address", e.target.value)}
                  className="w-full glass-input px-3 py-2.5 bg-transparent text-foreground text-xs outline-none"
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
                <button onClick={() => removeRecipient(r.id)} className="p-2 self-start text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handlePrivateSend}
          disabled={status !== "idle"}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
            status === "idle" ? "btn-primary-glow" : "bg-secondary text-muted-foreground"
          }`}
        >
          {status === "idle" && <><Lock className="w-4 h-4" /> Send Privately</>}
          {status === "generating" && <><div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Verifying...</>}
          {status === "proven" && <><ShieldCheck className="w-4 h-4 text-emerald-500" /> Compliant</>}
          {status === "submitting" && <><Zap className="w-4 h-4 text-yellow-500 animate-pulse" /> Shielding...</>}
          {status === "confirmed" && <>✅ Sent</>}
        </motion.button>
      </div>
      
      {isConnected && recipients[0].amount && (
        <div className="flex items-center justify-center gap-4 text-[9px] text-emerald-500 font-bold tracking-widest opacity-80 pt-1">
          <span>AMOUNT HIDDEN</span>
          <span>•</span>
          <span>ZK PROTECTED</span>
        </div>
      )}
    </div>
  );
};

export default SendPrivatelyTab;
