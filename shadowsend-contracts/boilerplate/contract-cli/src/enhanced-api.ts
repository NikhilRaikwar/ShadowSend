// Enhanced API wrapper for Shadowsend Contract
// Generated on: 2026-04-10T19:37:27.152Z
// Auto-generated from shadowsend.compact

import { type Logger } from 'pino';
import { ContractAnalyzer } from './contract-analyzer.js';
import { DynamicCLIGenerator } from './dynamic-cli-generator.js';
import * as originalApi from './api.js';

// Re-export all original API functions
export * from './api.js';

/**
 * Contract information interface
 */
export interface ContractInfo {
  contractName: string;
  functions: Array<{
    name: string;
    parameters: Array<{ name: string; type: string }>;
    returnType: string;
    readOnly: boolean;
    description: string;
  }>;
  ledgerState: Array<{ name: string; type: string }>;
  witnesses: Array<{
    name: string;
    ledgerType: string;
    privateType: string;
    returns: string[];
  }>;
}

/**
 * Enhanced API with dynamic contract analysis
 */
export class EnhancedContractAPI {
  private analyzer: ContractAnalyzer;
  private cliGenerator: DynamicCLIGenerator;
  private contractInfo: ContractInfo | null;

  constructor(logger: Logger) {
    this.analyzer = new ContractAnalyzer();
    this.cliGenerator = new DynamicCLIGenerator(logger);
    this.contractInfo = null;
  }

  async initialize(): Promise<ContractInfo> {
    try {
      const analysis = await this.analyzer.analyzeContract();
      await this.cliGenerator.initialize();
      
      // Convert ContractAnalysis to ContractInfo format
      this.contractInfo = {
        contractName: analysis.contractName,
        functions: analysis.functions.map(func => ({
          ...func,
          readOnly: this.analyzer.isReadOnlyFunction(func.name),
          description: func.description || `Execute ${func.name} function`
        })),
        ledgerState: Object.entries(analysis.ledgerState).map(([name, type]) => ({ name, type })),
        witnesses: analysis.witnesses.map(witness => ({
          name: witness.name,
          ledgerType: witness.ledgerType,
          privateType: witness.privateType,
          returns: witness.returns
        }))
      };
      
      return this.contractInfo;
    } catch (error) {
      throw new Error(`Failed to initialize enhanced API: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getContractInfo(): ContractInfo | null {
    return this.contractInfo;
  }

  generateMenuItems(): any[] {
    return this.cliGenerator.generateMenuItems();
  }

  generateMenuQuestion(menuItems: any[]): string {
    return this.cliGenerator.generateMenuQuestion(menuItems);
  }

  // Dynamic function mapping based on contract analysis
  /**
   * Execute register_compliance function
   */
  async register_compliance(...args: any[]): Promise<any> {
    return await (originalApi as any).register_compliance(...args);
  }
  /**
   * Execute perform_shielded_send function
   */
  async perform_shielded_send(...args: any[]): Promise<any> {
    return await (originalApi as any).perform_shielded_send(...args);
  }
  /**
   * Execute deposit_shielded function
   */
  async deposit_shielded(...args: any[]): Promise<any> {
    return await (originalApi as any).deposit_shielded(...args);
  }
  /**
   * Execute create_swap_offer function
   */
  async create_swap_offer(...args: any[]): Promise<any> {
    return await (originalApi as any).create_swap_offer(...args);
  }
  /**
   * Execute cancel_swap_offer function
   */
  async cancel_swap_offer(...args: any[]): Promise<any> {
    return await (originalApi as any).cancel_swap_offer(...args);
  }
  /**
   * Execute settle_swap function
   */
  async settle_swap(...args: any[]): Promise<any> {
    return await (originalApi as any).settle_swap(...args);
  }
}

// Export contract metadata for reference
export const CONTRACT_METADATA = {
  name: 'Shadowsend Contract',
  fileName: 'shadowsend.compact',
  generatedAt: '2026-04-10T19:37:27.152Z',
  functions: [
  {
    "name": "register_compliance",
    "parameters": [],
    "returnType": "[]",
    "readOnly": false
  },
  {
    "name": "perform_shielded_send",
    "parameters": [
      {
        "name": "shieldedInput",
        "type": "QualifiedShieldedCoinInfo"
      },
      {
        "name": "recipient",
        "type": "ZswapCoinPublicKey"
      },
      {
        "name": "value",
        "type": "Uint<128>"
      }
    ],
    "returnType": "ShieldedSendResult",
    "readOnly": true
  },
  {
    "name": "deposit_shielded",
    "parameters": [
      {
        "name": "coin",
        "type": "ShieldedCoinInfo"
      }
    ],
    "returnType": "[]",
    "readOnly": false
  },
  {
    "name": "create_swap_offer",
    "parameters": [
      {
        "name": "offerer",
        "type": "ZswapCoinPublicKey"
      },
      {
        "name": "assetIn",
        "type": "Bytes<32>"
      },
      {
        "name": "amountIn",
        "type": "Uint<128>"
      },
      {
        "name": "assetOut",
        "type": "Bytes<32>"
      },
      {
        "name": "amountOut",
        "type": "Uint<128>"
      }
    ],
    "returnType": "[]",
    "readOnly": false
  },
  {
    "name": "cancel_swap_offer",
    "parameters": [
      {
        "name": "offerId",
        "type": "Bytes<32>"
      }
    ],
    "returnType": "[]",
    "readOnly": false
  },
  {
    "name": "settle_swap",
    "parameters": [
      {
        "name": "offerId",
        "type": "Bytes<32>"
      }
    ],
    "returnType": "[]",
    "readOnly": false
  }
],
  ledgerState: [
  {
    "name": "complianceRecords",
    "type": "Map<Bytes<32>, ComplianceState>"
  },
  {
    "name": "activeSwaps",
    "type": "Map<Bytes<32>, SwapOffer>"
  },
  {
    "name": "totalShieldedSends",
    "type": "Uint<128>"
  }
],
  witnesses: []
} as const;
