import { Commitment, Connection, ConnectionConfig, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { BATCH_PAYMENT_PROGRAM_ID, PREFIX, RANDOM } from "./constants";
import { BatchPayment, ClaimPayment, DepositVault } from './types';
import { initBatchPayment, claimPayment, depositVault } from './instructions';
import { Buffer } from 'buffer';

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
            [_sender.toBuffer(),RANDOM.toBuffer(),Buffer.from(PREFIX)],
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

    async init(data: BatchPayment): Promise<any> {
        const {sender, receivers, amounts} = data;
        console.log("init batch payment data: ", data);

        const senderAddress = new PublicKey(sender);
        const [paymentVaultAddress, _] = await this._findPaymentVaultAddress(senderAddress);

        console.log("vault Address", paymentVaultAddress.toBase58())

        const escrow = new Keypair();

        const receiverKeys = receivers.map(receiver => {
            return {
                pubkey: new PublicKey(receiver),
                isSigner: false,
                isWritable: true
            }
        })

        const ix = await initBatchPayment(
            senderAddress,
            paymentVaultAddress,
            escrow,
            receiverKeys,
            amounts,
            this._programId
        )

        let tx = new Transaction().add(ix);

        
        const recentHash = await this._connection.getRecentBlockhash();
        
        try {
            tx.recentBlockhash = recentHash.blockhash;
            tx.feePayer = this.walletProvider.publicKey;
            tx.partialSign(escrow);
    
            const res = await this._signAndConfirm(tx);
    
            return {
                status: "success",
                message: "transaction success",
                data: {
                    pda: escrow.publicKey.toBase58(), 
                    paymentVaultAddress:paymentVaultAddress,
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

    async deposit(data: DepositVault): Promise<any> {
        const { sender, vaultInitiator,paymentVaultAddress,amount} = data;

        console.log("data to deposit: ", data);

        const senderAddress = new PublicKey(sender);

        const vaultInitiatorAddress = new PublicKey(vaultInitiator);

        const ix = await depositVault(
            senderAddress,
            vaultInitiatorAddress,
            paymentVaultAddress,
            amount,
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
                message: "deposit successful",
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

    async claim(data: ClaimPayment): Promise<any> {
        const { sender, source,paymentVaultAddress,escrow } = data;

        console.log("data to claim payment: ", data);

        const senderAddress = new PublicKey(sender);
        const escrowAddress = new PublicKey(escrow);
        const paymentSourceAddress = new PublicKey(source);

        const ix = await claimPayment (
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
            tx.feePayer = new PublicKey(source);
    
            const res = await this._signAndConfirm(tx);
    
            return {
                status: "success",
                message: "claim success",
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
