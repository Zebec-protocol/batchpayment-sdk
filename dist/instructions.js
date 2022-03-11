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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimPayment = exports.initBatchPayment = void 0;
var web3_js_1 = require("@solana/web3.js");
var borsh_1 = require("borsh");
var schema_1 = require("./schema");
var initBatchPayment = function (sender, paymentVaultAddress, escrow, receiverKeys, amounts, numberOfKeys, programId) { return __awaiter(void 0, void 0, void 0, function () {
    var otherKeys, keys, ixData;
    return __generator(this, function (_a) {
        otherKeys = [];
        receiverKeys.map(function (rk) {
            otherKeys.push(rk);
        });
        keys = __spreadArray([
            { pubkey: new web3_js_1.PublicKey(sender), isSigner: true, isWritable: true },
            { pubkey: new web3_js_1.PublicKey(web3_js_1.SystemProgram.programId), isSigner: false, isWritable: false },
            { pubkey: new web3_js_1.PublicKey(paymentVaultAddress), isSigner: false, isWritable: true },
            { pubkey: escrow, isSigner: true, isWritable: true }
        ], otherKeys, true);
        ixData = {
            instruction: 0,
            number: numberOfKeys,
            amount: amounts
        };
        return [2 /*return*/, new web3_js_1.TransactionInstruction({
                keys: keys,
                programId: programId,
                data: Buffer.from((0, borsh_1.serialize)(schema_1.InitBatchPaymentSchema, new schema_1.InitBatchPayment(ixData)))
            })];
    });
}); };
exports.initBatchPayment = initBatchPayment;
var claimPayment = function (paymentSource, sender, escrow, paymentVaultAddress, programId) { return __awaiter(void 0, void 0, void 0, function () {
    var keys, ixData;
    return __generator(this, function (_a) {
        keys = [
            { pubkey: paymentSource, isSigner: true, isWritable: true },
            { pubkey: sender, isSigner: false, isWritable: true },
            { pubkey: escrow, isSigner: false, isWritable: true },
            { pubkey: paymentVaultAddress, isSigner: false, isWritable: true },
            { pubkey: web3_js_1.SystemProgram.programId, isSigner: false, isWritable: false }
        ];
        ixData = {
            instruction: 1
        };
        return [2 /*return*/, new web3_js_1.TransactionInstruction({
                keys: keys,
                programId: programId,
                data: Buffer.from((0, borsh_1.serialize)(schema_1.ClaimPaymentSchema, new schema_1.ClaimPayment(__assign({}, ixData))))
            })];
    });
}); };
exports.claimPayment = claimPayment;