/* tslint:disable */
/* eslint-disable */
/**
 * Impact
 * Here you can find documentation and examples for Greenspark Impact API
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ImpactPurchaseDetail } from './impact-purchase-detail';
/**
 * 
 * @export
 * @interface BatchImpactPurchaseResponse
 */
export interface BatchImpactPurchaseResponse {
    /**
     * The id of the transaction associated with a single impact creation.
     * @type {string}
     * @memberof BatchImpactPurchaseResponse
     */
    transactionId: string;
    /**
     * The impactPurchases array contains details on a specific impact creation.
     * @type {Array<ImpactPurchaseDetail>}
     * @memberof BatchImpactPurchaseResponse
     */
    impactPurchases: Array<ImpactPurchaseDetail>;
}
