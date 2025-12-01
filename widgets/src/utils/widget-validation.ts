import {
  IMPACT_TYPES,
  POPUP_THEMES,
  STATIC_WIDGET_STYLES,
  WIDGET_COLORS,
  WIDGET_STYLES,
} from '@/constants'
import type {
  OrderProduct,
  PopupTheme,
  StaticWidgetStyle,
  StoreOrder,
  WidgetColor,
  WidgetStyle,
} from '@/interfaces'

/**
 * Base class providing static validation utility methods
 */
export class ValidationUtils {
  /**
   * Hex color validation
   * Validates that a string is a valid hex color (e.g., #FF0000, #fff, #123456)
   */
  protected static isValidHexColor(color: string): boolean {
    if (typeof color !== 'string') {
      return false
    }
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
  }

  /**
   * URL validation
   * Validates that a string is a valid URL
   */
  protected static isValidUrl(url: string): boolean {
    if (typeof url !== 'string') {
      return false
    }
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Validates that a value is a non-empty string
   */
  protected static isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0
  }

  /**
   * Validates that a value is a string or number
   */
  protected static isStringOrNumber(value: unknown): value is string | number {
    return typeof value === 'string' || typeof value === 'number'
  }

  /**
   * ISO 4217 currency code validation
   * Validates that a string is a valid 3-letter ISO 4217 currency code
   */
  protected static isValidCurrencyCode(currency: string): boolean {
    if (typeof currency !== 'string' || currency.length !== 3) {
      return false
    }
    // ISO 4217 codes are 3 uppercase letters
    return /^[A-Z]{3}$/.test(currency.toUpperCase())
  }
}

/**
 * Widget Validator class using builder pattern
 * Extends ValidationUtils to inherit static validation utility methods
 */
export class WidgetValidator extends ValidationUtils {
  private widgetName: string
  private errors: string[] = []

  constructor(widgetName: string) {
    super()
    this.widgetName = widgetName
  }

  /**
   * Static factory method to create a new validator
   */
  static for(widgetName: string): WidgetValidator {
    return new WidgetValidator(widgetName)
  }

  /**
   * Validates widget color
   */
  color(color: WidgetColor): this {
    if (!WIDGET_COLORS.includes(color)) {
      this.errors.push(
        `"${color}" was selected as the color for the ${this.widgetName}, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(', ')}`,
      )
    }
    return this
  }

  /**
   * Validates withPopup boolean
   */
  withPopup(withPopup: unknown): this {
    if (withPopup !== undefined && typeof withPopup !== 'boolean') {
      this.errors.push(`"withPopup" must be a boolean value for the ${this.widgetName}.`)
    }
    return this
  }

  /**
   * Validates popupTheme enum
   * API: @IsOptional() @IsString() @IsNotEmpty() @IsIn(WIDGET_POPUP_THEMES)
   */
  popupTheme(popupTheme: unknown): this {
    if (popupTheme !== undefined) {
      if (!ValidationUtils.isNonEmptyString(popupTheme)) {
        this.errors.push(`"popupTheme" must be a non-empty string for the ${this.widgetName}.`)
        return this
      }
      if (!POPUP_THEMES.includes(popupTheme as PopupTheme)) {
        this.errors.push(
          `"${popupTheme}" was selected as the popup theme for the ${this.widgetName}, but this theme is not available. Please use one of the available themes: ${POPUP_THEMES.join(', ')}`,
        )
      }
    }
    return this
  }

  /**
   * Validates widget style enum
   */
  style(style: unknown): this {
    if (style !== undefined && !WIDGET_STYLES.includes(style as WidgetStyle)) {
      this.errors.push(
        `"${style}" was selected as the style for the ${this.widgetName}, but this style is not available. Please use one of the available styles: ${WIDGET_STYLES.join(', ')}`,
      )
    }
    return this
  }

  /**
   * Validates static widget style enum
   */
  staticStyle(style: unknown): this {
    if (style !== undefined && !STATIC_WIDGET_STYLES.includes(style as StaticWidgetStyle)) {
      this.errors.push(
        `"${style}" was selected as the style for the ${this.widgetName}, but this style is not available. Please use one of the available styles: ${STATIC_WIDGET_STYLES.join(', ')}`,
      )
    }
    return this
  }

