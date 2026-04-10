import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';

/**
 * ShadowSend Private State
 * This data stays localized to the user's proof server.
 */
export type ShadowSendPrivateState = {
  readonly transferAmount:    bigint;
  readonly privateIdentifier: Uint8Array;
  readonly isBlacklisted:     boolean;
  readonly offerId:           Uint8Array;
};

export const createInitialState = (): ShadowSendPrivateState => ({
  transferAmount:    0n,
  privateIdentifier: crypto.getRandomValues(new Uint8Array(32)),
  isBlacklisted:     false,
  offerId:           crypto.getRandomValues(new Uint8Array(32)),
});

export const witnesses = {
  getTransferAmount: (
    { privateState }: WitnessContext<any, ShadowSendPrivateState>
  ): [ShadowSendPrivateState, bigint] =>
    [privateState, privateState.transferAmount],

  getPrivateIdentifier: (
    { privateState }: WitnessContext<any, ShadowSendPrivateState>
  ): [ShadowSendPrivateState, Uint8Array] =>
    [privateState, privateState.privateIdentifier],

  getIsBlacklisted: (
    { privateState }: WitnessContext<any, ShadowSendPrivateState>
  ): [ShadowSendPrivateState, boolean] =>
    [privateState, privateState.isBlacklisted],

  getOfferId: (
    { privateState }: WitnessContext<any, ShadowSendPrivateState>
  ): [ShadowSendPrivateState, Uint8Array] =>
    [privateState, privateState.offerId],
};
