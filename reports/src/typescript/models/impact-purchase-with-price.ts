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
/**
 * 
 * @export
 * @interface ImpactPurchaseWithPrice
 */
export interface ImpactPurchaseWithPrice {
    /**
     * Type can be trees, plastic or carbon.
     * @type {string}
     * @memberof ImpactPurchaseWithPrice
     */
    type: ImpactPurchaseWithPriceTypeEnum;
    /**
     * The id of the project.
     * @type {string}
     * @memberof ImpactPurchaseWithPrice
     */
    projectId?: string;
    /**
     * Amount means number of trees, number of plastic bottles, kg of CO2.
     * @type {number}
     * @memberof ImpactPurchaseWithPrice
     */
    amount: number;
    /**
     * Amount of money spent on the impact purchase.
     * @type {number}
     * @memberof ImpactPurchaseWithPrice
     */
    price: number;
}

/**
    * @export
    * @enum {string}
    */
export enum ImpactPurchaseWithPriceTypeEnum {
    Trees = 'trees',
    Carbon = 'carbon',
    Plastic = 'plastic',
    Kelp = 'kelp'
}
