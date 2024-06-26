/* tslint:disable */
/* eslint-disable */
/**
 * Projects
 * Here you can find documentation and examples for Greenspark Projects API
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
 * @interface ProjectMetadata
 */
export interface ProjectMetadata {
    /**
     * The description of the metadata.
     * @type {string}
     * @memberof ProjectMetadata
     */
    description: string;
    /**
     * The key of the metadata.
     * @type {string}
     * @memberof ProjectMetadata
     */
    key: string;
    /**
     * The type of the metadata. It can be either a primitive type, an array or an object or even a custom type.
     * @type {string}
     * @memberof ProjectMetadata
     */
    type: string;
    /**
     * The value of the metadata with the type defined in the type field.
     * @type {any}
     * @memberof ProjectMetadata
     */
    value: any;
}
