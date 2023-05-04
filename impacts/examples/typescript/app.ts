import {ImpactsApi, ImpactPurchaseTypeEnum} from "greenspark-impact-sdk";

async function createImpact() {
    try {
        const impactApi = new ImpactsApi({apiKey: 'Uc1Yy0Z5QQwKGnxC1NycnVx2ylY9edyIVZv6u2zq8WghIbtIIRmwH%2BkBJLX6t0ZHagWkRENq6uUDf%'})
        const response = await impactApi.impactsControllerCreateImpact({
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
        }, '64138f16f5d5fa2f1e6c4cef', '64138f16f5d5fa2f1e6c4cf0');
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

console.log(createImpact())