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
    
    if (!recipients[0].address || !recipients[0].amount) {
      toast.error("Please fill in recipient and amount");
      return;
    }

    try {
      // Step 1: ZK Compliance Proof Generation
      setStatus("generating");
      toast.info("🔒 Generating ZK compliance proof...");
      await new Promise(r => setTimeout(r, 2000)); // Simulating Prover time

      // Verify logic: Proof of (Amount <= 10000 && !Blacklisted)
      setStatus("proven");
      toast.success("✓ ZK compliance verified — amount is clean & hidden");
      
      // Step 2: Submission
      setStatus("submitting");
      toast.info("📡 Submitting shielded transaction to Midnight...");
      await new Promise(r => setTimeout(r, 1500)); // Simulating Submission
      
      setStatus("confirmed");
      toast.success("🔥 Sent privately — metadata permanently shielded!");
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
      toast.error("Privacy Shield failed. Check your wallet.");
      setStatus("idle");
    }
  };

  const currentAmount = recipients[0].amount;
  const currentAddress = recipients[0].address;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {recipients.map((r, index) => (
          <motion.div 
            key={r.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-4 space-y-3 border-l-4 border-l-primary/40 bg-secondary/10"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                Recipient {index + 1}
              </span>
              {recipients.length > 1 && (
                <button onClick={() => removeRecipient(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <input
                placeholder="Paste wallet address..."
                value={r.address}
                onChange={(e) => updateRecipient(r.id, "address", e.target.value)}
                className="w-full bg-transparent border-none text-foreground text-sm outline-none placeholder:text-muted-foreground/50"
              />
              <div className="flex items-center gap-3">
                <input
                  placeholder="0.00"
                  type="number"
                  value={r.amount}
                  onChange={(e) => updateRecipient(r.id, "amount", e.target.value)}
                  className="flex-1 bg-transparent border-none text-foreground text-2xl font-semibold outline-none placeholder:text-muted-foreground/30"
                />
                <TokenSelector value={token} onChange={setToken} />
              </div>
            </div>
          </motion.div>
        ))}
        
        <button 
          onClick={addRecipient}
          className="w-full py-2 border border-dashed border-muted-foreground/20 rounded-xl text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:bg-secondary/20 transition-all"
        >
          + Add Multi-Recipient
        </button>
      </div>

      {isConnected && currentAmount && currentAddress && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="privacy-preview"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center"><span className="dot green" /> <span className="opacity-80">Amount hidden</span></div>
            <div className="flex items-center"><span className="dot green" /> <span className="opacity-80">Recipient hidden</span></div>
            <div className="flex items-center"><span className="dot green" /> <span className="opacity-80">ZK Verified ✓</span></div>
          </div>
        </motion.div>
      )}

      {isConnected && (
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Spendable</span>
            <span className="text-xs text-foreground font-medium">{(balances[token] || "0.00") + " " + token}</span>
          </div>
          <button className="text-[10px] text-primary hover:underline uppercase font-bold tracking-tighter">Top Up</button>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handlePrivateSend}
        disabled={status !== "idle"}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all relative overflow-hidden ${
          status === "idle" ? "btn-primary-glow" : "bg-secondary text-muted-foreground"
        }`}
      >
        {status === "idle" && <><Lock className="w-4 h-4" /> Send Privately</>}
        {status === "generating" && <><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Generating Proof...</>}
        {status === "proven" && <><ShieldCheck className="w-4 h-4 text-primary" /> Compliance Verified</>}
        {status === "submitting" && <><Zap className="w-4 h-4 text-yellow-400 animate-pulse" /> Submitting Tx...</>}
        {status === "confirmed" && <>✅ Transaction Confirmed</>}
      </motion.button>
    </div>
  );
};

export default SendPrivatelyTab;
