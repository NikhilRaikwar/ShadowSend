import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getPrivateIdentifier(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getTransferAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getIsBlacklisted(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, boolean];
  getOfferId(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  register_compliance(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  perform_shielded_send(context: __compactRuntime.CircuitContext<PS>,
                        shieldedInput_0: { nonce: Uint8Array,
                                           color: Uint8Array,
                                           value: bigint,
                                           mt_index: bigint
                                         },
                        recipient_0: { bytes: Uint8Array },
                        value_0: bigint): __compactRuntime.CircuitResults<PS, { change: { is_some: boolean,
                                                                                          value: { nonce: Uint8Array,
                                                                                                   color: Uint8Array,
                                                                                                   value: bigint
                                                                                                 }
                                                                                        },
                                                                                sent: { nonce: Uint8Array,
                                                                                        color: Uint8Array,
                                                                                        value: bigint
                                                                                      }
                                                                              }>;
  deposit_shielded(context: __compactRuntime.CircuitContext<PS>,
                   coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint
                           }): __compactRuntime.CircuitResults<PS, []>;
  create_swap_offer(context: __compactRuntime.CircuitContext<PS>,
                    offerer_0: { bytes: Uint8Array },
                    assetIn_0: Uint8Array,
                    amountIn_0: bigint,
                    assetOut_0: Uint8Array,
                    amountOut_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancel_swap_offer(context: __compactRuntime.CircuitContext<PS>,
                    offerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settle_swap(context: __compactRuntime.CircuitContext<PS>,
              offerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  register_compliance(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  perform_shielded_send(context: __compactRuntime.CircuitContext<PS>,
                        shieldedInput_0: { nonce: Uint8Array,
                                           color: Uint8Array,
                                           value: bigint,
                                           mt_index: bigint
                                         },
                        recipient_0: { bytes: Uint8Array },
                        value_0: bigint): __compactRuntime.CircuitResults<PS, { change: { is_some: boolean,
                                                                                          value: { nonce: Uint8Array,
                                                                                                   color: Uint8Array,
                                                                                                   value: bigint
                                                                                                 }
                                                                                        },
                                                                                sent: { nonce: Uint8Array,
                                                                                        color: Uint8Array,
                                                                                        value: bigint
                                                                                      }
                                                                              }>;
  deposit_shielded(context: __compactRuntime.CircuitContext<PS>,
                   coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint
                           }): __compactRuntime.CircuitResults<PS, []>;
  create_swap_offer(context: __compactRuntime.CircuitContext<PS>,
                    offerer_0: { bytes: Uint8Array },
                    assetIn_0: Uint8Array,
                    amountIn_0: bigint,
                    assetOut_0: Uint8Array,
                    amountOut_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancel_swap_offer(context: __compactRuntime.CircuitContext<PS>,
                    offerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settle_swap(context: __compactRuntime.CircuitContext<PS>,
              offerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  register_compliance(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  perform_shielded_send(context: __compactRuntime.CircuitContext<PS>,
                        shieldedInput_0: { nonce: Uint8Array,
                                           color: Uint8Array,
                                           value: bigint,
                                           mt_index: bigint
                                         },
                        recipient_0: { bytes: Uint8Array },
                        value_0: bigint): __compactRuntime.CircuitResults<PS, { change: { is_some: boolean,
                                                                                          value: { nonce: Uint8Array,
                                                                                                   color: Uint8Array,
                                                                                                   value: bigint
                                                                                                 }
                                                                                        },
                                                                                sent: { nonce: Uint8Array,
                                                                                        color: Uint8Array,
                                                                                        value: bigint
                                                                                      }
                                                                              }>;
  deposit_shielded(context: __compactRuntime.CircuitContext<PS>,
                   coin_0: { nonce: Uint8Array, color: Uint8Array, value: bigint
                           }): __compactRuntime.CircuitResults<PS, []>;
  create_swap_offer(context: __compactRuntime.CircuitContext<PS>,
                    offerer_0: { bytes: Uint8Array },
                    assetIn_0: Uint8Array,
                    amountIn_0: bigint,
                    assetOut_0: Uint8Array,
                    amountOut_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancel_swap_offer(context: __compactRuntime.CircuitContext<PS>,
                    offerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settle_swap(context: __compactRuntime.CircuitContext<PS>,
              offerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  complianceRecords: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { isVerified: boolean, status: number };
    [Symbol.iterator](): Iterator<[Uint8Array, { isVerified: boolean, status: number }]>
  };
  activeSwaps: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { offerer: { bytes: Uint8Array },
                                 assetIn: Uint8Array,
                                 amountIn: bigint,
                                 assetOut: Uint8Array,
                                 amountOut: bigint,
                                 isActive: boolean
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { offerer: { bytes: Uint8Array },
  assetIn: Uint8Array,
  amountIn: bigint,
  assetOut: Uint8Array,
  amountOut: bigint,
  isActive: boolean
}]>
  };
  readonly totalShieldedSends: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
