export type BatchPayment =  {
    sender: string;
    amounts: number[];
    receivers: string[];
}

export type ClaimPayment =  {
    sender: string;
    source: string;
    paymentVaultAddress:string;
    escrow: string;
}


export type DepositVault =  {
    sender: string;
    vaultInitiator: string;
    paymentVaultAddress:string;
    amount: number;
}