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
 * @interface Estimation
 */
export interface Estimation {
    /**
     * Either \"category\" or \"merchant\" depending on whether there is emissions data available on that merchant or only on the mcc category.
     * @type {string}
     * @memberof Estimation
     */
    emissionsLevel: EstimationEmissionsLevelEnum;
    /**
     * In the case of \"category\" this is the mcc code string (Ex: Supermarkets), and if emissions_level is \"merchant\" it returns the name of the merchant you entered (ex: \"Superstore\"). [Full list of merchant categories.](https://usa.visa.com/content/dam/VCOM/download/merchants/visa-merchant-data-standards-manual.pdf)
     * @type {string}
     * @memberof Estimation
     */
    name: string;
    /**
     * Estimated carbon footprint In Kg of CO2 equivalent.
     * @type {number}
     * @memberof Estimation
     */
    kgOfCO2Emissions: number;
    /**
     * Estimated carbon footprint In metric tons (mt) of CO2 equivalent.
     * @type {number}
     * @memberof Estimation
     */
    mtOfCO2Emissions: number;
    /**
     * Random list of relatable actions with similar footprint.
     * @type {Array<string>}
     * @memberof Estimation
     */
    similarTo: Array<string>;
}

/**
    * @export
    * @enum {string}
    */
export enum EstimationEmissionsLevelEnum {
    Category = 'category',
    Merchant = 'merchant'
}

