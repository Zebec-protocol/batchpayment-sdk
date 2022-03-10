// base
class Payment {
    constructor(args: {}) {
        Object.keys(args).map((key) => {
            return (this[key] = args[key])
        });
    }
}

// data
export class Amount extends Payment {}
export class InitBatchPayment extends Payment {}
export class ClaimPayment extends Payment {}

// schema
export const InitBatchPaymentSchema = new Map([
    [
        InitBatchPayment,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["number", "u64"],
                ["amount", [Amount]]
            ]
        }
    ],
    [
        Amount,
        {
            kind: "struct",
            fields: [
                ["amount", "u64"]
            ]
        }
    ]
])

export const ClaimPaymentSchema = new Map([
    [
        ClaimPayment,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"]
            ]
        }
    ]
])