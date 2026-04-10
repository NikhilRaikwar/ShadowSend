# 🌌 ShadowSend | Privacy Redefined

**ShadowSend** is a premium, privacy-preserving remittance and swap DApp built on the **Midnight Network**. It leverages Zero-Knowledge (ZK) technology to enable anonymous transfers, multi-recipient private distributions, and atomic swaps with built-in compliance logic.

![ShadowSend Hero](/frontend/public/shadowsend.png)

## 🎯 Features
- **Shielded Transfers**: 1:N private distributions where amounts and recipients are hidden.
- **Private Swaps**: P2P atomic swaps between native Midnight assets (tNIGHT, tDUST).
- **ZK-Compliance**: A custom Compact smart contract that generates regulatory proof tokens without disclosing user data.
- **Elite UI**: High-end, glassmorphic design optimized for both desktop and mobile.
- **Lace Integration**: Direct polling and balance tracking via the Midnight Lace wallet.

## 🏗️ Project Structure
- **/frontend**: Vite + React + Tailwind frontend with Midnight SDK integration.
- **/shadowsend-contracts**: Midnight Compact smart contracts and deployment infrastructure.

## 🚀 Quick Start

### 1. Compile Contracts
Ensure you have the `compact` toolchain installed (manually or via WSL).
```bash
cd shadowsend-contracts
compact compile shadowsend.compact contracts/managed/shadowsend
```

### 2. Launch UI
```bash
cd frontend
yarn install
yarn dev
```

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
