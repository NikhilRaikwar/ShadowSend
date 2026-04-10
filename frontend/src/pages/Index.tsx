import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SendPrivatelyTab from "@/components/SendPrivatelyTab";
import SwapTab from "@/components/SwapTab";
import BridgeTab from "@/components/BridgeTab";

const tabs = ["Send Privately", "Swap", "Bridge"] as const;
type Tab = (typeof tabs)[number];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Send Privately");

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <div className="w-[92%] sm:w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-secondary/60 rounded-lg border border-glass-border"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* Card */}
          <motion.div
            layout
            className="glass p-5 sm:p-6 overflow-visible"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "Send Privately" && <SendPrivatelyTab />}
                {activeTab === "Swap" && <SwapTab />}
                {activeTab === "Bridge" && <BridgeTab />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
