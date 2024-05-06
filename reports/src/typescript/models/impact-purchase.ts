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
 * @interface ImpactPurchase
 */
export interface ImpactPurchase {
    /**
     * Type can be trees, plastic or carbon.
     * @type {string}
     * @memberof ImpactPurchase
     */
    type: ImpactPurchaseTypeEnum;
    /**
     * The id of the project.
     * @type {string}
     * @memberof ImpactPurchase
     */
    projectId?: string;
    /**
     * Amount means number of trees, number of plastic bottles, kg of CO2.
     * @type {number}
     * @memberof ImpactPurchase
     */
    amount: number;
}

/**
    * @export
    * @enum {string}
    */
export enum ImpactPurchaseTypeEnum {
    Trees = 'trees',
    Carbon = 'carbon',
    Plastic = 'plastic',
    Kelp = 'kelp'
}

