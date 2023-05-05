# Greenspark Estimations API SDK
The Greenspark Estimations SDK provides access to the Greenspark Estimations API from
applications running on a server or in a browser.

## Documentation
See the [`@greenspark/estimations` API docs](https://greenspark.readme.io/reference/introduction) for details.

## Requirements

Node 16 or higher.

## Installation

Install the package with:

```sh
npm install @getgreenspark/estimations --save
```

## Usage
The SDK use the `production` environment by default. You can use the `sandbox` environment for testing and development.
```js
const estimationsApi = new EstimationsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
```

The SDK needs to be configured with your Greenspark API key, which is
available in the [Greenspark Dashboard](https://app.getgreenspark.com/account).

```js
import {
    Estimation,
    EstimationsApi,
    EstimationsByMCCRequestBodyGeoEnum,
    EstimationsByMCCRequestBodyUserTypeEnum
} from "@greenspark/estimations";

const estimationsApi = new EstimationsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
const {data}: Estimation = await estimationsApi.fetchCarbonEstimateOfATransactionByMCC({
    "price": 1000,
    "mcc": "5411",
    "currencyISO": "EUR",
    "merchant": "Superstore",
    "geo": EstimationsByMCCRequestBodyGeoEnum.EUUK,
    "userType": EstimationsByMCCRequestBodyUserTypeEnum.PERSONAL,
    "metadata": [
        {
            "key": "customerId",
            "value": "743ce227-22ef-4c6e-9c06-725f97b99690"
        }
    ]
})
console.log(data);
```
