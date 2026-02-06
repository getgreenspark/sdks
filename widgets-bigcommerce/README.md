# @getgreenspark/widgets-bigcommerce

BigCommerce storefront adapter for the Greenspark Widget SDK. Loads the core widgets script and initializes widgets using BigCommerce store context (integration slug, product id, cart, currency, locale).

## Installation

Publish to your CDN (e.g. `cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js`) or serve from your app. No npm install on the storefront required when using the script tag.

## Storefront setup

1. **Set config before the script runs** (recommended):

```html
<script>
  window.GreensparkBigCommerceConfig = {
    integrationSlug: 'YOUR_STORE_HASH_OR_ID',
    productId: '123',        // optional; set on product pages for per-product widgets
    currency: 'USD',
    locale: 'en',
    cartId: null,            // optional; script will try bc_cartId cookie if omitted
    storefrontApiBase: '',   // optional; defaults to window.location.origin
  };
</script>
<script src="https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js" async></script>
```

2. **Or use data attributes** on the script tag or on a `.greenspark-widget-target` element:

- `data-integration-slug` (required)
- `data-product-id`, `data-currency`, `data-locale`, `data-cart-id`, `data-storefront-api-base` (optional)

## Content API–based placement (region drag-and-drop)

This package is **storefront-only**: it does not call the BigCommerce Content API. The **backend** (e.g. Open API in the monorepo) is responsible for:

1. **Creating a widget template** via BigCommerce `POST /v3/content/widget-templates` (name, schema, template HTML).
2. **Creating a placement** via `POST /v3/content/placements` (widget_template_uuid, template_file = region name, widget_configuration, status).

The **template** HTML must follow the widget template contract below so that when BigCommerce renders it in a region, this script runs and finds the targets.

Open API exposes proxy endpoints (you must have `storeHash` and `accessToken` from OAuth):

- `POST /v1/integrations/bigcommerce/widget-templates` — body: `{ storeHash, accessToken, name, schema, template }` → returns `{ uuid }`.
- `POST /v1/integrations/bigcommerce/placements` — body: `{ storeHash, accessToken, widget_template_uuid, widget_configuration, template_file, status }` → returns `{ uuid }`.
- `GET /v1/integrations/bigcommerce/widget-script-url` — returns the script URL to use in the template.

Example template string (Handlebars-style; use your integration slug and widget type/id):

```html
<script>window.GreensparkBigCommerceConfig={integrationSlug:'{{integrationSlug}}',currency:'{{currency}}',locale:'{{locale}}'};</script>
<script src="https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js" async></script>
<div class="greenspark-widget-target" id="{{base64EncodedId}}" data-integration-slug="{{integrationSlug}}" data-currency="{{currency}}"></div>
```

