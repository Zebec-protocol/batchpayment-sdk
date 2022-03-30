"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RANDOM = exports.PREFIX = exports.BATCH_PAYMENT_PROGRAM_ID = void 0;
var web3_js_1 = require("@solana/web3.js");
exports.BATCH_PAYMENT_PROGRAM_ID = "HQC8Ug9qbmKwbb5L5tcVMwXC3unUonSnMBg9PgfcToDu";
exports.PREFIX = "batchv2";
exports.RANDOM = new web3_js_1.Keypair().publicKey;
