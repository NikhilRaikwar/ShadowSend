import { WitnessContext } from '@midnight-ntwrk/compact-runtime';

/**
 * Witnesses for the ShadowSend contract.
 * These functions are called by the ZK-Prover to get private user data.
 * The data stays in the local proof server and is NEVER sent to the blockchain.
 */

export const witnesses = {
  /**
   * Returns a unique private identifier for the user's compliance record.
   * This allows the user to have a 'verified' status without revealing their wallet address.
   */
  getPrivateIdentifier: (): Bytes<32> => {
    // In a real app, this would be a hash of the user's private key or session
    return new Uint8Array(32).fill(1); 
  },

  /**
   * Returns the private transfer amount to check against AML rules.
   */
  getTransferAmount: (): Uint<128> => {
    // This is pulled from the frontend input state during proof generation
    return 1000n; 
  }
};
