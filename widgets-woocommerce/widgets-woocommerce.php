<?php
/**
 * Plugin Name: Greenspark widgets for Woocommerce
 * Plugin URI:  https://getgreenspark.com
 * Description: Display Greenspark sustainability impact widgets on your WooCommerce store.
 * Version:     1.0.0
 * Author:      Greenspark
 * Author URI:  https://getgreenspark.com
 * Developer:   Greenspark
 * Developer URI: https://getgreenspark.com
 * Text Domain: widgets-woocommerce
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License:     GNU General Public License v3.0
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * WC requires at least: 8.0
 * WC tested up to: 10.6.1
 *
 * @package Widgets_WooCommerce
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'GREENSPARK_WC_VERSION', '1.0.0' );
define( 'GREENSPARK_WC_PLUGIN_FILE', __FILE__ );
define( 'GREENSPARK_WC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Declare compatibility with WooCommerce features.
 */
function greenspark_wc_declare_compatibility(): void {
    if ( ! class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
        return;
    }
    \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
        'custom_order_tables',
        GREENSPARK_WC_PLUGIN_FILE,
        true
    );
    \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
        'cart_checkout_blocks',
        GREENSPARK_WC_PLUGIN_FILE,
        true
    );
}
add_action( 'before_woocommerce_init', 'greenspark_wc_declare_compatibility' );

/**
 * Show admin notice when WooCommerce is missing or too old.
 */
function greenspark_wc_check_woocommerce(): bool {
    if ( ! class_exists( 'WooCommerce' ) ) {
        add_action( 'admin_notices', static function (): void {
            echo '<div class="notice notice-error is-dismissible"><p>';
            esc_html_e(
                'Greenspark widgets for Woocommerce requires WooCommerce to be installed and active.',
                'widgets-woocommerce'
            );
            echo '</p></div>';
        } );
        return false;
    }

    if ( version_compare( WC_VERSION, '8.0', '<' ) ) {
        add_action( 'admin_notices', static function (): void {
            echo '<div class="notice notice-error is-dismissible"><p>';
            esc_html_e(
                'Greenspark widgets for Woocommerce requires WooCommerce 8.0 or later.',
                'widgets-woocommerce'
            );
            echo '</p></div>';
        } );
        return false;
    }

    return true;
}

/**
 * Enqueue the widget adapter script and pass WooCommerce context.
 */
function greenspark_wc_enqueue_scripts(): void {
    wp_enqueue_script(
        'greenspark-wc-adapter',
        GREENSPARK_WC_PLUGIN_URL . 'assets/js/widgets-woocommerce@latest.js',
        [],
        GREENSPARK_WC_VERSION,
        true
    );

    $product_id = '';
    if ( function_exists( 'is_product' ) && is_product() ) {
        $product_id = (string) get_the_ID();
    }

    wp_localize_script( 'greenspark-wc-adapter', 'greensparkWC', [
        'currency'     => function_exists( 'get_woocommerce_currency' ) ? get_woocommerce_currency() : 'USD',
        'locale'       => substr( determine_locale(), 0, 2 ),
        'productId'    => $product_id,
        'storeApiBase' => esc_url_raw( rest_url( 'wc/store/v1' ) ),
    ] );
}

/**
 * Bootstrap: check WooCommerce, then register the frontend hook.
 */
function greenspark_wc_init(): void {
    if ( ! greenspark_wc_check_woocommerce() ) {
        return;
    }
    add_action( 'wp_enqueue_scripts', 'greenspark_wc_enqueue_scripts' );
}
add_action( 'plugins_loaded', 'greenspark_wc_init' );
