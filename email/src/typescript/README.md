# Greenspark Email API SDK
The Greenspark Email SDK provides access to the Greenspark Email API from
applications running on a server or in a browser.

## Documentation
See the [`@greenspark/email` API docs](https://greenspark.readme.io/reference/introduction) for details.

## Requirements

Node 16 or higher.

## Installation

Install the package with:

```sh
npm install @getgreenspark/email --save
```

## Usage
The SDK use the `production` environment by default. You can use the `sandbox` environment for testing and development.
```js
const emailApi = new EmailApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
```

The SDK needs to be configured with your Greenspark API key, which is
available in the [Greenspark Dashboard](https://app.getgreenspark.com/account).

```js
import {EmailApi} from "@greenspark/email";

const emailApi = new EmailApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
const response = await emailApi.fetchTemplates()
console.log(response);
```
