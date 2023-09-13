# Greenspark Reports API SDK
The Greenspark Reports SDK provides access to the Greenspark Reports API from
applications running on a server or in a browser.

## Documentation
See the [`@greenspark/reports` API docs](https://greenspark.readme.io/reference/introduction) for details.

## Requirements

Node 16 or higher.

## Installation

Install the package with:

```sh
npm install @getgreenspark/reports --save
```

## Usage

### Production Environment
The SDK use the `production` environment by default. You only need to provide your API key.
```js
const reportsApi = new ReportsApi({apiKey: "<YOUR_API_KEY>"})
```

### Sandbox Environment
The SDK use the `production` environment by default. You can use the `sandbox` environment for testing and development by providing the `sandbox` environment `basePath` and your API key.
```js
const reportsApi = new ReportsApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
```

### Sample API operation

The SDK needs to be configured with your Greenspark API key, which is
available in the [Greenspark Dashboard](https://app.getgreenspark.com/account).

```js
import {RawReport, ReportsApi} from "@greenspark/reports";

const reportsApi = new ReportsApi({apiKey: "<YOUR_API_KEY>"})
const {data}: RawReport = await reportsApi.fetchRawReportV2()
console.log(data);
```
