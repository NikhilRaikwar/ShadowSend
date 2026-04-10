import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("tDUST");
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

  const handlePrivateSend = () => {
    if (!isConnected) {
      toast.error("Connect your Lace wallet first");
      return;
    }
    const tx = {
      sender: shieldedAddress,
      recipients: recipients.map((r) => ({ address: r.address, amount: r.amount })),
      token,
    };
    console.log("Private send tx:", tx);
    toast.success("Private transaction submitted!");
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
          <TokenSelector value={token} onChange={setToken} />
        </div>
      </div>

      {isConnected && (
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Private balance
            </span>
            <span className="text-xs sm:text-sm text-foreground font-medium">
              {(balances[token] || "0.00") + " " + token}
            </span>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary/40 hover:bg-secondary/60 border border-glass-border text-xs font-medium transition-all">
            <Plus className="w-3 h-3" /> Top Up
          </button>
        </div>
      )}

      <div className="space-y-2 relative z-20 pt-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-muted-foreground">Recipients:</span>
          <button
            onClick={addRecipient}
            className="p-1.5 rounded-lg hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <AnimatePresence>
          {recipients.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2"
            >
              <input
                placeholder="wallet address"
                value={r.address}
                onChange={(e) => updateRecipient(r.id, "address", e.target.value)}
                className="flex-1 glass-input px-4 py-3 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
              />
              <input
                placeholder="amount"
                type="number"
                value={r.amount}
                onChange={(e) => updateRecipient(r.id, "amount", e.target.value)}
                className="w-24 glass-input px-3 py-3 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => removeRecipient(r.id)}
                className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handlePrivateSend}
          className="w-full py-3.5 rounded-xl btn-primary-glow text-sm font-semibold transition-all relative z-10"
        >
          🔒 Send Privately
        </motion.button>
      </div>
    </div>
  );
};

export default SendPrivatelyTab;
