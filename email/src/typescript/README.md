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

### Production Environment
The SDK use the `production` environment by default. You only need to provide your API key.
```js
const emailApi = new EmailApi({apiKey: "<YOUR_API_KEY>"})
```

### Sandbox Environment
The SDK use the `production` environment by default. You can use the `sandbox` environment for testing and development by providing the `sandbox` environment `basePath` and your API key.
```js
const emailApi = new EmailApi({basePath: "https://sandbox.getgreenspark.com", apiKey: "<YOUR_API_KEY>"})
```

### Sample API operation

The SDK needs to be configured with your Greenspark API key, which is
available in the [Greenspark Dashboard](https://app.getgreenspark.com/account).

```js
import {EmailApi, NotificationTemplateResponseDto} from "@greenspark/email";

const emailApi = new EmailApi({apiKey: "<YOUR_API_KEY>"})
const {data} : Array<NotificationTemplateResponseDto> = await emailApi.fetchTemplates()
console.log(data);
```
