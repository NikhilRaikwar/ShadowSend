import { Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => (
  <footer className="w-full py-8 px-4 sm:px-6 relative z-10 border-t border-white/5 bg-slate-950/20 backdrop-blur-md">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex flex-col items-center sm:items-start">
        <p className="text-white font-black text-lg tracking-tighter uppercase italic">
          ShadowSend
        </p>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
          Zero-Knowledge Privacy Layer
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <motion.a
          whileHover={{ y: -2, color: "#fff" }}
          href="https://github.com/NikhilRaikwar/ShadowSend"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-slate-400 text-xs font-bold transition-colors"
        >
          <Github size={16} />
          <span>GITHUB</span>
        </motion.a>
        <motion.a
          whileHover={{ y: -2, color: "#1DA1F2" }}
          href="https://x.com/NikhilRaikwarr"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-slate-400 text-xs font-bold transition-colors"
        >
          <Twitter size={16} />
          <span>TWITTER</span>
        </motion.a>
      </div>

      <div className="text-center sm:text-right">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Built for Midnight Hackathon 2026
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
