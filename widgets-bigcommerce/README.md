# @getgreenspark/widgets-bigcommerce

BigCommerce storefront adapter for the Greenspark Widget SDK. Loads the core widgets script and initializes widgets using **store context discovered automatically** from the storefront (like the Shopify adapter). The merchant only adds one script tag and one div with an id—no config or params from the Page Builder.

## Installation

Publish to your CDN (e.g. `cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js`) or serve from your app. No npm install on the storefront required when using the script tag.

## Storefront setup (merchant-only)

The merchant (or Page Builder) adds **only**:

1. **In the header:** the script tag (no config block, no data attributes):

```html
<script src="https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js" async></script>
```

2. **Where the widget should appear:** a single div with `class="greenspark-widget-target"` and `id` set to the widget’s hashed id (contains widget type + editor settings):

```html
<div
  class="greenspark-widget-target"
  id="MHxncmVlbnNwYXJrLXdpZGdldC1pZHwxMjM0"
></div>
```

**No** `integrationSlug` or other params are passed via the script or the div. The client discovers currency, locale, cart, and product from the store. BigCommerce does **not** expose the store hash on the storefront (unlike Shopify’s `window.Shopify.shop`), so the **app** must provide it:

- **integrationSlug (required):** Set by **your app** via `window.GreensparkBigCommerceConfig.integrationSlug` before the widget script runs. The app knows the store hash from OAuth/install; inject it with a theme script, app block, or script tag your app serves (so it works on any domain, including custom domains).
- **Currency / locale:** from page meta or `<html lang>`; default `USD` / `en`.
- **Product id:** from `[data-product-id]` or `meta[property="product:id"]` on the page when on a PDP.
- **Cart:** from the `bc_cartId` cookie and Storefront API.

Example: app injects store hash, then the merchant’s script runs:

```html
<!-- Injected by your app (theme script / app block) -->
<script>
  window.GreensparkBigCommerceConfig = { integrationSlug: 'STORE_HASH_FROM_OAUTH' };
</script>
<script src="https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js" async></script>
```

## Content API–based placement (region drag-and-drop)

This package is **storefront-only**: it does not call the BigCommerce Content API. The **backend** (e.g. Open API in the monorepo) is responsible for:

1. **Creating a widget template** via BigCommerce `POST /v3/content/widget-templates` (name, schema, template HTML).
2. **Creating a placement** via `POST /v3/content/placements` (widget_template_uuid, template_file = region name, widget_configuration, status).

The **template** HTML must follow the widget template contract below. The client discovers store context (integration slug, currency, cart, etc.) from the storefront; the template must **not** pass config or params via the script or the div.

Open API exposes proxy endpoints (you must have `storeHash` and `accessToken` from OAuth):

- `POST /v1/integrations/bigcommerce/widget-templates` — body: `{ storeHash, accessToken, name, schema, template }` → returns `{ uuid }`.
- `POST /v1/integrations/bigcommerce/placements` — body: `{ storeHash, accessToken, widget_template_uuid, widget_configuration, template_file, status }` → returns `{ uuid }`.
- `GET /v1/integrations/bigcommerce/widget-script-url` — returns the script URL to use in the template.

Example template string (Handlebars): only the script and a div with `id="{{base64EncodedId}}"`. No config script, no data attributes.

```html
<script src="https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js" async></script>
<div class="greenspark-widget-target" id="{{base64EncodedId}}"></div>
```

`template_file` is the theme region (e.g. `pages/home`, `below_content--global`). Use [Regions](https://developer.bigcommerce.com/docs/rest-content/widgets/regions) or theme files to see available regions. `status` is typically `"active"`. The placement’s `widget_configuration` must include `base64EncodedId` (and any schema fields your template uses).

## Widget template contract (for BigCommerce Content API)

Widget templates should output:

1. A script tag loading `https://cdn.getgreenspark.com/scripts/widgets-bigcommerce@latest.js`.
2. One or more elements with:
   - `class="greenspark-widget-target"`
   - `id` = the widget’s hashed id (base64 of `widgetType + '|' + widgetId`; `widgetType` is one of `'0'`…`'9'` — see `EnumToWidgetTypeMap` in `src/interfaces/index.ts`).

Do **not** output a config script or `data-integration-slug` / other params on the div. The client derives integration slug, currency, locale, cart, and product id from the store.

Example for a single widget:

```html
<div class="greenspark-widget-target" id="{{base64EncodedId}}"></div>
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
