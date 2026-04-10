# 🌌 ShadowSend | The Elite Privacy Layer for Midnight

**ShadowSend** is a next-generation private remittance and atomic swap platform built natively on the **Midnight Network**. 

> "Privacy by default, Compliance by design."

ShadowSend transforms how users interact with DeFi by providing a seamless, "WhatsApp-style" interface for confidential transfers and swaps, powered by state-of-the-art Zero-Knowledge proofs.

## 🏆 Hackathon Pitch (Finance & DeFi Track)
Most privacy solutions are bolted on top of public chains, leading to complex UX and high gas costs. **ShadowSend** leverages Midnight's native Zswap protocol and Compact smart contracts to deliver a "Privacy Cash" experience where:
- **Amounts are hidden** by default.
- **Recipients are anonymous** via the Shadow Layer.
- **Compliance is baked-in** via on-chain ZK verification tokens that verify identity without revealing data.

## 🚀 Key Features

### 1. 🛡️ Send Privately (Hero Feature)
A mobile-first, minimalist interface for 1:N shielded distributions. 
- **ZK Compliance**: Automatically proves AML verification (Amount <= 10,000) using the `disclose()` circuit. 
- **Privacy Meter**: Real-time visual feedback of the ZK protection status.

### 2. ⚡ Private Atomic Swaps
Confidential P2P trading between **tNIGHT** and **tDUST**.
- **Atomic Settlement**: Uses Midnight's `initSwap` orchestration to ensure trustless exchanges without identity exposure.

### 3. 📊 Shadow History & Dashboard
A data-sovereign dashboard where transaction metadata is encrypted and stored locally in **IndexedDB**. 
- **Zero Server Storage**: Your financial history never leaves your device. Only the user can view their decrypted shadow logs.

## 🏗️ Technical Architecture
- **Compact Contracts**: 6 custom ZK circuits (`registerCompliance`, `sendShielded`, `initiateSwap`, etc.).
- **Midnight SDK**: High-performance integration with the Lace Wallet + DApp Connector.
- **Proof Server**: Powered by Midnight's local proof generation to ensure private witnesses never leave the client.

## 🛠️ Setup & Deployment

### Compile Contract (WSL)
```bash
cd shadowsend-contracts
compactc contracts/src/shadowsend.compact contracts/managed/shadowsend
```

### Launch Frontend
```bash
cd frontend
yarn install
yarn dev --port 3001
```

## 📜 Roadmap
- [x] Multi-recipient Shielded Sending
- [x] On-chain ZK Compliance Circuits
- [x] IndexedDB Shadow History
- [ ] Cross-chain Shielded Bridge (Coming Soon)
- [ ] Dark Mode 2.0 (Neon Midnight)

---
*Built for the Midnight Network Hackathon 2026.*
