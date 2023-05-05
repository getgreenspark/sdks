"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const impacts_1 = require("@greenspark/impacts");
function createImpact() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const impactApi = new impacts_1.ImpactsApi({ basePath: "https://sandbox.getgreenspark.com", apiKey: "Uc1Yy0Z5QQwKGnxC1NycnVx2ylY9edyIVZv6u2zq8WghIbtIIRmwH%2BkBJLX6t0ZHagWkRENq6uUDf%" });
            const response = yield impactApi.createTailoredImpact({
                "impactPurchases": [
                    {
                        "amount": 1,
                        "type": impacts_1.ImpactPurchaseTypeEnum.Trees
                    }
                ],
                "metadata": [
                    {
                        "key": "client",
                        "value": "sdk"
                    }
                ]
            });
            console.log(response);
        }
        catch (error) {
            console.error(error);
        }
    });
}
console.log(createImpact());
