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
import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { BatchImpactPurchaseResponses } from '../models';
import { CreateImpactBatchRequestBody } from '../models';
import { ImpactDto } from '../models';
import { ImpactPurchaseDetail } from '../models';
import { TransactionPurchase } from '../models';
/**
 * ImpactsApi - axios parameter creator
 * @export
 */
export const ImpactsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Creates an impact associated with a source and a trigger.
         * @summary Create Impact
         * @param {ImpactDto} body 
         * @param {string} sourceId The id of the source associated with the impact.
         * @param {string} triggerId The id of the trigger associated with the impact.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImpact: async (body: ImpactDto, sourceId: string, triggerId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling createImpact.');
            }
            // verify required parameter 'sourceId' is not null or undefined
            if (sourceId === null || sourceId === undefined) {
                throw new RequiredError('sourceId','Required parameter sourceId was null or undefined when calling createImpact.');
            }
            // verify required parameter 'triggerId' is not null or undefined
            if (triggerId === null || triggerId === undefined) {
                throw new RequiredError('triggerId','Required parameter triggerId was null or undefined when calling createImpact.');
            }
            const localVarPath = `/v1/impacts/sources/{sourceId}/triggers/{triggerId}`
                .replace(`{${"sourceId"}}`, encodeURIComponent(String(sourceId)))
                .replace(`{${"triggerId"}}`, encodeURIComponent(String(triggerId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication access-key required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-api-key")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-api-key"] = localVarApiKeyValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Run multiple create impact call in a batch, equivalent to calling create impact multiple times with different parameters.
         * @summary Create Impact in Batch
         * @param {CreateImpactBatchRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createImpactBatch: async (body: CreateImpactBatchRequestBody, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling createImpactBatch.');
            }
            const localVarPath = `/v1/impacts/batch`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication access-key required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-api-key")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-api-key"] = localVarApiKeyValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Creates an impact associated with an account id.
         * @summary Create Tailored Impact
         * @param {ImpactDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createTailoredImpact: async (body: ImpactDto, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling createTailoredImpact.');
            }
            const localVarPath = `/v1/impacts`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication access-key required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-api-key")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-api-key"] = localVarApiKeyValue;
            }

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Fetch a single impact purchase. [Read more about the domain object here.](https://greenspark.readme.io/reference/impacts)
         * @summary Fetch Impact Purchase
         * @param {string} purchaseId The id of the purchase.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getImpactPurchase: async (purchaseId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'purchaseId' is not null or undefined
            if (purchaseId === null || purchaseId === undefined) {
                throw new RequiredError('purchaseId','Required parameter purchaseId was null or undefined when calling getImpactPurchase.');
            }
            const localVarPath = `/v1/impacts/purchases/{purchaseId}`
                .replace(`{${"purchaseId"}}`, encodeURIComponent(String(purchaseId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication access-key required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-api-key")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-api-key"] = localVarApiKeyValue;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Fetch all impact purchases. [Read more about the domain object here.](https://greenspark.readme.io/reference/impacts)
         * @summary Fetch Impact Purchases
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getImpactPurchases: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/v1/impacts/purchases`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication access-key required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("x-api-key")
                    : await configuration.apiKey;
                localVarHeaderParameter["x-api-key"] = localVarApiKeyValue;
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * ImpactsApi - functional programming interface
 * @export
 */
export const ImpactsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Creates an impact associated with a source and a trigger.
         * @summary Create Impact
         * @param {ImpactDto} body 
         * @param {string} sourceId The id of the source associated with the impact.
         * @param {string} triggerId The id of the trigger associated with the impact.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createImpact(body: ImpactDto, sourceId: string, triggerId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<ImpactPurchaseDetail>>>> {
            const localVarAxiosArgs = await ImpactsApiAxiosParamCreator(configuration).createImpact(body, sourceId, triggerId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Run multiple create impact call in a batch, equivalent to calling create impact multiple times with different parameters.
         * @summary Create Impact in Batch
         * @param {CreateImpactBatchRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createImpactBatch(body: CreateImpactBatchRequestBody, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<BatchImpactPurchaseResponses>>> {
            const localVarAxiosArgs = await ImpactsApiAxiosParamCreator(configuration).createImpactBatch(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Creates an impact associated with an account id.
         * @summary Create Tailored Impact
         * @param {ImpactDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createTailoredImpact(body: ImpactDto, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<ImpactPurchaseDetail>>>> {
            const localVarAxiosArgs = await ImpactsApiAxiosParamCreator(configuration).createTailoredImpact(body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Fetch a single impact purchase. [Read more about the domain object here.](https://greenspark.readme.io/reference/impacts)
         * @summary Fetch Impact Purchase
         * @param {string} purchaseId The id of the purchase.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getImpactPurchase(purchaseId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<TransactionPurchase>>> {
            const localVarAxiosArgs = await ImpactsApiAxiosParamCreator(configuration).getImpactPurchase(purchaseId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Fetch all impact purchases. [Read more about the domain object here.](https://greenspark.readme.io/reference/impacts)
         * @summary Fetch Impact Purchases
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getImpactPurchases(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<Array<TransactionPurchase>>>> {
            const localVarAxiosArgs = await ImpactsApiAxiosParamCreator(configuration).getImpactPurchases(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * ImpactsApi - factory interface
 * @export
 */
export const ImpactsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Creates an impact associated with a source and a trigger.
         * @summary Create Impact
         * @param {ImpactDto} body 
         * @param {string} sourceId The id of the source associated with the impact.
         * @param {string} triggerId The id of the trigger associated with the impact.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createImpact(body: ImpactDto, sourceId: string, triggerId: string, options?: AxiosRequestConfig): Promise<AxiosResponse<Array<ImpactPurchaseDetail>>> {
            return ImpactsApiFp(configuration).createImpact(body, sourceId, triggerId, options).then((request) => request(axios, basePath));
        },
        /**
         * Run multiple create impact call in a batch, equivalent to calling create impact multiple times with different parameters.
         * @summary Create Impact in Batch
         * @param {CreateImpactBatchRequestBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createImpactBatch(body: CreateImpactBatchRequestBody, options?: AxiosRequestConfig): Promise<AxiosResponse<BatchImpactPurchaseResponses>> {
            return ImpactsApiFp(configuration).createImpactBatch(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Creates an impact associated with an account id.
         * @summary Create Tailored Impact
         * @param {ImpactDto} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createTailoredImpact(body: ImpactDto, options?: AxiosRequestConfig): Promise<AxiosResponse<Array<ImpactPurchaseDetail>>> {
            return ImpactsApiFp(configuration).createTailoredImpact(body, options).then((request) => request(axios, basePath));
        },
        /**
         * Fetch a single impact purchase. [Read more about the domain object here.](https://greenspark.readme.io/reference/impacts)
         * @summary Fetch Impact Purchase
         * @param {string} purchaseId The id of the purchase.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getImpactPurchase(purchaseId: string, options?: AxiosRequestConfig): Promise<AxiosResponse<TransactionPurchase>> {
            return ImpactsApiFp(configuration).getImpactPurchase(purchaseId, options).then((request) => request(axios, basePath));
        },
        /**
         * Fetch all impact purchases. [Read more about the domain object here.](https://greenspark.readme.io/reference/impacts)
         * @summary Fetch Impact Purchases
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getImpactPurchases(options?: AxiosRequestConfig): Promise<AxiosResponse<Array<TransactionPurchase>>> {
            return ImpactsApiFp(configuration).getImpactPurchases(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * ImpactsApi - object-oriented interface
 * @export
 * @class ImpactsApi
 * @extends {BaseAPI}
 */
export class ImpactsApi extends BaseAPI {
    /**
     * Creates an impact associated with a source and a trigger.
     * @summary Create Impact
     * @param {ImpactDto} body 
     * @param {string} sourceId The id of the source associated with the impact.
     * @param {string} triggerId The id of the trigger associated with the impact.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImpactsApi
     */
    public async createImpact(body: ImpactDto, sourceId: string, triggerId: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<ImpactPurchaseDetail>>> {
        return ImpactsApiFp(this.configuration).createImpact(body, sourceId, triggerId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Run multiple create impact call in a batch, equivalent to calling create impact multiple times with different parameters.
     * @summary Create Impact in Batch
     * @param {CreateImpactBatchRequestBody} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImpactsApi
     */
    public async createImpactBatch(body: CreateImpactBatchRequestBody, options?: AxiosRequestConfig) : Promise<AxiosResponse<BatchImpactPurchaseResponses>> {
        return ImpactsApiFp(this.configuration).createImpactBatch(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Creates an impact associated with an account id.
     * @summary Create Tailored Impact
     * @param {ImpactDto} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImpactsApi
     */
    public async createTailoredImpact(body: ImpactDto, options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<ImpactPurchaseDetail>>> {
        return ImpactsApiFp(this.configuration).createTailoredImpact(body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Fetch a single impact purchase. [Read more about the domain object here.](https://greenspark.readme.io/reference/impacts)
     * @summary Fetch Impact Purchase
     * @param {string} purchaseId The id of the purchase.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImpactsApi
     */
    public async getImpactPurchase(purchaseId: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<TransactionPurchase>> {
        return ImpactsApiFp(this.configuration).getImpactPurchase(purchaseId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Fetch all impact purchases. [Read more about the domain object here.](https://greenspark.readme.io/reference/impacts)
     * @summary Fetch Impact Purchases
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ImpactsApi
     */
    public async getImpactPurchases(options?: AxiosRequestConfig) : Promise<AxiosResponse<Array<TransactionPurchase>>> {
        return ImpactsApiFp(this.configuration).getImpactPurchases(options).then((request) => request(this.axios, this.basePath));
    }
}
