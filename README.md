# 🌑 ShadowSend: Privacy-First DeFi on Midnight

[![Midnight Network](https://img.shields.io/badge/Network-Midnight%20Preprod-blueviolet?style=for-the-badge&logo=polkadot)](https://midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Shielding-Active-emerald?style=for-the-badge&logo=securityscorecard)](https://shadowsend.app)

**ShadowSend** is a next-generation privacy dApp built on the **Midnight Network**. It leverages Zero-Knowledge (ZK) proofs to enable anonymous asset transfers and atomic swaps, ensuring that your financial data remains your own business.

---

## 🚀 Key Features

- **🔒 Shielded Transfers**: Send tokens privately where recipient and amount are cryptographically hidden.
- **⚛️ Atomic Swaps**: Exchange assets privately without intermediaries using ZK intent-based swaps.
- **📊 Privacy Dashboard**: Real-time breakdown of your shielded vs. unshielded balances on Midnight Preprod.
- **⚡ Seamless Integration**: Directly powered by the **Midnight Lace DApp Connector**—no custom contract deployment needed for end-users.
- **🛰️ Snark-Powered Security**: Every transaction is verified via ZK-SNARKs before hitting the blockchain.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Blockchain** | Midnight Network (Preprod Testnet) |
| **Wallet** | Midnight Lace (Official DApp Connector) |
| **Zero-Knowledge** | Compact / ZK-SNARKs |
| **Frontend** | React, TypeScript, Tailwind CSS, Framer Motion |
| **Icons** | Lucide React |

---

## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/NikhilRaikwar/ShadowSend.git
   cd ShadowSend/frontend
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Required Environment**
   - Install the **Midnight Lace Wallet** extension.
   - Switch to **Midnight Preprod** network.
   - Ensure your **Midnight Indexer** and **Prover** services are running locally or pointed to preprod.

4. **Launch Application**
   ```bash
   yarn dev --port 3001
   ```

---

## 🛡️ Security First

ShadowSend never stores your private keys or seed phrases. All signing and ZK proof generation occur natively within the **Midnight Lace Wallet**, ensuring a non-custodial and trustless experience.

## 🤝 Project Status: Hackathon Submission

Built with ❤️ for the Midnight Network Hackathon. Our goal is to make privacy a default feature, not an afterthought, in the decentralized finance space.

---
© 2026 ShadowSend Team. Protected by Midnight ZK.
