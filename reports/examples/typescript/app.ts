import {RawReport, ReportsApi} from "@greenspark/reports";

async function createImpact() {
    try {
        const reportsApi = new ReportsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
        const {data}: RawReport = await reportsApi.fetchRawReport()
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

console.log(createImpact())