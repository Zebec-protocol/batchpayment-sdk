export interface BatchPayment {
    sender: string;
    amounts: number[];
    receivers: string[];
}

export interface ClaimPayment {
    sender: string;
    source: string;
    escrow: string;
}


export interface DepositVault {
    sender: string;
    vaultinitiator: string;
    amount: number;
}