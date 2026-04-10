import { motion } from "framer-motion";

const GhostLogo = ({ size = 36 }: { size?: number }) => (
  <motion.div
    animate={{ y: [0, -6, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    className="relative"
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className="drop-shadow-[0_0_12px_hsl(217,91%,60%,0.5)]"
    >
      <path
        d="M24 4C15.163 4 8 11.163 8 20v18c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2c0-1.1.9-2 2-2s2 .9 2 2v2c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-2c0-1.1.9-2 2-2s2 .9 2 2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V20c0-8.837-7.163-16-16-16z"
        fill="url(#ghostGrad)"
        fillOpacity="0.9"
      />
      <circle cx="18" cy="22" r="3" fill="hsl(217, 91%, 60%)" fillOpacity="0.9" />
      <circle cx="30" cy="22" r="3" fill="hsl(217, 91%, 60%)" fillOpacity="0.9" />
      <defs>
        <linearGradient id="ghostGrad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="hsl(220, 30%, 18%)" />
          <stop offset="1" stopColor="hsl(222, 47%, 8%)" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

export default GhostLogo;
