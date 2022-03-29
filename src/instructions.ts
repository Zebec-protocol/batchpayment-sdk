import { AccountMeta, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { serialize } from "borsh";
import { InitBatchPaymentSchema,  InitBatchPayment, ClaimPaymentSchema, ClaimPayment, Amount,DepositSchema,Deposit } from "./schema"

export const initBatchPayment = async (
    sender: PublicKey,
    paymentVaultAddress: PublicKey,
    escrow: Keypair,
    receiverKeys: AccountMeta[],
    amounts: number[],
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
        { pubkey: escrow.publicKey, isSigner: true, isWritable: true },
        ...otherKeys
    ]

    const amountKeys = []
    amounts.map(a => {
        amountKeys.push(new Amount({amount: a}))
    })

    const ixData = {
        instruction: 0,
        amount: amountKeys
    }
    
    return new TransactionInstruction({
        keys,
        programId,
        data: Buffer.from(
            serialize(InitBatchPaymentSchema, new InitBatchPayment({...ixData}))
        )
    })
}

export const depositVault = async (
    sender: PublicKey,
    vaultinitiator:PublicKey,
    paymentVaultAddress: PublicKey,
    amounts: number,
    programId: PublicKey,
): Promise<TransactionInstruction> => {

    

    const keys = [
        { pubkey: new PublicKey(sender), isSigner: true, isWritable: true },
        { pubkey: new PublicKey(vaultinitiator), isSigner: true, isWritable: true },
        { pubkey: new PublicKey(SystemProgram.programId), isSigner: false, isWritable: false },
        { pubkey: new PublicKey(paymentVaultAddress), isSigner: false, isWritable: true },
    ]

    

    const ixData = {
        instruction: 2,
        amount: (amounts*LAMPORTS_PER_SOL).toString(),
    }
    
    return new TransactionInstruction({
        keys,
        programId,
        data: Buffer.from(
            serialize(DepositSchema, new Deposit({...ixData}))
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
            serialize(ClaimPaymentSchema, new ClaimPayment({...ixData}))
        )
    })
}