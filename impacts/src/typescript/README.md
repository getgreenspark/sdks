# Greenspark Impacts API SDK
The Greenspark Impacts SDK provides access to the Greenspark Impacts API from
applications running on a server or in a browser.

## Documentation
See the [`@greenspark/impacts` API docs](https://greenspark.readme.io/reference/introduction) for details.

## Requirements

Node 16 or higher.

## Installation

Install the package with:

```sh
npm install @getgreenspark/impacts --save
```

## Usage

### Production Environment
The SDK use the `production` environment by default. You only need to provide your API key.
```js
const impactApi = new ImpactsApi({apiKey: "<YOUR_API_KEY>"})
```

### Sandbox Environment
The SDK use the `production` environment by default. You can use the `sandbox` environment for testing and development by providing the `sandbox` environment `basePath` and your API key.
```js
const impactApi = new ImpactsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
```

### Sample API operation

The SDK needs to be configured with your Greenspark API key, which is
available in the [Greenspark Dashboard](https://app.getgreenspark.com/account).

```js
import {ImpactsApi, ImpactPurchaseTypeEnum} from "@greenspark/impacts";
import {AxiosResponse} from "axios";

const impactApi = new ImpactsApi({apiKey: "<YOUR_API_KEY>"})
const response: AxiosResponse<void> = await impactApi.createTailoredImpact({
    "impactPurchases": [
        {
            "amount": 1,
            "type": ImpactPurchaseTypeEnum.Trees
        }
    ],
    "metadata": [
        {
            "key": "client",
            "value": "sdk"
        }
    ]
});
console.log(response);
```
