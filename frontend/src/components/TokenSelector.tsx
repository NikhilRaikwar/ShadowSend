import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tokens = [
  { symbol: "tNIGHT", icon: "🌌", name: "Midnight" },
  { symbol: "tDUST", icon: "🌑", name: "Dust" },
];

interface TokenSelectorProps {
  value: string;
  onChange: (token: string) => void;
}

const TokenSelector = ({ value, onChange }: TokenSelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = tokens.find((t) => t.symbol === value) || tokens[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary/80 text-foreground text-sm font-medium transition-colors"
      >
        <span>{selected.icon}</span>
        <span>{selected.symbol}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-[9999] w-[150px] sm:w-[180px] rounded-xl border border-glass-border bg-[#161b22] shadow-[0_10px_40px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {tokens.map((t) => (
              <button
                key={t.symbol}
                onClick={() => { onChange(t.symbol); setOpen(false); }}
                className={`flex flex-col w-full px-4 py-2.5 text-left transition-colors ${
                  t.symbol === value ? "bg-secondary/60 text-foreground" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{t.icon}</span>
                  <span className="font-bold text-xs">{t.symbol}</span>
                </div>
                <span className="text-[10px] opacity-70 ml-5">{t.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenSelector;
