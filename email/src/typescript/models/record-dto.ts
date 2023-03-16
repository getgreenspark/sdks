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
 * @interface RecordDto
 */
export interface RecordDto {
    /**
     * The indicator of the DNS record validity.
     * @type {boolean}
     * @memberof RecordDto
     */
    valid: boolean;
    /**
     * The type of the record that must be added to your domain.
     * @type {string}
     * @memberof RecordDto
     */
    type: string;
    /**
     * The type of the record that must be added to your domain.
     * @type {string}
     * @memberof RecordDto
     */
    host: string;
    /**
     * The value of the record that must be added to your domain.
     * @type {string}
     * @memberof RecordDto
     */
    data: string;
}
