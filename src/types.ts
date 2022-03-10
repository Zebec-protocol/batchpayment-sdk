export interface BatchPayment {
    sender: string;
    amounts: number[];
    number: number;
    receivers: string[];
}