`template_file` is the theme region (e.g. `pages/home`, `below_content--global`). Use [Regions](https://developer.bigcommerce.com/docs/rest-content/widgets/regions) or theme files to see available regions. `status` is typically `"active"`.

## Widget template contract (for BigCommerce Content API)

Widget templates should output:

1. A script tag that sets `window.GreensparkBigCommerceConfig` (or ensure the app injects it).
2. A script tag loading `https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js`.
3. One or more elements with:
   - `class="greenspark-widget-target"`
   - `id` = base64-encoded string: `btoa(widgetType + '|' + widgetId)` where `widgetType` is one of `'0'`…`'9'` (see `EnumToWidgetTypeMap` in `src/interfaces/index.ts`).

Example for a single widget:

```html
<div
  class="greenspark-widget-target"
  id="{{base64EncodedId}}"
  data-integration-slug="{{integrationSlug}}"
  data-product-id="{{product.id}}"
  data-currency="{{currency}}"
></div>
```

### Example: Static widget (StaticWidget)

Static widget type is **`8`**. `base64EncodedId` = `btoa('8|' + widgetId)` (e.g. in Node: `Buffer.from('8|' + widgetId).toString('base64')`).

**Exact cURL (Open API proxy)** — replace `BASE_URL`, `STORE_HASH`, and `ACCESS_TOKEN`, then run:

```bash
curl -X POST "${BASE_URL}/v1/integrations/bigcommerce/widget-templates" \
  -H "Content-Type: application/json" \
  -d '{
  "storeHash": "STORE_HASH",
  "accessToken": "ACCESS_TOKEN",
  "name": "Greenspark Static Widget",
  "schema": [
    {"type":"text","name":"integrationSlug","label":"Integration","default":""},
    {"type":"text","name":"widgetId","label":"Widget ID","default":""},
    {"type":"select","name":"color","label":"Color","default":"green","options":[{"value":"beige","label":"Beige"},{"value":"green","label":"Green"},{"value":"blue","label":"Blue"},{"value":"white","label":"White"},{"value":"black","label":"Black"},{"value":"grey","label":"Grey"},{"value":"transparent","label":"Transparent"}]},
    {"type":"select","name":"style","label":"Style","default":"default","options":[{"value":"default","label":"Default"},{"value":"simplified","label":"Simplified"},{"value":"rounded","label":"Rounded"}]},
    {"type":"text","name":"base64EncodedId","label":"Target ID (internal)","default":""},
    {"type":"text","name":"currency","label":"Currency","default":"USD"},
    {"type":"text","name":"locale","label":"Locale","default":"en"}
  ],
  "template": "<script>window.GreensparkBigCommerceConfig={integrationSlug:\"{{integrationSlug}}\",currency:\"{{currency}}\",locale:\"{{locale}}\"};</script>\n<script src=\"https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js\" async></script>\n<div class=\"greenspark-widget-target\" id=\"{{base64EncodedId}}\" data-integration-slug=\"{{integrationSlug}}\" data-color=\"{{color}}\" data-currency=\"{{currency}}\"></div>"
}'
```

Example with a real base URL (no env vars):

```bash
curl -X POST "https://api.getgreenspark.com/v1/integrations/bigcommerce/widget-templates" \
  -H "Content-Type: application/json" \
  -d '{"storeHash":"YOUR_STORE_HASH","accessToken":"YOUR_ACCESS_TOKEN","name":"Greenspark Static Widget","schema":[{"type":"text","name":"integrationSlug","label":"Integration","default":""},{"type":"text","name":"widgetId","label":"Widget ID","default":""},{"type":"select","name":"color","label":"Color","default":"green","options":[{"value":"beige","label":"Beige"},{"value":"green","label":"Green"},{"value":"blue","label":"Blue"},{"value":"white","label":"White"},{"value":"black","label":"Black"},{"value":"grey","label":"Grey"},{"value":"transparent","label":"Transparent"}]},{"type":"select","name":"style","label":"Style","default":"default","options":[{"value":"default","label":"Default"},{"value":"simplified","label":"Simplified"},{"value":"rounded","label":"Rounded"}]},{"type":"text","name":"base64EncodedId","label":"Target ID (internal)","default":""},{"type":"text","name":"currency","label":"Currency","default":"USD"},{"type":"text","name":"locale","label":"Locale","default":"en"}],"template":"<script>window.GreensparkBigCommerceConfig={integrationSlug:\"{{integrationSlug}}\",currency:\"{{currency}}\",locale:\"{{locale}}\"};</script>\n<script src=\"https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js\" async></script>\n<div class=\"greenspark-widget-target\" id=\"{{base64EncodedId}}\" data-integration-slug=\"{{integrationSlug}}\" data-color=\"{{color}}\" data-currency=\"{{currency}}\"></div>"}'
```

**1. Create widget template** — `POST /v3/content/widget-templates` (or your Open API proxy).

```json
{
  "name": "Greenspark Static Widget",
  "schema": [
    {
      "type": "text",
      "name": "integrationSlug",
      "label": "Integration",
      "default": ""
    },
    {
      "type": "text",
      "name": "widgetId",
      "label": "Widget ID",
      "default": ""
    },
    {
      "type": "select",
      "name": "color",
      "label": "Color",
      "default": "green",
      "options": [
        { "value": "beige", "label": "Beige" },
        { "value": "green", "label": "Green" },
        { "value": "blue", "label": "Blue" },
        { "value": "white", "label": "White" },
        { "value": "black", "label": "Black" },
        { "value": "grey", "label": "Grey" },
        { "value": "transparent", "label": "Transparent" }
      ]
    },
    {
      "type": "select",
      "name": "style",
      "label": "Style",
      "default": "default",
      "options": [
        { "value": "default", "label": "Default" },
        { "value": "simplified", "label": "Simplified" },
        { "value": "rounded", "label": "Rounded" }
      ]
    },
    {
      "type": "text",
      "name": "base64EncodedId",
      "label": "Target ID (internal)",
      "default": ""
    },
    {
      "type": "text",
      "name": "currency",
      "label": "Currency",
      "default": "USD"
    },
    {
      "type": "text",
      "name": "locale",
      "label": "Locale",
      "default": "en"
    }
  ],
  "template": "<script>window.GreensparkBigCommerceConfig={integrationSlug:'{{integrationSlug}}',currency:'{{currency}}',locale:'{{locale}}'};</script>\n<script src=\"https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js\" async></script>\n<div class=\"greenspark-widget-target\" id=\"{{base64EncodedId}}\" data-integration-slug=\"{{integrationSlug}}\" data-color=\"{{color}}\" data-currency=\"{{currency}}\"></div>"
}
```

**2. Create placement** — `POST /v3/content/placements` (or your Open API proxy).

Use the `uuid` from step 1. Set `widget_configuration` to the values the template expects (must include `base64EncodedId` = `btoa('8|' + widgetId)`).

```json
{
  "widget_template_uuid": "<uuid-from-step-1>",
  "template_file": "pages/home",
  "status": "active",
  "widget_configuration": {
    "integrationSlug": "your_store_hash_or_id",
    "widgetId": "your_greenspark_widget_id",
    "base64EncodedId": "OHx5b3VyX2dyZWVuc3Bhcmtfd2lkZ2V0X2lk",
    "color": "green",
    "style": "default",
    "currency": "USD",
    "locale": "en"
  }
}
```

`base64EncodedId` must be the base64 encoding of `8|{widgetId}` (e.g. for `widgetId` `"abc123"` use `Buffer.from('8|abc123').toString('base64')` → `OHxhYmMxMjM=`). The storefront script uses this to match the target to the static widget type and fetch the correct config.

## Cart (Stencil vs Storefront API)

- **Cookie:** The script looks for `bc_cartId` to get the current cart id for the Storefront API.
- **Endpoints:** It uses `GET /api/storefront/carts/{cartId}`, `POST /api/storefront/carts`, `POST /api/storefront/carts/{cartId}/items`, and `PUT /api/storefront/carts/{cartId}/items` relative to `storefrontApiBase` (or same origin). If your theme or headless setup uses different paths or a Stencil cart object, inject a custom config or extend the script.
- **Re-render:** After add/update cart, the script calls `runGreenspark()` again so cart widgets refresh.

## Widget types (same as Shopify)

- `0` – orderImpacts (cart contribution)
- `1` – offsetPerOrder
- `2` – offsetByProduct
- `3` – offsetBySpend
- `4` – offsetByStoreRevenue
- `5` – byPercentage
- `6` – byPercentageOfRevenue
- `7` – stats
- `8` – static
- `9` – banner

## Build

```bash
npm install
npm run build
```

Output is in `dist/` (e.g. `widgets-bigcommerce@latest.js`).
