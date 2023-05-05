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
import { RecordDto } from './record-dto';
/**
 * 
 * @export
 * @interface DnsDto
 */
export interface DnsDto {
    /**
     * Record that must be added to your domain.
     * @type {RecordDto}
     * @memberof DnsDto
     */
    mailCname: RecordDto;
    /**
     * Record that must be added to your domain.
     * @type {RecordDto}
     * @memberof DnsDto
     */
    dkim1: RecordDto;
    /**
     * Record that must be added to your domain.
     * @type {RecordDto}
     * @memberof DnsDto
     */
    dkim2: RecordDto;
}
