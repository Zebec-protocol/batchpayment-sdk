export interface BatchPayment {
    sender: string;
    amounts: number[];
    number: number;
    receivers: string[];
}

export interface ClaimPayment {
    sender: string;
    source: string;
    escrow: string;
}