"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("./constants");
var instructions_1 = require("./instructions");
var buffer_1 = require("buffer");
var Payment = /** @class */ (function () {
    function Payment(walletProvider, rpcUrl, commitment) {
        this._programId = new web3_js_1.PublicKey(constants_1.BATCH_PAYMENT_PROGRAM_ID);
        this.walletProvider = walletProvider;
        this._connection = new web3_js_1.Connection(rpcUrl, this._commitment);
        this._commitment = commitment;
    }
    Payment.prototype._findPaymentVaultAddress = function (_sender) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([_sender.toBuffer(), constants_1.RANDOM.toBuffer(), buffer_1.Buffer.from(constants_1.PREFIX)], this._programId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Payment.prototype._signAndConfirm = function (tx, commitment) {
        if (commitment === void 0) { commitment = 'confirmed'; }
        return __awaiter(this, void 0, void 0, function () {
            var signed, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.walletProvider.signTransaction(tx)];
                    case 1:
                        signed = _a.sent();
                        return [4 /*yield*/, this._connection.sendRawTransaction(signed.serialize())];
                    case 2:
                        signature = _a.sent();
                        return [4 /*yield*/, this._connection.confirmTransaction(signature, commitment)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                transactionHash: signature
                            }];
                }
            });
        });
    };
    Payment.prototype.init = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var sender, receivers, amounts, senderAddress, _a, paymentVaultAddress, _, escrow, receiverKeys, ix, tx, recentHash, res, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sender = data.sender, receivers = data.receivers, amounts = data.amounts;
                        console.log("init batch payment data: ", data);
                        senderAddress = new web3_js_1.PublicKey(sender);
                        return [4 /*yield*/, this._findPaymentVaultAddress(senderAddress)];
                    case 1:
                        _a = _b.sent(), paymentVaultAddress = _a[0], _ = _a[1];
                        console.log("vault Address", paymentVaultAddress.toBase58());
                        escrow = new web3_js_1.Keypair();
                        receiverKeys = receivers.map(function (receiver) {
                            return {
                                pubkey: new web3_js_1.PublicKey(receiver),
                                isSigner: false,
                                isWritable: true
                            };
                        });
                        return [4 /*yield*/, (0, instructions_1.initBatchPayment)(senderAddress, paymentVaultAddress, escrow, receiverKeys, amounts, this._programId)];
                    case 2:
                        ix = _b.sent();
                        tx = new web3_js_1.Transaction().add(ix);
                        return [4 /*yield*/, this._connection.getRecentBlockhash()];
                    case 3:
                        recentHash = _b.sent();
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        tx.recentBlockhash = recentHash.blockhash;
                        tx.feePayer = this.walletProvider.publicKey;
                        tx.partialSign(escrow);
                        return [4 /*yield*/, this._signAndConfirm(tx)];
                    case 5:
                        res = _b.sent();
                        return [2 /*return*/, {
                                status: "success",
                                message: "transaction success",
                                data: __assign({ pda: escrow.publicKey.toBase58(), paymentVaultAddress: paymentVaultAddress }, res)
                            }];
                    case 6:
                        e_1 = _b.sent();
                        return [2 /*return*/, {
                                status: "error",
                                message: e_1,
                                data: null
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Payment.prototype.deposit = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var sender, vaultInitiator, paymentVaultAddress, amount, senderAddress, vaultInitiatorAddress, ix, tx, recentHash, res, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sender = data.sender, vaultInitiator = data.vaultInitiator, paymentVaultAddress = data.paymentVaultAddress, amount = data.amount;
                        console.log("data to deposit: ", data);
                        senderAddress = new web3_js_1.PublicKey(sender);
                        vaultInitiatorAddress = new web3_js_1.PublicKey(vaultInitiator);
                        return [4 /*yield*/, (0, instructions_1.depositVault)(senderAddress, vaultInitiatorAddress, paymentVaultAddress, amount, this._programId)];
                    case 1:
                        ix = _a.sent();
                        tx = new web3_js_1.Transaction().add(__assign({}, ix));
                        return [4 /*yield*/, this._connection.getRecentBlockhash()];
                    case 2:
                        recentHash = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        tx.recentBlockhash = recentHash.blockhash;
                        tx.feePayer = new web3_js_1.PublicKey(sender);
                        return [4 /*yield*/, this._signAndConfirm(tx)];
                    case 4:
                        res = _a.sent();
                        return [2 /*return*/, {
                                status: "success",
                                message: "deposit successful",
                                data: __assign({}, res)
                            }];
                    case 5:
                        e_2 = _a.sent();
                        return [2 /*return*/, {
                                status: "error",
                                message: e_2,
                                data: null
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Payment.prototype.claim = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var sender, source, paymentVaultAddress, escrow, senderAddress, escrowAddress, paymentSourceAddress, ix, tx, recentHash, res, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sender = data.sender, source = data.source, paymentVaultAddress = data.paymentVaultAddress, escrow = data.escrow;
                        console.log("data to claim payment: ", data);
                        senderAddress = new web3_js_1.PublicKey(sender);
                        escrowAddress = new web3_js_1.PublicKey(escrow);
                        paymentSourceAddress = new web3_js_1.PublicKey(source);
                        return [4 /*yield*/, (0, instructions_1.claimPayment)(paymentSourceAddress, senderAddress, escrowAddress, paymentVaultAddress, this._programId)];
                    case 1:
                        ix = _a.sent();
                        tx = new web3_js_1.Transaction().add(__assign({}, ix));
                        return [4 /*yield*/, this._connection.getRecentBlockhash()];
                    case 2:
                        recentHash = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        tx.recentBlockhash = recentHash.blockhash;
                        tx.feePayer = new web3_js_1.PublicKey(source);
                        return [4 /*yield*/, this._signAndConfirm(tx)];
                    case 4:
                        res = _a.sent();
                        return [2 /*return*/, {
                                status: "success",
                                message: "claim success",
                                data: __assign({}, res)
                            }];
                    case 5:
                        e_3 = _a.sent();
                        return [2 /*return*/, {
                                status: "error",
                                message: e_3,
                                data: null
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Payment;
}());
exports.Payment = Payment;
