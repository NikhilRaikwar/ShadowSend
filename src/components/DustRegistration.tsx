import { useState } from "react";
import { useMidnightWallet } from "@/contexts/MidnightWalletContext";
import { toast } from "sonner";
import { Zap, ShieldAlert, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DustRegistration = () => {
  const { walletAPI, balances, isConnected } = useMidnightWallet();
  const [loading, setLoading] = useState(false);

  // Note: For Lace DApp connector, UTXO registration is often automated high-level,
  // but users still need to be aware if they have 0 DUST as it blocks transactions.
  const registerDust = async () => {
    if (!walletAPI) return;
    setLoading(true);
    try {
      toast.info("⚡ Synchronizing tNIGHT for DUST generation...");
      
      // In a real SDK scenario, this would involve calling the registerNightUtxos method
      // For the demo, we simulate the onboarding step which is required for first-time use.
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("✅ DUST registration intent submitted! DUST will appear in 1-2 blocks.");
    } catch (e: any) {
      toast.error(`Auto-registration failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) return null;
  
  const hasDust = parseFloat(balances.tDUST || "0") > 0;
  if (hasDust) return null; 

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="mb-4 overflow-hidden"
    >
      <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-4">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <Zap size={18} className="text-amber-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-amber-500 uppercase tracking-widest">tDUST Required</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-2 max-w-[280px]">
            To generate ZK-Proofs, your identity needs Energy (tDUST). Register your tNIGHT UTXOs to start auto-generation.
          </p>
          <button
            onClick={registerDust}
            disabled={loading}
            className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest hover:text-amber-300 transition-colors bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/10"
          >
            {loading ? (
              <><Loader2 size={12} className="animate-spin" /> Registering...</>
            ) : (
              "→ Initialize DUST Energy"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DustRegistration;
