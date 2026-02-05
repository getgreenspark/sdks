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
