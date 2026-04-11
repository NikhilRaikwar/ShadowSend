import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { interval, filter, take, firstValueFrom, timeout, map, concatMap, catchError, throwError, of } from "rxjs";

type WalletState = "disconnected" | "connecting" | "connected" | "error";

interface WalletContextType {
  state: WalletState;
  shieldedAddress: string;
  isConnected: boolean;
  balances: Record<string, string>;
  transactions: any[];
  indexerUri: string;
  indexerWsUri: string;
  proverServerUri: string;
  walletAPI: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshAll: () => Promise<void>;
  addPendingTx: (hash: string, type: string) => void;
  setProverServerUri: (uri: string) => void;
}

const MidnightWalletContext = createContext<WalletContextType | undefined>(undefined);

export const MidnightWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>("disconnected");
  const [shieldedAddress, setShieldedAddress] = useState("");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [walletAPI, setWalletAPI] = useState<any>(null);
  
  const indexerUri = "https://indexer.preprod.midnight.network/api/v4/graphql";
  const indexerWsUri = "wss://indexer.preprod.midnight.network/api/v4/graphql/ws";
  const [proverServerUri, setProverServerUri] = useState("http://localhost:6300");

  const addPendingTx = useCallback((hash: string, type: string) => {
    setTransactions(prev => [{
      txHash: hash,
      blockHeight: null,
      metadata: { type }
    }, ...prev]);
  }, []);

  const refreshAll = useCallback(async (apiOverride?: any) => {
    const api = apiOverride || walletAPI;
    if (!api) return;
    
    try {
      const NATIVE_ID = "0000000000000000000000000000000000000000000000000000000000000000";
      const DUST_ID = "0000000000000000000000000000000000000000000000000000000000000001";
      
      const shielded = await api.getShieldedBalances();
      const unshielded = await api.getUnshieldedBalances();
      
      const extractBalance = (balances: any, tokenId: string): bigint => {
        if (!balances) return 0n;
        const val = balances[tokenId] ?? balances['native'] ?? 0;
        if (typeof val === 'bigint') return val;
        if (typeof val === 'object' && val !== null) return BigInt(val.amount ?? 0);
        return BigInt(val || 0);
      };

      const shieldedNight = extractBalance(shielded, NATIVE_ID);
      const unshieldedNight = extractBalance(unshielded, NATIVE_ID);
      const dustBalance = extractBalance(shielded, DUST_ID);

      setBalances({
        tNIGHT: (Number(shieldedNight + unshieldedNight) / 1_000_000).toFixed(4),
        tNIGHT_SHIELDED: (Number(shieldedNight) / 1_000_000).toFixed(4),
        tNIGHT_UNSHIELDED: (Number(unshieldedNight) / 1_000_000).toFixed(4),
        tDUST: (Number(dustBalance) / 1_000_000).toFixed(4),
      });

      try {
        const history = await api.getTransactions();
        if (history && history.length > 0) {
          setTransactions(prev => {
            const realTxs = history.map((h: any) => ({ ...h, metadata: h.metadata || { type: 'shielded' } }));
            const pendingOnly = prev.filter(p => !realTxs.find((r: any) => r.txHash === p.txHash));
            return [...pendingOnly, ...realTxs].slice(0, 10);
          });
        }
      } catch (e) {}

    } catch (e) {
      console.warn("Balance refresh failed:", e);
    }
  }, [walletAPI]);

  const connectWallet = async () => {
    try {
      setState("connecting");
      toast.info("Searching for Midnight identity...");

      // Implementing Robust Polling as per user snippet
      const api = await firstValueFrom(
        interval(200).pipe(
          map(() => {
            const midnight = (window as any).midnight;
            if (!midnight) return undefined;
            // Support both standard mnLace key and any other injected midnight wallets
            return midnight.mnLace || Object.values(midnight)[0];
          }),
          filter((api): api is any => !!api),
          take(1),
          timeout({
            first: 5000,
            with: () => throwError(() => new Error("Midnight Lace wallet not found. Is the extension installed?"))
          }),
          concatMap(async (initialAPI) => {
            return await initialAPI.connect("preprod");
          }),
          catchError((err) => throwError(() => err))
        )
      );

      // --- Enhanced System Diagnostics ---
      try {
        const config = await api.getConfiguration?.() || {};
        console.log("[SHADOW-WALLET] 🛡️ SYSTEM SYNCED. WALLET CONFIG:");
        console.table({
          Network: "Preprod",
          Prover_URI: config.proverServerUri || "Not Reported",
          Indexer_URI: config.indexerUri || "Not Reported",
        });

        if (config.proverServerUri) setProverServerUri(config.proverServerUri);
        
        if (config.proverServerUri && !config.proverServerUri.includes('localhost:6300')) {
          console.warn("[SHADOW-WALLET] ⚠️ ALERT: Wallet Prover URI mismatch! Go to Lace Settings > Network and set to http://localhost:6300");
          toast.warning("Check Prover Link in Lace Settings");
        }
      } catch (e) {
        console.warn("[SHADOW-WALLET] Could not retrieve config table.");
      }
      // -----------------------------------
      
      // Fetch both shielded and unshielded identities
      const shieldedAddresses = await api.getShieldedAddresses();
      const addr = shieldedAddresses?.shieldedAddress || (Array.isArray(shieldedAddresses) ? shieldedAddresses[0] : shieldedAddresses);
      
      if (!addr) throw new Error("Could not retrieve shielded address");

      setShieldedAddress(addr);
      setWalletAPI(api);
      await refreshAll(api);
      
      setState("connected");
      toast.success("🔒 System Synced — Identity Shielded!");
    } catch (e: any) {
      setState("error");
      toast.error(e.message || "Connection failed. Please check Lace wallet.");
      console.error("Wallet connection error:", e);
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
      const interval = setInterval(() => refreshAll(), 15000); 
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
        indexerWsUri,
        proverServerUri,
        walletAPI,
        connectWallet,
        disconnectWallet,
        refreshAll,
        addPendingTx,
        setProverServerUri
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
