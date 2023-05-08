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
import { ImpactPurchase } from './impact-purchase';
import { Metadata } from './metadata';
/**
 * 
 * @export
 * @interface RawReportRow
 */
export interface RawReportRow {
    /**
     * Creation date of the impact.
     * @type {string}
     * @memberof RawReportRow
     */
    createdAt: string;
    /**
     * Total amount of money spent on the impact.
     * @type {number}
     * @memberof RawReportRow
     */
    totalPrice: number;
    /**
     * The currency of the spent money on the impact.
     * @type {string}
     * @memberof RawReportRow
     */
    currency: string;
    /**
     * The name of the source associated with the impact.
     * @type {string}
     * @memberof RawReportRow
     */
    sourceName: string;
    /**
     * The id of the source associated with the impact.
     * @type {string}
     * @memberof RawReportRow
     */
    sourceId: string;
    /**
     * The name of the trigger associated with the impact.
     * @type {string}
     * @memberof RawReportRow
     */
    triggerName: string;
    /**
     * The id of the trigger associated with the impact.
     * @type {string}
     * @memberof RawReportRow
     */
    triggerId: string;
    /**
     * The impactPurchases array contains your spending on a specific purpose.
     * @type {Array<ImpactPurchase>}
     * @memberof RawReportRow
     */
    impactPurchases: Array<ImpactPurchase>;
    /**
     * In the metadata array you can store up to 10 key-value pairs. You can use them to associate arbitrary data with your impact.
     * @type {Array<Metadata>}
     * @memberof RawReportRow
     */
    metadata: Array<Metadata>;
}
