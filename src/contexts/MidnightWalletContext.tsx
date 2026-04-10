import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

type WalletState = "disconnected" | "connecting" | "connected" | "error";

interface WalletContextType {
  state: WalletState;
  shieldedAddress: string;
  isConnected: boolean;
  balances: Record<string, string>;
  transactions: any[];
  indexerUri: string;
  proverServerUri: string;
  walletAPI: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshAll: () => Promise<void>;
  addPendingTx: (hash: string, type: string) => void;
}

const MidnightWalletContext = createContext<WalletContextType | undefined>(undefined);

export const MidnightWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>("disconnected");
  const [shieldedAddress, setShieldedAddress] = useState("");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [walletAPI, setWalletAPI] = useState<any>(null);

  const indexerUri = "https://indexer.preprod.midnight.network/api/v3/graphql";
  const proverServerUri = "http://localhost:6300";

  // Function to manually add a transaction hash to the list (for immediate feedback)
  const addPendingTx = useCallback((hash: string, type: string) => {
    setTransactions(prev => [{
      txHash: hash,
      blockHeight: null, // Pending status
      metadata: { type }
    }, ...prev]);
  }, []);

  const refreshAll = useCallback(async (apiOverride?: any) => {
    const api = apiOverride || walletAPI;
    if (!api) return;
    try {
      const shielded = await api.getShieldedBalances();
      const unshielded = await api.getUnshieldedBalances();
      
      const getVal = (bal: any, id?: string) => {
        const NATIVE_ID = "0000000000000000000000000000000000000000000000000000000000000000";
        const DUST_ID = "0000000000000000000000000000000000000000000000000000000000000002"; // Common DUST ID
        
        const targetId = id || NATIVE_ID;
        const val = bal[targetId] || bal['native'] || (id ? 0 : Object.values(bal)[0]);
        if (!val) return 0n;
        return typeof val === 'object' ? BigInt(val.amount || 0) : BigInt(val);
      };

      const sVal = getVal(shielded);
      const uVal = getVal(unshielded);
      const sDust = getVal(shielded, "0000000000000000000000000000000000000000000000000000000000000002");

      setBalances({
        tNIGHT: (Number(sVal + uVal) / 1_000_000).toFixed(2),
        tNIGHT_SHIELDED: (Number(sVal) / 1_000_000).toFixed(2),
        tNIGHT_UNSHIELDED: (Number(uVal) / 1_000_000).toFixed(2),
        tDUST: (Number(sDust) / 1_000_000).toFixed(2),
      });

      // Try fetching real history if possible, else we keep our local session txs
      try {
        const history = await api.getTransactions();
        if (history && history.length > 0) {
          setTransactions(prev => {
            // Merge local pending with real history, avoiding duplicates
            const realTxs = history.map((h: any) => ({ ...h, metadata: h.metadata || { type: 'shielded' } }));
            const pendingOnly = prev.filter(p => !realTxs.find((r: any) => r.txHash === p.txHash));
            return [...pendingOnly, ...realTxs].slice(0, 10);
          });
        }
      } catch (e) {
        // Silent: Some Lace versions don't expose history yet
      }

    } catch (e) {
      console.warn("Auto-refresh fail:", e);
    }
  }, [walletAPI]);

  const connectWallet = async () => {
    try {
      setState("connecting");
      const win = window as any;
      const provider = [
        win.midnight?.mnLace,
        win.cardano?.midnight,
        ...(win.midnight ? Object.values(win.midnight) : [])
      ].find(p => typeof p?.connect === 'function');

      if (!provider) {
        toast.error("Midnight Lace not found!");
        setState("disconnected");
        return;
      }

      const connectedApi = await provider.connect('preprod');
      const addresses = await connectedApi.getShieldedAddresses();
      
      setShieldedAddress(addresses.shieldedAddress);
      setWalletAPI(connectedApi);
      await refreshAll(connectedApi);
      
      setState("connected");
      toast.success("Identity Shielded!");
    } catch (e: any) {
      setState("error");
      toast.error(`Offline: ${e.message}`);
    }
  };

  const disconnectWallet = () => {
    setState("disconnected");
    setShieldedAddress("");
    setWalletAPI(null);
    setBalances({});
    setTransactions([]);
    toast.info("Connection Terminated");
  };

  useEffect(() => {
    if (state === "connected" && walletAPI) {
      const interval = setInterval(() => refreshAll(), 10000); 
      return () => clearInterval(interval);
    }
  }, [state, walletAPI, refreshAll]);

  return (
    <MidnightWalletContext.Provider
      value={{
        state,
        shieldedAddress,
        isConnected: state === "connected",
        balances,
        transactions,
        indexerUri,
        proverServerUri,
        walletAPI,
        connectWallet,
        disconnectWallet,
        refreshAll,
        addPendingTx
      }}
    >
      {children}
    </MidnightWalletContext.Provider>
  );
};

export const useMidnightWallet = () => {
  const context = useContext(MidnightWalletContext);
  if (context === undefined) {
    throw new Error("useMidnightWallet must be used within a MidnightWalletProvider");
  }
  return context;
};
