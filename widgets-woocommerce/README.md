# Greenspark for WooCommerce

WordPress/WooCommerce storefront adapter for the [Greenspark](https://getgreenspark.com) widget SDK. Loads a small JavaScript bundle that pulls in the SDK from CDN, discovers `.greenspark-widget-target` embeds, and refreshes cart-aware widgets when the cart changes.

## Requirements

- WooCommerce **8.0+**
- Node.js + npm (for building the adapter)

## Development

Clone the repo, then from this directory:

```bash
npm ci
npm run build
```

This writes minified bundles to `assets/js/` (e.g. `widgets-woocommerce@latest.js`). **Run `npm run build` after source changes** before committing or packaging the plugin; the main PHP file enqueues `assets/js/widgets-woocommerce@latest.js`.

Other useful commands:

```bash
npm run lint      # ESLint on src/
npm run dev       # webpack development mode
npm run build:zip # production build + greenspark.zip (marketplace layout)
```

## Release / WooCommerce Marketplace ZIP

Use `npm run build:zip` from `widgets-woocommerce` to produce `greenspark.zip` with the expected root folder layout for submission.

## License

GPL-3.0-or-later (see `package.json`).
