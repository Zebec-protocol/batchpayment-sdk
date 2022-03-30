## Batch Payment SDK

<hr />

### Initiate Batch Payment

```typescript
const payment = new Payment(walletProvider, rpcUrl, commitment?);

const response = await payment.init(
    {
        sender: "wallet_address",
        amounts: [1, 2],
        receivers: ["receiver_bob_address, receiver_john_address"]
    }
)

// need to save returned escrow
```

### Deposit

```typescript
const payment = new Payment(walletProvider, rpcUrl, commitment?);

const response = await payment.deposit(
    {
        source: window.solana.publicKey.toString(),
        sender: "J75jd3kjsABQSDrEdywcyhmbq8eHDowfW9xtEWsVALy9", //vault owner
        escrow: "Ga7dqnDjApC15eCwgdk4iD4NHDerksKd9NDxxmQARZwo",
        vault: "BLq2x18dYCio2UtfTPL1RoDGHhaE1vmCcrz1j8X48MZ7",
    }
)
```

### Claim Payment

```typescript
const payment = new Payment(walletProvider, rpcUrl, commitment?);

const response = await payment.claim(
    {
        sender: "wallet address", 
        source: "wallet address", 
        escrow: "wallet address"
    }
)
```
