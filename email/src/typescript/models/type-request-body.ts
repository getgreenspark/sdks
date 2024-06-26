/* tslint:disable */
/* eslint-disable */
/**
 * Email
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
 * @interface TypeRequestBody
 */
export interface TypeRequestBody {
    /**
     * Name of the template
     * @type {string}
     * @memberof TypeRequestBody
     */
    name: string;
    /**
     * The type of the template.
     * @type {string}
     * @memberof TypeRequestBody
     */
    template: TypeRequestBodyTemplateEnum;
    /**
     * Choose the impact action which triggers your email to be sent out.
     * @type {Array<string>}
     * @memberof TypeRequestBody
     */
    trigger: Array<string>;
    /**
     * Sets how many days after an impact creation a signup nudging email is sent out to your customer.
     * @type {Array<number>}
     * @memberof TypeRequestBody
     */
    schedule: Array<number>;
}

/**
    * @export
    * @enum {string}
    */
export enum TypeRequestBodyTemplateEnum {
    Invitation = 'invitation',
    Update = 'update',
    Nudge = 'nudge'
}

