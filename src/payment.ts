import { Commitment, Connection, ConnectionConfig, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { BATCH_PAYMENT_PROGRAM_ID, PREFIX } from "./constants";
import { BatchPayment, ClaimPayment,DepositVault} from './types';
import { initBatchPayment, claimPayment , depositVault } from './instructions';


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

        console.log("receiver keys mapping: ", receiverKeys)

        const ix = await initBatchPayment(
            senderAddress,
            paymentVaultAddress,
            escrow,
            receiverKeys,
            amounts,
            this._programId
        )

        console.log("transaction ix: ", ix);

        let tx = new Transaction().add(ix);

        
        const recentHash = await this._connection.getRecentBlockhash();
        
        try {
            tx.recentBlockhash = recentHash.blockhash;
            tx.feePayer = this.walletProvider.publicKey;
            tx.partialSign(escrow);
            
            console.log("transaction ix after adding properties: ", tx);
    
            const res = await this._signAndConfirm(tx);

            console.log("response from sign and confirm: ", res);
    
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

    async deposit(data: DepositVault): Promise<any> {
        const { sender,vaultinitiator,amount} = data;

        console.log("data to claim payment: ", data);

        const senderAddress = new PublicKey(sender);

        const vaultinitiatorpubkey = new PublicKey(vaultinitiator);

        const [paymentVaultAddress, _] = await this._findPaymentVaultAddress(vaultinitiatorpubkey);

        console.log("payment vault address: ", paymentVaultAddress.toBase58());

        const ix = await depositVault (
            senderAddress,
            vaultinitiatorpubkey,
            paymentVaultAddress,
            amount,
            this._programId
        )

        console.log("claim transaction instruction: ", ix);

        let tx = new Transaction().add({...ix});

        const recentHash = await this._connection.getRecentBlockhash();

        try {
            tx.recentBlockhash = recentHash.blockhash;
            tx.feePayer = new PublicKey(sender);

            console.log("transacion with properties: ", tx);
    
            const res = await this._signAndConfirm(tx);

            console.log("response from SignAndConfirm", res);
    
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

    async claim(data: ClaimPayment): Promise<any> {
        const { sender, source, escrow } = data;

        console.log("data to claim payment: ", data);

        const senderAddress = new PublicKey(sender);
        const escrowAddress = new PublicKey(escrow);
        const paymentSourceAddress = new PublicKey(source);

        const [paymentVaultAddress, _] = await this._findPaymentVaultAddress(senderAddress);

        console.log("payment vault address: ", paymentVaultAddress.toBase58());

        const ix = await claimPayment (
            paymentSourceAddress,
            senderAddress,
            escrowAddress,
            paymentVaultAddress,
            this._programId
        )

        console.log("claim transaction instruction: ", ix);

        let tx = new Transaction().add({...ix});

        const recentHash = await this._connection.getRecentBlockhash();

        try {
            tx.recentBlockhash = recentHash.blockhash;
            tx.feePayer = new PublicKey(source);

            console.log("transacion with properties: ", tx);
    
            const res = await this._signAndConfirm(tx);

            console.log("response from SignAndConfirm", res);
    
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
