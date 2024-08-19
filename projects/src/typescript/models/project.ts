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
 * @interface Project
 */
export interface Project {
    /**
     * The unique identifier of the project.
     * @type {string}
     * @memberof Project
     */
    projectId: string;
    /**
     * Defines the category that the project falls under. It links the project to its relevant category.
     * @type {string}
     * @memberof Project
     */
    projectCategoryId: string;
    /**
     * The name of the project.
     * @type {string}
     * @memberof Project
     */
    name: string;
    /**
     * Detailed explanation of what the project is about. It provides more context for users who want to understand the project.
     * @type {string}
     * @memberof Project
     */
    description: string;
    /**
     * Refers to the type of impact that the project is expected to have.
     * @type {string}
     * @memberof Project
     */
    type: ProjectTypeEnum;
    /**
     * This is a link to a webpage where users can find more detailed information about the project.
     * @type {string}
     * @memberof Project
     */
    registryLink?: string;
    /**
     * This is a link to the project specific Greenspark page.
     * @type {string}
     * @memberof Project
     */
    link: string;
    /**
     * Link to an image representing the project.
     * @type {string}
     * @memberof Project
     */
    imageUrl: string;
    /**
     * List of countries where the project is located.
     * @type {string}
     * @memberof Project
     */
    countries: string;
    /**
     * The year when the project started.
     * @type {number}
     * @memberof Project
     */
    vintage: number;
    /**
     * Defines how much it costs to purchase one unit of impact in the account's currency.
     * @type {number}
     * @memberof Project
     */
    price: number;
    /**
     * Defines how many units of impact are still available for purchase through the project. If there's no limit, this would be null. For a carbon offsetting project, this would be the number of tonnes of carbon that can still be offset through the project.
     * @type {number}
     * @memberof Project
     */
    availability?: number;
    /**
     * Defines the default project for a project category. When an impact purchase is made, the default project's impact will be purchased if the project is not specified.
     * @type {boolean}
     * @memberof Project
     */
    _default?: boolean;
}

/**
    * @export
    * @enum {string}
    */
export enum ProjectTypeEnum {
    Trees = 'trees',
    Carbon = 'carbon',
    Plastic = 'plastic',
    Kelp = 'kelp'
}
