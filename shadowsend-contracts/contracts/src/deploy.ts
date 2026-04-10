import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/shadowsend/index.cjs';
import { witnesses } from './witnesses.js';

export type ShadowSendProviders = {
  privateStateProvider: any;
  publicDataProvider: any;
  zkConfigProvider: any;
  proofProvider: any;
  walletProvider: any;
  midnightProvider: any;
};

export const deployShadowSend = async (providers: ShadowSendProviders) => {
  return await deployContract(providers, {
    contract: Contract,
    witnesses,
    initialPrivateState: {},
    privateStateId: 'shadowsend-state',
  });
};

export const joinShadowSend = async (
  providers: ShadowSendProviders,
  contractAddress: string
) => {
  return await findDeployedContract(providers, {
    contractAddress,
    contract: Contract,
    witnesses,
    privateStateId: 'shadowsend-state',
  });
};
