import {
    Estimation,
    EstimationsApi,
    EstimationsByMCCRequestBodyGeoEnum,
    EstimationsByMCCRequestBodyUserTypeEnum
} from "@greenspark/estimations";

async function createImpact() {
    try {
        const estimationsApi = new EstimationsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
        const {data}: Estimation = await estimationsApi.fetchCarbonEstimateOfATransactionByMCC({
            "price": 1000,
            "mcc": "5411",
            "currencyISO": "EUR",
            "merchant": "Superstore",
            "geo": EstimationsByMCCRequestBodyGeoEnum.EUUK,
            "userType": EstimationsByMCCRequestBodyUserTypeEnum.PERSONAL,
            "metadata": [
                {
                    "key": "customerId",
                    "value": "743ce227-22ef-4c6e-9c06-725f97b99690"
                }
            ]
        })
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

console.log(createImpact())