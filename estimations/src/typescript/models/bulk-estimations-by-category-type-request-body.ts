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
import { EstimationsByCategoryType } from './estimations-by-category-type';
import { Metadata } from './metadata';
/**
 * 
 * @export
 * @interface BulkEstimationsByCategoryTypeRequestBody
 */
export interface BulkEstimationsByCategoryTypeRequestBody {
    /**
     * Indicates the specific country that should be used for the CO2 emissions factors.
     * @type {string}
     * @memberof BulkEstimationsByCategoryTypeRequestBody
     */
    geo?: BulkEstimationsByCategoryTypeRequestBodyGeoEnum;
    /**
     * Indicates whether the API should use emissions factors for people or businesses (Either: \"PERSONAL\"(default), \"BUSINESS\")
     * @type {string}
     * @memberof BulkEstimationsByCategoryTypeRequestBody
     */
    userType?: BulkEstimationsByCategoryTypeRequestBodyUserTypeEnum;
    /**
     * Array of transactions.
     * @type {Array<EstimationsByCategoryType>}
     * @memberof BulkEstimationsByCategoryTypeRequestBody
     */
    transactions: Array<EstimationsByCategoryType>;
    /**
     * In the metadata array you can store up to 10 key-value pairs. You can use them to associate arbitrary data with your estimation.
     * @type {Array<Metadata>}
     * @memberof BulkEstimationsByCategoryTypeRequestBody
     */
    metadata?: Array<Metadata>;
}

/**
    * @export
    * @enum {string}
    */
export enum BulkEstimationsByCategoryTypeRequestBodyGeoEnum {
    USA = 'USA',
    EUUK = 'EU/UK',
    GB = 'GB',
    BG = 'BG',
    AT = 'AT',
    AU = 'AU',
    BE = 'BE',
    BR = 'BR',
    CA = 'CA',
    CH = 'CH',
    CN = 'CN',
    CZ = 'CZ',
    DE = 'DE',
    DK = 'DK',
    ES = 'ES',
    FR = 'FR',
    GR = 'GR',
    HR = 'HR',
    HU = 'HU',
    IT = 'IT',
    JP = 'JP',
    KR = 'KR',
    LT = 'LT',
    LV = 'LV',
    MX = 'MX',
    NL = 'NL',
    NO = 'NO',
    PL = 'PL',
    PT = 'PT',
    RU = 'RU',
    SK = 'SK',
    TW = 'TW',
    WA = 'WA',
    WE = 'WE',
    WF = 'WF',
    WL = 'WL',
    WM = 'WM',
    EE = 'EE',
    ID = 'ID',
    IE = 'IE',
    MT = 'MT',
    SE = 'SE',
    SI = 'SI',
    ZA = 'ZA'
}
/**
    * @export
    * @enum {string}
    */
export enum BulkEstimationsByCategoryTypeRequestBodyUserTypeEnum {
    PERSONAL = 'PERSONAL',
    BUSINESS = 'BUSINESS'
}
