=== Greenspark for WooCommerce ===
Contributors: greenspark
Tags: sustainability, carbon offset, eco, impact, widgets
Requires at least: 6.0
Tested up to: 6.8
Stable tag: 1.0.0
Requires PHP: 7.4
WC requires at least: 8.0
WC tested up to: 10.6
License: GNU General Public License v3.0
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Display Greenspark sustainability impact widgets on your WooCommerce store. Show customers the positive environmental impact of their purchases.

== Description ==

Greenspark for WooCommerce lets you display sustainability impact widgets anywhere in your store. Widgets are fully managed through the Greenspark dashboard and placed in your store using simple HTML embed codes.

**Requirements**

* An active [Greenspark](https://www.getgreenspark.com) subscription.
* A WooCommerce integration configured in your Greenspark dashboard.
* Widget embed codes generated from the Greenspark widget editor.

**Supported widget types**

* Per-product impact
* Per-order impact
* Cart impact (live checkout widget)
* Spend-level and tiered spend-level widgets
* By-percentage and by-percentage-of-revenue widgets
* Static impact widgets
* Top stats widgets
* Full-width banner widgets

**How it works**

1. Install and activate the plugin.
2. In the Greenspark dashboard, set up a WooCommerce integration and create widgets using the widget editor.
3. Copy the widget embed code provided by Greenspark.
4. Paste the embed code into your store pages using a Custom HTML block in the WordPress Block Editor, the theme Customizer, or directly in your theme template files.

The plugin automatically loads the Greenspark widget engine on every page of your store. When a page contains widget embed codes, the engine discovers them and renders the corresponding widgets. Cart-aware widgets update automatically when customers add, remove, or change items.

**Features**

* Works with both classic WooCommerce themes and block-based checkout.
* Compatible with High-Performance Order Storage (HPOS).
* Lightweight: the plugin itself is a single PHP file that enqueues a small JavaScript adapter (~9 KB).
* No admin configuration required. Widget appearance and behavior are managed entirely in the Greenspark dashboard.
* No server-side API calls. All widget rendering happens client-side for fast page loads and full compatibility with page caching.
* The plugin loads the Greenspark widget engine from `cdn.getgreenspark.com` over HTTPS. This is the same CDN used by all Greenspark integrations and is required for widget rendering.

== Installation ==

1. Install and activate the plugin from the WooCommerce Marketplace.
2. Log in to your [Greenspark dashboard](https://app.getgreenspark.com) and ensure you have an active WooCommerce integration.
3. Create widgets in the Greenspark widget editor and copy the embed codes.
4. Add the embed codes to your WooCommerce store pages using Custom HTML blocks or theme template files.

== Frequently Asked Questions ==

= Do I need a Greenspark account? =

Yes. This plugin requires an active Greenspark subscription with a WooCommerce integration configured in the Greenspark dashboard.

= Where do I get the embed codes? =

Log in to the Greenspark dashboard, navigate to the widget editor, create or select a widget, and copy the embed code provided.

= Can I place widgets anywhere on my store? =

Yes. You can add the embed code to any page, post, or template using a Custom HTML block, the theme Customizer, or by editing your theme files directly.

= Does this plugin work with the block-based checkout? =

Yes. The widget engine uses DOM-based discovery and is fully compatible with both classic and block-based cart and checkout pages.

= Does the plugin make any server-side API calls? =

No. All widget rendering happens client-side in the browser. The plugin only enqueues a small JavaScript file and passes basic WooCommerce context (currency, locale, product ID) to it.

== Changelog ==

= 1.0.0 =
* Added - Support for all 10 Greenspark widget types via Custom HTML embed codes.
* Added - Automatic cart mutation detection for live-updating cart widgets.
* Added - Compatibility with WooCommerce block-based checkout and HPOS.
