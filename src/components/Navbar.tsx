import { motion } from "framer-motion";
import WalletConnectButton from "./WalletConnectButton";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 bg-transparent">
    <div className="flex items-center">
      <motion.img
        src="/shadowsend.png"
        alt="ShadowSend"
        className="h-16 sm:h-20 md:h-28 w-auto drop-shadow-[0_0_32px_hsl(217,91%,60%,0.8)]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    <WalletConnectButton />
  </nav>
);

export default Navbar;
