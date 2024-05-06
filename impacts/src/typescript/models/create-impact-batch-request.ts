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
import { ImpactDto } from './impact-dto';
/**
 * 
 * @export
 * @interface CreateImpactBatchRequest
 */
export interface CreateImpactBatchRequest {
    /**
     * The id of the source associated with the impact.
     * @type {string}
     * @memberof CreateImpactBatchRequest
     */
    sourceId?: string;
    /**
     * The id of the trigger associated with the impact.
     * @type {string}
     * @memberof CreateImpactBatchRequest
     */
    triggerId?: string;
    /**
     * The impact property defines the impact purchases you would like to create with the corresponding metadata and estimation.
     * @type {ImpactDto}
     * @memberof CreateImpactBatchRequest
     */
    impact: ImpactDto;
}
