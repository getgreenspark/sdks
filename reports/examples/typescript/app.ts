import {ReportsApi} from "@greenspark/reports";

async function createImpact() {
    try {
        const reportsApi = new ReportsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
        const response = await reportsApi.fetchRawReport()
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

console.log(createImpact())