  /**
   * Validates currency code (ISO 4217)
   */
  currency(currency: unknown): this {
    if (typeof currency !== 'string') {
      this.errors.push(
        `"${currency}" was selected as the currency for the ${this.widgetName}, but this currency is not available. Please use a valid currency code like "USD", "GBP" and "EUR".`,
      )
      return this
    }

    if (!ValidationUtils.isValidCurrencyCode(currency)) {
      this.errors.push(
        `"${currency}" is not a valid ISO 4217 currency code for the ${this.widgetName}. Please use a valid 3-letter currency code like "USD", "GBP" or "EUR".`,
      )
    }
    return this
  }

  /**
   * Validates productId (string or number)
   * API: @IsOptional() @Validate(IsStringOrNumber) @Type(() => String)
   */
  productId(productId: unknown): this {
    if (productId !== undefined && productId !== null && productId !== '') {
      if (!ValidationUtils.isStringOrNumber(productId)) {
        this.errors.push(
          `"${productId}" was selected as the product for the ${this.widgetName}, but this product ID is not valid. Please use a valid string or number.`,
        )
      }
    }
    return this
  }

  /**
   * Validates widgetId (required, non-empty string)
   */
  widgetId(widgetId: unknown): this {
    if (!ValidationUtils.isNonEmptyString(widgetId)) {
      this.errors.push(
        `"widgetId" is required and must be a non-empty string for the ${this.widgetName}.`,
      )
    }
    return this
  }

  /**
   * Validates impactTypes array
   */
  impactTypes(impactTypes: unknown): this {
    if (impactTypes !== undefined) {
      if (!Array.isArray(impactTypes)) {
        this.errors.push(`"impactTypes" must be an array for the ${this.widgetName}.`)
        return this
      }

      if (impactTypes.length === 0) {
        this.errors.push(
          `"impactTypes" array cannot be empty for the ${this.widgetName}. If provided, it must contain at least one impact type.`,
        )
        return this
      }

      if (impactTypes.some((s) => !IMPACT_TYPES.includes(s))) {
        this.errors.push(
          `"${impactTypes}" is not a valid list for the displayed values of the ${this.widgetName}. Please use only the available types: ${IMPACT_TYPES.join(', ')}`,
        )
      }
    }
    return this
  }

  /**
   * Validates order object structure
   */
  order(order: unknown): this {
    if (typeof order !== 'object' || order === null || Array.isArray(order)) {
      this.errors.push(`"order" must be an object for the ${this.widgetName}.`)
      return this
    }

    const orderObj = order as StoreOrder

    // Validate currency
    if (typeof orderObj.currency !== 'string') {
      this.errors.push(
        `"${orderObj.currency}" was selected as the currency for the ${this.widgetName}, but this currency is not available. Please use a valid currency code like "USD", "GBP" and "EUR".`,
      )
    } else if (!ValidationUtils.isValidCurrencyCode(orderObj.currency)) {
      this.errors.push(
        `"${orderObj.currency}" is not a valid ISO 4217 currency code for the ${this.widgetName}. Please use a valid 3-letter currency code like "USD", "GBP" or "EUR".`,
      )
    }

    // Validate totalPrice
    if (typeof orderObj.totalPrice !== 'number' || Number.isNaN(orderObj.totalPrice) || orderObj.totalPrice < 0) {
      this.errors.push(
        `The order's totalPrice must be a valid non-negative number for the ${this.widgetName}, but received: ${orderObj.totalPrice}`,
      )
    }

    // Validate lineItems
    if (!Array.isArray(orderObj.lineItems)) {
      this.errors.push(
        `The order's lineItems must be a valid array for the ${this.widgetName}, but received: ${typeof orderObj.lineItems}`,
      )
    } else {
      const isValidProduct = (p: OrderProduct): boolean => {
        if (!p.productId || !ValidationUtils.isStringOrNumber(p.productId)) return false
        if (Number.isNaN(Number(p.quantity)) || p.quantity < 0) return false
        return true
      }

      if (!orderObj.lineItems.every(isValidProduct)) {
        this.errors.push(
          `The values provided to the ${this.widgetName} as 'lineItems' are not valid products with a 'productId'(string or number) and a 'quantity'(number).`,
        )
      }

      if (orderObj.lineItems.length === 0) {
        this.errors.push(`"order.lineItems" must not be empty for the ${this.widgetName}.`)
      }
    }

    // Validate order.withPopup
    if (orderObj.withPopup !== undefined && typeof orderObj.withPopup !== 'boolean') {
      this.errors.push(`"order.withPopup" must be a boolean value for the ${this.widgetName}.`)
    }

    return this
  }

