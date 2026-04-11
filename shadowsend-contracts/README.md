# 🛡️ ShadowSend Contracts

ZK-Compliance and verified state management for the ShadowSend ecosystem, written in **Compact**.

## 🧠 Core Circuits
- **`registerCompliance`**: Proves that a private transfer amount meets AML rules (e.g., <= 10,000) without disclosing the amount.
- **`complianceRecords`**: A shielded ledger mapping that stores verification status for anonymous identifiers.

## 🔨 Build Tools
- **Compiler**: `compact` (0.15+)
- **Deploy Script**: `tsx src/deploy.ts` (Midnight JS)

## 📦 Compilation
```bash
compact compile shadowsend.compact contracts/managed/shadowsend
```