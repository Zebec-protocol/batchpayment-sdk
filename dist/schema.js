"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositSchema = exports.ClaimPaymentSchema = exports.InitBatchPaymentSchema = exports.Deposit = exports.ClaimPayment = exports.InitBatchPayment = exports.Amount = void 0;
// base
var Payment = /** @class */ (function () {
    function Payment(args) {
        var _this = this;
        Object.keys(args).map(function (key) {
            return (_this[key] = args[key]);
        });
    }
    return Payment;
}());
// data
var Amount = /** @class */ (function (_super) {
    __extends(Amount, _super);
    function Amount() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Amount;
}(Payment));
exports.Amount = Amount;
var InitBatchPayment = /** @class */ (function (_super) {
    __extends(InitBatchPayment, _super);
    function InitBatchPayment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InitBatchPayment;
}(Payment));
exports.InitBatchPayment = InitBatchPayment;
var ClaimPayment = /** @class */ (function (_super) {
    __extends(ClaimPayment, _super);
    function ClaimPayment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ClaimPayment;
}(Payment));
exports.ClaimPayment = ClaimPayment;
var Deposit = /** @class */ (function (_super) {
    __extends(Deposit, _super);
    function Deposit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Deposit;
}(Payment));
exports.Deposit = Deposit;
// schema
exports.InitBatchPaymentSchema = new Map([
    [
        InitBatchPayment,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["amount", [Amount]]
            ]
        }
    ],
    [
        Amount,
        {
            kind: "struct",
            fields: [
                ["amount", "u64"]
            ]
        }
    ]
]);
exports.ClaimPaymentSchema = new Map([
    [
        ClaimPayment,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"]
            ]
        }
    ]
]);
exports.DepositSchema = new Map([
    [
        Deposit,
        {
            kind: "struct",
            fields: [
                ["instruction", "u8"],
                ["amount", "u64"]
            ]
        }
    ]
]);
