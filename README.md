# 🌑 ShadowSend: Privacy-First DeFi on Midnight

[![Midnight Network](https://img.shields.io/badge/Network-Midnight%20Preprod-blueviolet?style=for-the-badge)](https://midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![ZK Powered](https://img.shields.io/badge/ZK-SNARK%20Powered-emerald?style=for-the-badge)](https://midnight.network)
[![Hackathon](https://img.shields.io/badge/Midnight-Hackathon%202026-blueviolet?style=for-the-badge)](https://midnight.network)

> **Making privacy the default standard in DeFi — not an optional feature.**

**ShadowSend** is a next-generation privacy dApp built on the **Midnight Network**. It leverages Zero-Knowledge (ZK) proofs to enable anonymous asset transfers and atomic swaps, ensuring that your financial data remains your own business — forever.

---

## 🎥 Demo & Submission

| Resource | Link |
| :--- | :--- |
| 🎬 **Demo Video** | *(Submit link)* |
| 📊 **Presentation (PPT)** | *(Submit link)* |
| 🐙 **GitHub** | [NikhilRaikwar/ShadowSend](https://github.com/NikhilRaikwar/ShadowSend) |
| 🌐 **Live Demo** | *(Deployed URL)* |

---

## 🚀 Key Features

### 🔒 Shielded Transfers
Send tokens privately where **both the recipient address AND the amount are cryptographically hidden** via ZK-SNARKs. Supports:
- Shielded → Shielded (`mn_shield-addr_preprod` → `mn_shield-addr_preprod`)
- Unshielded → Shielded (shield your assets)
- Multi-recipient batching in a single transaction

### ⚛️ Atomic Private Swaps
Exchange assets privately without intermediaries using **ZK intent-based atomic swaps**:
- Zero front-running risk — trade details inside a Snark
- Anti-MEV by design
- `makeIntent()` broadcasts encrypted swap intents
- Atomic settlement ensures either full completion or rollback

### 📊 Privacy Dashboard
Real-time breakdown of your balances and activity:
- **Private Pool** (shielded tNIGHT) vs **Public Pool** (unshielded tNIGHT)
- Live transaction history synced from the Midnight Indexer
- Pending tx detection with on-chain confirmation tracking
- Auto-refresh every 10 seconds

### 🛡️ Dual Privacy Modes
Toggle per-transaction between:
- **Shielding Active** — amounts and recipients cryptographically hidden
- **Public Mode** — standard unshielded transaction

### 🌉 Cross-Chain Bridge *(Coming Soon)*
Secure, private bridging from Ethereum, Polygon, Arbitrum, Optimism → Midnight Network.

---

## 🏗️ Architecture

```
User (Browser)
    │
    ├─→ ShadowSend UI (React + TypeScript)
    │       ├─ SendPrivatelyTab — multi-recipient shielded sends
    │       ├─ SwapTab — ZK intent-based atomic swaps
    │       └─ PrivacyDashboard — live balance + tx feed
    │
    ├─→ Midnight Lace Wallet (DApp Connector)
    │       ├─ getShieldedAddresses()
    │       ├─ makeTransfer([{kind, type, value, recipient}])
    │       ├─ makeIntent(inputs, outputs)
    │       └─ submitTransaction(tx)  ← ZK proof generated here
    │
    └─→ Midnight Network (Preprod)
            ├─ Blockchain (shielded transactions)
            ├─ Indexer API (https://indexer.preprod.midnight.network)
            └─ Explorer (https://explorer.preprod.midnight.network)
```

### ZK Transaction Flow

```
1. User fills form  →  2. Wallet builds SNARK  →  3. Tx submitted  →  4. Confirmed on-chain
   (address + amount)     (all data encrypted)      (opaque ZK proof)   (balance updated)
```

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Blockchain** | Midnight Network (Preprod Testnet) |
| **Wallet Connector** | Midnight Lace (Official DApp Connector) |
| **Zero-Knowledge** | Compact / ZK-SNARKs |
| **Frontend Framework** | React 18 + TypeScript |
| **Styling** | Tailwind CSS + Custom Glass UI |
| **Animations** | Framer Motion |
| **State Management** | React Context API |
| **Data Fetching** | TanStack Query |
| **Notifications** | Sonner |
| **Icons** | Lucide React |
| **Build Tool** | Vite |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Yarn
- **[Midnight Lace Wallet](https://midnight.network)** browser extension
- Midnight Preprod testnet configured in wallet

### 1. Clone the Repository
```bash
git clone https://github.com/NikhilRaikwar/ShadowSend.git
cd ShadowSend/frontend
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Environment Setup

Ensure your local environment is configured:
- ✅ Midnight Lace Wallet extension installed
- ✅ Wallet switched to **Midnight Preprod** network
- ✅ Midnight Indexer accessible (`https://indexer.preprod.midnight.network/api/v3/graphql`)
- ✅ Prover server running at `http://localhost:6300` (optional, for local proving)

### 4. Launch Application
```bash
yarn dev --port 3001
```

Open `http://localhost:3001` in your browser.

---

## 🔐 How to Use

### Send Privately

1. **Connect Wallet** — Click "Connect Wallet" → Midnight Lace opens → Approve on Preprod
2. **Enter recipient** — Use a valid Midnight Preprod address:
   - Shielded: `mn_shield-addr_preprod1...`
   - Unshielded: `mn_addr_preprod1...`
3. **Enter amount** — In tNIGHT (supports decimals)
4. **Enable Shielding** — Toggle ON for private transfer (default: ON)
5. **Click "Send Shielded"** — Wallet generates ZK proof, tx submitted
6. **Confirm in wallet** — Approve the shielded transaction

### Swap Privately

1. Connect wallet
2. Enter swap amount in "You Send"
3. Click **"Swap Privately"**
4. Wallet broadcasts a ZK intent — atomic swap executes privately

### Multi-Recipient Batch Send

1. Click **+** to add recipients
2. Enter unique address + amount per recipient
3. Single shielded transaction covers all recipients

---

## 🛡️ Security Design

| Property | Detail |
| :--- | :--- |
| **Non-Custodial** | Private keys never leave Midnight Lace wallet |
| **ZK Proof Generation** | Happens client-side inside the wallet |
| **No Data Storage** | ShadowSend stores zero user data |
| **Address Validation** | Strict prefix validation (`mn_addr_preprod` / `mn_shield-addr_preprod`) |
| **Amount Precision** | Converted to microunits (×1,000,000) to avoid precision loss |
| **Open Source** | Fully auditable codebase |

---

## 🧪 Smart Contract / Native Asset

ShadowSend uses the **native tNIGHT asset** on Midnight Preprod:

```
Native Asset ID: 0000000000000000000000000000000000000000000000000000000000000000
```

No custom contract deployment required for end-users. The Midnight Lace DApp Connector handles all ZK proof generation and transaction construction natively.

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SendPrivatelyTab.tsx    # Multi-recipient shielded send
│   │   ├── SwapTab.tsx             # Atomic private swap
│   │   ├── PrivacyDashboard.tsx    # Balance + transaction feed
│   │   ├── WalletConnectButton.tsx # Lace wallet integration
│   │   ├── TokenSelector.tsx       # tNIGHT / tDUST picker
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── contexts/
│   │   └── MidnightWalletContext.tsx  # Wallet state + API
│   ├── pages/
│   │   ├── Index.tsx               # Main dApp page
│   │   └── NotFound.tsx
│   └── index.css                   # Glass UI design system
└── public/
    └── shadowsend.png              # Ghost logo
```

---

## 🤝 Hackathon Submission

Built with ❤️ for the **Midnight Network Hackathon 2026**.

**Team:** ShadowSend Team  
**Builder:** [@NikhilRaikwarr](https://x.com/NikhilRaikwarr)

### What we built:
- ✅ Privacy-first token transfers with ZK-SNARK shielding
- ✅ Atomic private swaps via ZK intents
- ✅ Real-time privacy dashboard with live blockchain sync
- ✅ Full Midnight Lace DApp Connector integration
- ✅ Multi-recipient batch shielded sends
- ✅ Beautiful, production-grade UI with dark glass aesthetic

### Why it matters:
DeFi today is entirely transparent — anyone can see your wallet balance, transactions, and trading patterns. ShadowSend proves that **financial privacy is achievable on a public blockchain** using zero-knowledge cryptography. Midnight Network makes this possible. We made it accessible.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*© 2026 ShadowSend Team. Protected by Midnight ZK.*
