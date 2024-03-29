/* tslint:disable */
/* eslint-disable */
/**
 * Reporting
 * Here you can find documentation and examples for Greenspark Reporting API
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ImpactPurchaseWithPrice } from './impact-purchase-with-price';
import { Metadata } from './metadata';
/**
 * 
 * @export
 * @interface RawReportRowV2
 */
export interface RawReportRowV2 {
    /**
     * ID of the impact.
     * @type {string}
     * @memberof RawReportRowV2
     */
    id: string;
    /**
     * Creation date of the impact.
     * @type {string}
     * @memberof RawReportRowV2
     */
    createdAt: string;
    /**
     * Total amount of money spent on the impact.
     * @type {number}
     * @memberof RawReportRowV2
     */
    totalPrice: number;
    /**
     * The currency of the spent money on the impact.
     * @type {string}
     * @memberof RawReportRowV2
     */
    currency: string;
    /**
     * The name of the source associated with the impact.
     * @type {string}
     * @memberof RawReportRowV2
     */
    sourceName: string;
    /**
     * The id of the source associated with the impact.
     * @type {string}
     * @memberof RawReportRowV2
     */
    sourceId: string;
    /**
     * The name of the trigger associated with the impact.
     * @type {string}
     * @memberof RawReportRowV2
     */
    triggerName: string;
    /**
     * The id of the trigger associated with the impact.
     * @type {string}
     * @memberof RawReportRowV2
     */
    triggerId: string;
    /**
     * The impactPurchases array contains your spending on a specific purpose.
     * @type {Array<ImpactPurchaseWithPrice>}
     * @memberof RawReportRowV2
     */
    impactPurchases: Array<ImpactPurchaseWithPrice>;
    /**
     * In the metadata array you can store up to 10 key-value pairs. You can use them to associate arbitrary data with your impact.
     * @type {Array<Metadata>}
     * @memberof RawReportRowV2
     */
    metadata: Array<Metadata>;
}
