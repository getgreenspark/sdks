import {EmailApi} from "@greenspark/email";

async function createImpact() {
    try {
        const emailApi = new EmailApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
        const response = await emailApi.fetchTemplates()
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

console.log(createImpact())