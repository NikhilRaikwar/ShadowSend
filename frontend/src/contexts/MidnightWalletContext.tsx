import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { interval, filter, take, firstValueFrom, timeout, map, concatMap, catchError, throwError } from 'rxjs';

type WalletState = "not-installed" | "disconnected" | "connecting" | "connected" | "rejected" | "timeout";

interface WalletContextType {
  state: WalletState;
  shieldedAddress: string;
  isConnected: boolean;
  balances: Record<string, string>;
  indexerUri: string;
  proverServerUri: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const MidnightWalletContext = createContext<WalletContextType | null>(null);

export const useMidnightWallet = () => {
  const ctx = useContext(MidnightWalletContext);
  if (!ctx) throw new Error("useMidnightWallet must be used within MidnightWalletProvider");
  return ctx;
};

export const MidnightWalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>("disconnected");
  const [shieldedAddress, setShieldedAddress] = useState("");
  const [indexerUri, setIndexerUri] = useState("");
  const [proverServerUri, setProverServerUri] = useState("");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [walletAPI, setWalletAPI] = useState<any>(null);

  const updateBalances = useCallback(async (api: any) => {
    try {
      const shielded = await api.getShieldedBalances();
      const unshielded = await api.getUnshieldedBalances();
      const dust = await api.getDustBalance();

      const NATIVE_ASSET_ID = "0000000000000000000000000000000000000000000000000000000000000000";

      const getVal = (val: any) => {
        if (typeof val === 'bigint') return val;
        if (typeof val === 'number') return BigInt(val);
        if (typeof val === 'object' && val !== null) {
          if ('amount' in val) return BigInt(val.amount);
          if ('balance' in val) return BigInt(val.balance);
        }
        if (typeof val === 'string') return BigInt(val);
        return 0n;
      };

      const newBalances: Record<string, string> = {
        // We sum shielded and unshielded for the real total tNIGHT balance
        tNIGHT: ((getVal(shielded[NATIVE_ASSET_ID]) + getVal(unshielded[NATIVE_ASSET_ID])) / 1000000n).toString(),
        tDUST: (getVal(dust) / 1000000n).toString()
      };
      setBalances(newBalances);
    } catch (e) {
      console.error("Failed to fetch balances", e);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setState("connecting");
    try {
      const result = await firstValueFrom(
        interval(200).pipe(
          map(() => {
            const midnight = (window as any).midnight;
            if (!midnight) return undefined;
            return midnight.mnLace || Object.values(midnight)[0];
          }),
          filter((initialAPI): initialAPI is any => !!initialAPI),
          take(1),
          timeout({
            first: 5000,
            with: () => throwError(() => new Error('timeout')),
          }),
          concatMap(async (initialAPI) => {
            const connectedAPI = await initialAPI.connect('preprod');
            return connectedAPI;
          })
        )
      );

      setWalletAPI(result);
      const config = await result.getConfiguration();
      const addresses = await result.getShieldedAddresses();

      setShieldedAddress(addresses.shieldedAddress);
      setIndexerUri(config.indexerUri);
      setProverServerUri(config.proverServerUri);
      
      await updateBalances(result);
      setState("connected");
    } catch (err: any) {
      console.error(err);
      setState(err?.message === "timeout" ? "timeout" : "rejected");
      setTimeout(() => setState("disconnected"), 3000);
    }
  }, [updateBalances]);

  useEffect(() => {
    if (state === "connected" && walletAPI) {
      const poller = setInterval(() => updateBalances(walletAPI), 10000);
      return () => clearInterval(poller);
    }
  }, [state, walletAPI, updateBalances]);

  const disconnectWallet = useCallback(() => {
    setState("disconnected");
    setShieldedAddress("");
    setBalances({});
    setWalletAPI(null);
  }, []);

  return (
    <MidnightWalletContext.Provider
      value={{
        state,
        shieldedAddress,
        isConnected: state === "connected",
        balances,
        indexerUri,
        proverServerUri,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </MidnightWalletContext.Provider>
  );
};
