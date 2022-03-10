import { Commitment, Connection, ConnectionConfig, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { BATCH_PAYMENT_PROGRAM_ID, PREFIX } from "./constants";
import * as TYPES from './types';
import * as INSTRUCTIONS from './instructions';


export class Payment {
    protected _connection: Connection;
    protected _programId: PublicKey = new PublicKey(BATCH_PAYMENT_PROGRAM_ID);
    protected _commitment: Commitment | ConnectionConfig | undefined;
    protected walletProvider: any

    constructor (
        walletProvider: any,
        rpcUrl: string,
        commitment: Commitment | string
    ) {
        this.walletProvider = walletProvider
        this._connection = new Connection(rpcUrl, this._commitment);
        this._commitment = commitment as Commitment;
    }

    protected async _findPaymentVaultAddress(_sender: PublicKey): Promise<[PublicKey, number]> {
        return await PublicKey.findProgramAddress(
            [_sender.toBuffer(), Buffer.from(PREFIX)],
            this._programId
        )
    }

    protected async _signAndConfirm(tx: Transaction, commitment: Commitment | undefined='confirmed'): Promise<any> {
        const signed = await this.walletProvider.signTransaction(tx);
        const signature = await this._connection.sendRawTransaction(signed.serialize());
        await this._connection.confirmTransaction(signature, commitment);

        return {
            transactionHash: signature
        }
    }

    // Remove Number: is it Number of Receivers?
    async init(data: TYPES.BatchPayment): Promise<any> {
        const {sender, receivers, number, amounts} = data;
        const senderAddress = new PublicKey(sender);
        const [paymentVaultAddress, _] = await this._findPaymentVaultAddress(senderAddress);

        const escrow = new Keypair();

        const receiverKeys = receivers.map(receiver => {
            return {
                pubkey: new PublicKey(receiver),
                isSigner: false,
                isWritable: true
            }
        })

        const ix = await INSTRUCTIONS.initBatchPayment(
            senderAddress,
            paymentVaultAddress,
            escrow,
            receiverKeys,
            amounts,
            number,
            this._programId
        )

        let tx = new Transaction().add({...ix});

        const recentHash = await this._connection.getRecentBlockhash();

        try {
            tx.recentBlockhash = recentHash.blockhash;
            tx.feePayer = new PublicKey(sender);
            tx.partialSign(escrow);
    
            const res = await this._signAndConfirm(tx);
    
            return {
                status: "success",
                message: "transaction success",
                data: {
                    pda: escrow.publicKey.toBase58(), 
                    ...res
                }
            }
        } catch(e) {
            return {
                status: "error",
                message: e,
                data: null
            }
        }
    }

    async claim(data: TYPES.ClaimPayment): Promise<any> {
        const { sender, source, escrow } = data;

        const senderAddress = new PublicKey(sender);
        const escrowAddress = new PublicKey(escrow)
        const paymentSourceAddress = new PublicKey(source)

        const [paymentVaultAddress, _] = await this._findPaymentVaultAddress(senderAddress);

        const ix = await INSTRUCTIONS.claimPayment (
            paymentSourceAddress,
            senderAddress,
            escrowAddress,
            paymentVaultAddress,
            this._programId
        )

        let tx = new Transaction().add({...ix});

        const recentHash = await this._connection.getRecentBlockhash();

        try {
            tx.recentBlockhash = recentHash.blockhash;
            tx.feePayer = new PublicKey(sender);
    
            const res = await this._signAndConfirm(tx);
    
            return {
                status: "success",
                message: "transaction success",
                data: {
                    ...res
                }
            }
        } catch(e) {
            return {
                status: "error",
                message: e,
                data: null
            }
        }

    }
}
