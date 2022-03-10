## Batch Payment SDK

<hr />

### Initiate Batch Payment

```typescript
const payment = new Payment(walletProvider, rpcUrl, commitment?);

const response = await payment.init(
    {
        sender: "wallet_address",
        amounts: [1, 2],
        number: 2,  // number of receivers
        receivers: ["receiver_bob_address, receiver_john_address"]
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