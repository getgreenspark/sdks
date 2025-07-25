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
 * @interface PointDto
 */
export interface PointDto {
    /**
     * Specifies the type of GeoJSON object.
     * @type {string}
     * @memberof PointDto
     */
    type: string;
    /**
     * Coordinates of Point geometry object. https://tools.ietf.org/html/rfc7946#section-3.1.2
     * @type {Array<string>}
     * @memberof PointDto
     */
    coordinates: Array<string>;
}
