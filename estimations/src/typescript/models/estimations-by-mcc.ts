/* tslint:disable */
/* eslint-disable */
/**
 * Estimations
 * Here you can find documentation and examples for Greenspark Estimations API
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 
 * @export
 * @interface EstimationsByMCC
 */
export interface EstimationsByMCC {
    /**
     * Price of purchase.
     * @type {number}
     * @memberof EstimationsByMCC
     */
    price: number;
    /**
     * [Merchant Category Code](https://usa.visa.com/content/dam/VCOM/download/merchants/visa-merchant-data-standards-manual.pdf) of Merchant.
     * @type {string}
     * @memberof EstimationsByMCC
     */
    mcc: string;
    /**
     * ISO Currency Code of Purchase.
     * @type {string}
     * @memberof EstimationsByMCC
     */
    currencyISO: string;
    /**
     * Name of Merchant.
     * @type {string}
     * @memberof EstimationsByMCC
     */
    merchant?: string;
}