  /**
   * Validates full-width banner specific fields
   * API: GetFullWidthBannerRequestBody & GetFullWidthBannerV2RequestBody
   */
  fullWidthBanner(
    options: unknown,
    imageUrl?: unknown,
    title?: unknown,
    description?: unknown,
    callToActionUrl?: unknown,
    textColor?: unknown,
    buttonBackgroundColor?: unknown,
    buttonTextColor?: unknown,
  ): this {
    const FULL_WIDTH_OPTIONS = [
      ...IMPACT_TYPES,
      'monthsEarthPositive',
      'straws',
      'miles',
      'footballPitches',
    ] as const

    // options - Required, array, not empty, each in FULL_WIDTH_OPTIONS
    // API: @IsDefined() @IsArray() @ArrayNotEmpty() @IsIn(FULL_WIDTH_OPTIONS, {each: true})
    if (!Array.isArray(options)) {
      this.errors.push(`"options" is required and must be an array for the ${this.widgetName}.`)
      return this
    }

    if (options.length === 0) {
      this.errors.push(
        `"options" array cannot be empty for the ${this.widgetName}. It must contain at least one option.`,
      )
      return this
    }

    options.forEach((option) => {
      if (typeof option !== 'string' || !FULL_WIDTH_OPTIONS.includes(option as typeof FULL_WIDTH_OPTIONS[number])) {
        this.errors.push(
          `"${option}" was provided as an option for the ${this.widgetName}, but this is not a valid option. Please use values from the following list: ${FULL_WIDTH_OPTIONS.join(', ')}`,
        )
      }
    })

    // imageUrl - Optional, string
    // API: @IsOptional() @IsString()
    if (imageUrl !== undefined && imageUrl !== null) {
      if (typeof imageUrl !== 'string') {
        this.errors.push(
          `"${imageUrl}" was set as the background image for the ${this.widgetName}, but this is not a valid value. Please use a valid string.`,
        )
      }
    }

    // title - Optional, string
    // API: @IsOptional() @IsString()
    if (title !== undefined && title !== null) {
      if (typeof title !== 'string') {
        this.errors.push(`"title" must be a string for the ${this.widgetName}.`)
      }
    }

    // description - Optional, string
    // API: @IsOptional() @IsString()
    if (description !== undefined && description !== null) {
      if (typeof description !== 'string') {
        this.errors.push(`"description" must be a string for the ${this.widgetName}.`)
      }
    }

    // callToActionUrl - Optional, string
    // API: @IsOptional() @IsString()
    if (callToActionUrl !== undefined && callToActionUrl !== null) {
      if (typeof callToActionUrl !== 'string') {
        this.errors.push(`"callToActionUrl" must be a string for the ${this.widgetName}.`)
      }
    }

    // textColor - Optional, hex color
    // API: @IsOptional() @IsHexColor()
    if (textColor !== undefined && textColor !== null) {
      if (typeof textColor !== 'string') {
        this.errors.push(`"textColor" must be a string for the ${this.widgetName}.`)
      } else if (!ValidationUtils.isValidHexColor(textColor)) {
        this.errors.push(
          `"${textColor}" is not a valid hex color for the ${this.widgetName}. Please use a valid hex color (e.g., #FF0000 or #fff).`,
        )
      }
    }

    // buttonBackgroundColor - Optional, hex color
    // API: @IsOptional() @IsHexColor()
    if (buttonBackgroundColor !== undefined && buttonBackgroundColor !== null) {
      if (typeof buttonBackgroundColor !== 'string') {
        this.errors.push(`"buttonBackgroundColor" must be a string for the ${this.widgetName}.`)
      } else if (!ValidationUtils.isValidHexColor(buttonBackgroundColor)) {
        this.errors.push(
          `"${buttonBackgroundColor}" is not a valid hex color for the ${this.widgetName}. Please use a valid hex color (e.g., #FF0000 or #fff).`,
        )
      }
    }

    // buttonTextColor - Optional, hex color
    // API: @IsOptional() @IsHexColor()
    if (buttonTextColor !== undefined && buttonTextColor !== null) {
      if (typeof buttonTextColor !== 'string') {
        this.errors.push(`"buttonTextColor" must be a string for the ${this.widgetName}.`)
      } else if (!ValidationUtils.isValidHexColor(buttonTextColor)) {
        this.errors.push(
          `"${buttonTextColor}" is not a valid hex color for the ${this.widgetName}. Please use a valid hex color (e.g., #FF0000 or #fff).`,
        )
      }
    }

    return this
  }

  /**
   * Throws an error if any validation failed, otherwise returns true
   */
  validate(): boolean {
    if (this.errors.length > 0) {
      throw new Error(`Greenspark - ${this.errors.join(' ')}`)
    }
    return true
  }
}
