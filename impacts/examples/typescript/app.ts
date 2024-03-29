import {ImpactsApi, ImpactPurchaseTypeEnum} from "@greenspark/impacts";
import {AxiosResponse} from "axios";

async function createImpact() {
    try {
        const impactApi = new ImpactsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
        const response: AxiosResponse<void> = await impactApi.createTailoredImpact({
            "impactPurchases": [
                {
                    "amount": 1,
                    "type": ImpactPurchaseTypeEnum.Trees
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
    } catch (error) {
        console.error(error);
    }
}

console.log(createImpact())