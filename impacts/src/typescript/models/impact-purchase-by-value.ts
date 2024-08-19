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
/**
 * 
 * @export
 * @interface ImpactPurchaseByValue
 */
export interface ImpactPurchaseByValue {
    /**
     * Type can be trees, plastic or carbon.
     * @type {string}
     * @memberof ImpactPurchaseByValue
     */
    type: ImpactPurchaseByValueTypeEnum;
    /**
     * The id of the project.
     * @type {string}
     * @memberof ImpactPurchaseByValue
     */
    projectId?: string;
    /**
     * Value of the impacts to be purchased in the account’s currency.
     * @type {number}
     * @memberof ImpactPurchaseByValue
     */
    value: number;
}

/**
    * @export
    * @enum {string}
    */
export enum ImpactPurchaseByValueTypeEnum {
    Trees = 'trees',
    Carbon = 'carbon',
    Plastic = 'plastic',
    Kelp = 'kelp'
}
