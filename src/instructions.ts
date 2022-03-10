import { AccountMeta, Keypair, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { serialize } from "borsh";
import * as SCHEMA from "./schema"

export const initBatchPayment = async (
    sender: PublicKey,
    paymentVaultAddress: PublicKey,
    escrow: Keypair,
    receiverKeys: AccountMeta[],
    amounts: number[],
    numberOfKeys: number,
    programId: PublicKey,

): Promise<TransactionInstruction> => {

    const otherKeys = [];

    receiverKeys.map((rk: AccountMeta) => {
        otherKeys.push(rk);
    })

    const keys = [
        { pubkey: new PublicKey(sender), isSigner: true, isWritable: true },
        { pubkey: new PublicKey(SystemProgram.programId), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(paymentVaultAddress), isSigner: false, isWritable: true },
        { pubkey: escrow, isSigner: true, isWritable: true },
        ...otherKeys
    ]

    const ixData = {
        instruction: 0,
        number: numberOfKeys,
        amount: amounts
    }
    return new TransactionInstruction({
        keys,
        programId,
        data: Buffer.from(
            serialize(SCHEMA.InitBatchPaymentSchema, new SCHEMA.InitBatchPayment(ixData))
        )
    })
}

export const claimPayment = async (
    paymentSource: PublicKey,
    sender: PublicKey,
    escrow: PublicKey,
    paymentVaultAddress: PublicKey,
    programId: PublicKey
): Promise<TransactionInstruction> => {

    const keys = [
        { pubkey: paymentSource, isSigner: true, isWritable: true },
        { pubkey: sender, isSigner: false, isWritable: true },
        { pubkey: escrow, isSigner: false, isWritable: true },
        { pubkey: paymentVaultAddress, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ]

    const ixData = {
        instruction: 1
    }

    return new TransactionInstruction({
        keys,
        programId,
        data: Buffer.from(
            serialize(SCHEMA.ClaimPaymentSchema, new SCHEMA.ClaimPayment({...ixData}))
        )
    })
}