import {EmailApi, NotificationTemplateResponseDto} from "@greenspark/email";

async function createImpact() {
    try {
        const emailApi = new EmailApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
        const {data} : Array<NotificationTemplateResponseDto> = await emailApi.fetchTemplates()
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

console.log(createImpact())