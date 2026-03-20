import type { ShopifyCart } from './interfaces'
import { EnumToWidgetTypeMap } from './interfaces'
import { type GreensparkCartWidgetKey } from './global.d'

const scriptSrc = document.currentScript?.getAttribute('src')
const isDevStore = window.location.hostname.includes('greenspark-development-store')
const widgetUrl = isDevStore
  ? 'https://cdn.getgreenspark.com/scripts/widgets%402.5.0.js'
  : 'https://cdn.getgreenspark.com/scripts/widgets%40latest.js'
const popupHistory: HTMLElement[] = []

const MAX_RETRIES = 5
const SELECTORS = {
  cartDrawerForm: '#CartDrawer-Form',
  cartDrawer: '#CartDrawer',
  cartDrawerSection: '[data-section-type="cart-drawer"]',
  miniCartForm: '#mini-cart-form',
  miniCart: '#mini-cart',
  mainCartItems: '#main-cart-items',
  mainCart: '#main-cart',
  interactiveCart: 'interactive-cart',
  cartItemsForm: 'cart-items[form-id]',
  cartDrawerElement: 'cart-drawer',
} as const
let retryCount = 0
let cartDrawerRetryCount = 0
let cartDrawerObserverInitialized = false
let cartDrawerObserver: MutationObserver | null = null
let cartDrawerDebounceTimer: number | null = null

function setupCartDrawerObserver() {
  if (cartDrawerObserverInitialized) return

  const drawerEl = document.querySelector(
    [
      SELECTORS.cartDrawerElement,
      SELECTORS.cartDrawer,
      SELECTORS.cartDrawerSection,
      SELECTORS.miniCart,
    ].join(', '),
  )
  if (!drawerEl) {
    if (cartDrawerRetryCount++ >= MAX_RETRIES) {
      cartDrawerObserverInitialized = true
      console.warn(
        'Greenspark Widget - Cart drawer not found after max retries; stopping observer setup',
      )
      return
    }
    window.setTimeout(() => {
      if (!cartDrawerObserverInitialized) setupCartDrawerObserver()
    }, 400)
    return
  }

  try {
    const drawer = drawerEl as Element

    cartDrawerObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue
        if (cartDrawerDebounceTimer) window.clearTimeout(cartDrawerDebounceTimer)

        cartDrawerDebounceTimer = window.setTimeout(() => {
          const hasWidgetInstance = Boolean(drawer.querySelector('.greenspark-widget-instance'))
          const hasWidgetTarget = Boolean(drawer.querySelector('.greenspark-widget-target'))

          if (!hasWidgetInstance && hasWidgetTarget) {
            runGreenspark()
          }
        }, 120)
        break
      }
    })

    cartDrawerObserver.observe(drawerEl, { childList: true, subtree: true })
    cartDrawerObserverInitialized = true
    cartDrawerRetryCount = 0
  } catch (err) {
    console.warn('Greenspark Widget - Failed to attach cart drawer observer', err)
  }
}

function parseCart(cart: ShopifyCart) {
  const lineItems = cart.items.map((item) => ({
    productId: item.product_id.toString(),
    quantity: item.quantity,
  }))
  const { currency } = cart
  const totalPrice = cart.total_price
  return {
    lineItems,
    currency,
    totalPrice,
  }
}

function runGreenspark() {
  if (!scriptSrc) return

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGreenspark, { once: true })
  }

  setupCartDrawerObserver()

  if (!window.GreensparkWidgets) {
    if (retryCount++ >= MAX_RETRIES) {
      console.error('Greenspark Widget - Failed to load after max retries')
      return
    }
    console.warn('Greenspark Widget - GreensparkWidgets not available yet, waiting 50ms')
    setTimeout(runGreenspark, 50)
    return
  }

  retryCount = 0 // reset on success

  const useShadowDom = false
  const version = 'v2'

  const currency = window.Shopify.currency.active
  const productId = String(window?.ShopifyAnalytics?.meta?.product?.id ?? '')
  const locale = window.Shopify.locale as 'en'
  const shopUniqueName = window.Shopify.shop

  const previewOrderFallback = (): ReturnType<typeof parseCart> => ({
    lineItems: [{ productId: productId || '1', quantity: 1 }],
    currency: String(currency ?? 'USD').toLowerCase(),
    totalPrice: 10000,
  })
  const greenspark = new window.GreensparkWidgets({
    locale,
    integrationSlug: shopUniqueName,
    isShopifyIntegration: true,
  })
  const isDevStore = shopUniqueName.includes('greenspark-development-store');
  const greensparkApiUrl = isDevStore ? 'https://dev-api.getmads.com' : 'https://api.getgreenspark.com'

  function captureEvent(event: unknown): Promise<Response> {
    return fetch(`${greensparkApiUrl}/v2/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ integrationSlug: shopUniqueName, scope: 'CUSTOMER_CART_CONTRIBUTION_WIDGET', type: 'ERROR', event }),
    })
  }

  const CART_ENDPOINTS = {
    get: '/cart.js',
    add: '/cart/add.js',
    update: '/cart/update.js',
  }

  function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    return fetch(url, options).then((response) => {
      if (!response.ok) return Promise.reject(response)
      return response.json() as Promise<T>
    })
  }

  function getCart(): Promise<ShopifyCart> {
    return fetchJSON<ShopifyCart>(CART_ENDPOINTS.get)
  }

  function addItemToCart(targetProductId: string, quantity = 1): Promise<unknown> {
    return fetchJSON(CART_ENDPOINTS.add, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: [{ id: parseInt(targetProductId, 10), quantity }] }),
    }).catch(error =>{
      error.json().then((jsonError: unknown) => {
        captureEvent(jsonError)
      })
      return Promise.reject(error);
    });
  }

  function updateCart(updates: Record<string, number>): Promise<Response> {
    return fetch(CART_ENDPOINTS.update, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ updates }),
    })
  }

  const getWidgetContainer = (widgetId: string): string => {
    const targetId = widgetId.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
    const containerSelector = `[data-greenspark-widget-container-for="${targetId}"]`
    const target = document.getElementById(widgetId)
    if (!target) return containerSelector
    const el = target.querySelector(containerSelector) as HTMLElement | null
    if (!el) {
      target.querySelectorAll('.greenspark-widget-instance').forEach((e) => e.remove())
      target.insertAdjacentHTML(
        'afterbegin',
        `<div class="greenspark-widget-instance" data-greenspark-widget-container-for="${targetId}"></div>`,
      )
    }
    return containerSelector
  }

  const movePopupToBody = (widgetId: string) => {
    popupHistory.forEach((outdatedPopup) => {
      outdatedPopup.innerHTML = ''
      outdatedPopup.style.display = 'none'
    })

    const parent = document.getElementById(widgetId)
    const popup = parent?.querySelector<HTMLElement>('div[class^="gs-popup-"]')
    if (popup) {
      document.body.append(popup)
      popupHistory.push(popup)
    }
  }

  /** Theme editor: show callout + GS_PREVIEW when ById fails with “missing automation” 400s. */
  type AxiosLikeError = { response?: { status?: number; data?: unknown } }
  const MISSING_AUTOMATION_CODES: ReadonlySet<string> = new Set([
    'NO_PER_PRODUCT_SETTINGS',
    'NO_PER_PAID_INVOICE_SETTINGS',
    'NO_PER_ORDER_SETTINGS',
    'NO_BY_PERCENTAGE_SETTINGS',
    'NO_BY_PERCENTAGE_OF_REVENUE_SETTINGS',
    'NO_SPEND_LEVEL_SETTINGS',
    'NO_TIERED_SPEND_LEVEL_SETTINGS',
    'NO_ORDER_IMPACTS',
  ])
  const PREVIEW_WIDGET_COLOR = 'green'
  const PREVIEW_WIDGET_STYLE = 'default'
  const PREVIEW_POPUP_THEME = 'light' as const

  function isShopifyThemeEditor(): boolean {
    return Boolean(
      (window as unknown as { Shopify?: { designMode?: boolean } }).Shopify?.designMode,
    )
  }

  function normalizeAxiosErrorData(data: unknown): string {
    if (typeof data === 'string') {
      try {
        const parsed: unknown = JSON.parse(data)
        if (typeof parsed === 'string') return parsed
      } catch {
        return data
      }
      return data
    }
    if (data == null) return ''
    return String(data)
  }

  function isMissingAutomationError(e: unknown): boolean {
    const err = e as AxiosLikeError
    if (err.response?.status !== 400) return false
    return MISSING_AUTOMATION_CODES.has(normalizeAxiosErrorData(err.response.data))
  }

  /** Stacks disclaimer above preview; outer column survives flex-row parents on the mount node. */
  function editorPreviewShellHtml(innerId: string): string {
    return (
      '<div class="greenspark-theme-editor-preview-shell" style="display:flex;flex-direction:column;width:100%;align-items:stretch;box-sizing:border-box;">' +
      '<div class="greenspark-theme-editor-callout" style="padding:12px;margin-bottom:12px;background:#FFF8E6;border:1px solid #E3B765;border-radius:6px;font-size:14px;line-height:1.4;color:#222;">' +
      'You need to have a matching automation before real widget appears on your live storefront' +
      '</div>' +
      `<div id="${innerId}"></div>` +
      '</div>'
    )
  }

  type GreensparkClient = InstanceType<NonNullable<typeof window.GreensparkWidgets>>

  function tryEditorPreviewForByIdFailure(
    widgetId: string,
    _merchantLabel: string,
    e: unknown,
    renderPreview: (client: GreensparkClient, containerSelector: string) => Promise<unknown>,
  ): void {
    const err = e as AxiosLikeError
    if (!err.response) {
      console.error('Greenspark Widget - ', e)
      return
    }
    if (!isShopifyThemeEditor() || !isMissingAutomationError(e)) {
      console.error('Greenspark Widget - ', e)
      return
    }
    const mount = document.getElementById(widgetId)
    if (!mount) return
    const safe = widgetId.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
    const innerId = `gs-editor-preview-${safe}`
    mount.innerHTML = editorPreviewShellHtml(innerId)
    const previewClient = new window.GreensparkWidgets({
      locale,
      integrationSlug: 'GS_PREVIEW',
      isShopifyIntegration: true,
    })
    void renderPreview(previewClient, `#${innerId}`)
      .then(() => movePopupToBody(widgetId))
      .catch((e2: unknown) => console.error('Greenspark preview failed', e2))
  }

  function tryEditorCartImpactPreview(widgetId: string, e: unknown): void {
    const po = previewOrderFallback()
    tryEditorPreviewForByIdFailure(widgetId, 'Greenspark cart impact widget', e, (c, sel) =>
      c
        .cart({
          color: PREVIEW_WIDGET_COLOR,
          containerSelector: sel,
          useShadowDom,
          style: PREVIEW_WIDGET_STYLE,
          withPopup: true,
          popupTheme: PREVIEW_POPUP_THEME,
          order: po,
          version,
        })
        .render({ order: po }, sel),
    )
  }

  function maybeMountEmptyCartEditorPreview(widgetId: string): void {
    if (!isShopifyThemeEditor()) return
    const mount = document.getElementById(widgetId)
    if (!mount) return
    const po = previewOrderFallback()
    const safe = widgetId.replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
    const innerId = `gs-editor-preview-cart-empty-${safe}`
    mount.innerHTML = editorPreviewShellHtml(innerId)
    const previewClient = new window.GreensparkWidgets({
      locale,
      integrationSlug: 'GS_PREVIEW',
      isShopifyIntegration: true,
    })
    void previewClient
      .cart({
        color: PREVIEW_WIDGET_COLOR,
        containerSelector: `#${innerId}`,
        useShadowDom,
        style: PREVIEW_WIDGET_STYLE,
        withPopup: true,
        popupTheme: PREVIEW_POPUP_THEME,
        order: po,
        version,
      })
      .render({ order: po }, `#${innerId}`)
      .then(() => movePopupToBody(widgetId))
      .catch((e2: unknown) => console.error('Greenspark preview failed', e2))
  }

  const renderOrderImpacts = (widgetId: string, containerSelector: string) => {
    const targetEl = document.getElementById(widgetId)

    if (!targetEl) {
      return
    }

    if (!document.querySelector(containerSelector)) {
      return
    }

    const checkboxSelector = "input[name='customerCartContribution']"
    const getCheckbox = () => document.querySelector<HTMLInputElement>(checkboxSelector)
    const prevChecked = getCheckbox() ? getCheckbox()!.checked : undefined
    const cartWidgetWindowKey = `greensparkCartWidget-${widgetId}` as GreensparkCartWidgetKey

    const ensureHandlers = () => {
      const WIDGET_PRESELECT_OPT_OUT_KEY = 'greenspark-preselect-optout'

      const isWidgetPreselectOptedOut = (): boolean => {
        try {
          return localStorage.getItem(WIDGET_PRESELECT_OPT_OUT_KEY) === '1'
        } catch {
          return false
        }
      }
      const setWidgetPreselectOptOut = () => localStorage.setItem(WIDGET_PRESELECT_OPT_OUT_KEY, '1')
      const clearWidgetPreselectOptOut = () => localStorage.removeItem(WIDGET_PRESELECT_OPT_OUT_KEY)

      const updateCheckboxState = (checkbox: HTMLInputElement, productId: string) => {
        getCart()
          .then((cart) => {
            const matchingItem = cart.items.find((item) => String(item.id) === productId)
            checkbox.checked = Boolean(matchingItem)
          })
          .catch((err) => console.error('Greenspark Widget - Error checking cart state:', err))
      }

      const bindCheckbox = () => {
        if (window._greensparkCheckboxHandlerBound) return
        window._greensparkCheckboxHandlerBound = true
        document.addEventListener('change', (e) => {
          const checkbox = (e.target as HTMLElement)?.closest<HTMLInputElement>(
            "input[name='customerCartContribution']",
          )
          if (!checkbox) return
          const productId = checkbox.getAttribute('data-greenspark-product-external-id')
          const PREVIEW_EXTERNAL_ID = 'PREVIEW_EXTERNAL_ID'

          const isPreviewProduct = productId === PREVIEW_EXTERNAL_ID
          if (!productId || isPreviewProduct) return

          if (checkbox.checked) {
            clearWidgetPreselectOptOut()

            getCart()
              .then((cart) => {
                if (cart.items.find((item) => String(item.id) === productId)) return
                return addItemToCart(productId, 1).then(() => refreshCartDrawer())
              })
              .catch((err) => console.error('Greenspark Widget - add error', err))
          } else {
            setWidgetPreselectOptOut()

            getCart()
              .then((cart) => {
                if (!cart.items.find((item) => String(item.id) === productId)) return
                const updates: Record<string, number> = {}
                updates[productId] = 0
                return updateCart(updates)
              })
              .then((response) => {
                if (response && (response as Response).ok) refreshCartDrawer()
              })
              .catch((err) => console.error('Greenspark Widget - remove error', err))
          }
        })
      }

      const bindRemove = () => {
        if (window._greensparkRemoveHandlerBound) return
        window._greensparkRemoveHandlerBound = true
        document.addEventListener('click', (e) => {
          const removeEl = (e.target as HTMLElement)?.closest(
            'cart-remove-button, .cart-remove-button, [data-cart-remove]',
          )
          if (!removeEl) return
          const checkbox = getCheckbox()
          if (!checkbox) return
          const productId = checkbox.getAttribute('data-greenspark-product-external-id')
          if (!productId) return
          setWidgetPreselectOptOut()
          setTimeout(() => {
            updateCheckboxState(checkbox, productId)
          }, 400)
        })
      }

      const initCheckboxState = () => {
        const checkbox = getCheckbox()
        if (!checkbox) return
        const rawProductId = checkbox.getAttribute('data-greenspark-product-external-id')
        const productId = rawProductId?.trim()
        if (!productId) return
        const PREVIEW_EXTERNAL_ID = 'PREVIEW_EXTERNAL_ID'
        const isPreviewProduct = productId === PREVIEW_EXTERNAL_ID

        const preSelectedAttr = checkbox.getAttribute('data-greenspark-widget-pre-selected')
        const isCheckboxPreSelected = preSelectedAttr === 'true'

        const shouldAttemptPreselectAdd =
          isCheckboxPreSelected &&
          !isPreviewProduct &&
          !isWidgetPreselectOptedOut() &&
          !Number.isNaN(parseInt(productId, 10))

        if (!shouldAttemptPreselectAdd) {
          getCart()
            .then((cart) => {
              checkbox.checked = cart.items.some((item) => String(item.id) === productId)
            })
            .catch((err) => {
              console.error('Greenspark Widget - getCart error', err)
            })
          return
        }

        if (!window._greensparkPreselectAddInProgress) window._greensparkPreselectAddInProgress = {}
        const preselectAddInProgressByProductId = window._greensparkPreselectAddInProgress
        if (preselectAddInProgressByProductId[productId]) return
        preselectAddInProgressByProductId[productId] = true

        getCart()
          .then((cart) => {
            const present = cart.items.some((item) => String(item.id) === productId)
            if (present) {
              checkbox.checked = true
              return
            }

            return addItemToCart(productId, 1)
              .then(() => {
                checkbox.checked = true
                refreshCartDrawer()
              })
              .catch((err) => {
                console.error('Greenspark Widget - pre-selected add error', err)
                setWidgetPreselectOptOut()
                checkbox.checked = false
              })
          })
          .catch((err) => {
            console.error('Greenspark Widget - getCart error', err)
          })
          .finally(() => {
            preselectAddInProgressByProductId[productId] = undefined
          })
      }

      bindCheckbox()
      bindRemove()
      initCheckboxState()
    }

    const refreshCartDrawer = () => {
      const root = window.Shopify?.routes?.root ?? '/'
      fetch(`${root}?sections=cart-drawer,main-cart-items,main-cart,mini-cart`)
        .then((response) => {
          if (!response.ok) return
          return response.json()
        })
        .then((sections) => {
          const parser = new DOMParser()

          const existingDrawer =
            document.querySelector(SELECTORS.cartDrawerForm) ||
            document.querySelector(SELECTORS.cartDrawer)
          if (existingDrawer && sections['cart-drawer']) {
            const newDrawerDoc = parser.parseFromString(sections['cart-drawer'], 'text/html')
            const newDrawerContent =
              newDrawerDoc.querySelector(SELECTORS.cartDrawerForm)?.innerHTML ??
              newDrawerDoc.querySelector(SELECTORS.cartDrawer)?.innerHTML
            if (newDrawerContent !== undefined) existingDrawer.innerHTML = newDrawerContent
          }

          const existingMiniCart =
            document.querySelector(SELECTORS.miniCartForm) ||
            document.querySelector(SELECTORS.miniCart)
          if (existingMiniCart && sections['mini-cart']) {
            const newMiniDoc = parser.parseFromString(sections['mini-cart'], 'text/html')
            const newMiniContent =
              newMiniDoc.querySelector(SELECTORS.miniCartForm)?.innerHTML ??
              newMiniDoc.querySelector(SELECTORS.miniCart)?.innerHTML
            if (newMiniContent !== undefined)
              (existingMiniCart as Element).innerHTML = newMiniContent
          }

          const newCartDocItems = sections['main-cart-items']
            ? parser.parseFromString(sections['main-cart-items'], 'text/html')
            : null
          const newCartDocMain = sections['main-cart']
            ? parser.parseFromString(sections['main-cart'], 'text/html')
            : null
          const newMiniCartDoc = sections['mini-cart']
            ? parser.parseFromString(sections['mini-cart'], 'text/html')
            : null

          const pageTargets = [
            {
              existing: document.querySelector(SELECTORS.mainCartItems),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.mainCartItems),
            },
            {
              existing: document.querySelector(SELECTORS.interactiveCart),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.interactiveCart),
            },
            {
              existing: document.querySelector(SELECTORS.mainCart),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.mainCart),
            },
            {
              existing: document.querySelector(SELECTORS.cartItemsForm),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.cartItemsForm),
            },
            {
              existing: document.querySelector(SELECTORS.miniCartForm),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.miniCartForm),
            },
            {
              existing: document.querySelector(SELECTORS.miniCart),
              findNew: (doc: Document | null) => doc?.querySelector(SELECTORS.miniCart),
            },
          ]

          for (const target of pageTargets) {
            if (!target.existing) continue
            const candidateNew =
              target.findNew(newCartDocItems) ||
              target.findNew(newCartDocMain) ||
              target.findNew(newMiniCartDoc)
            if (candidateNew && candidateNew.innerHTML !== undefined) {
              ;(target.existing as Element).innerHTML = candidateNew.innerHTML
              break
            }
          }
        })
        .catch((error) => {
          console.error('Greenspark Widget - Error refreshing cart UI:', error)
          location.reload()
        })
    }

    if (window[cartWidgetWindowKey]) {
      return fetch('/cart.js')
        .then((r) => r.json())
        .then((updatedCart) => {
          const order = parseCart(updatedCart)
          if (order.lineItems.length <= 0) {
            maybeMountEmptyCartEditorPreview(widgetId)
            return
          }
          containerSelector = getWidgetContainer(widgetId)
          if (!document.querySelector(containerSelector)) return
          return window[cartWidgetWindowKey]!.render({ order }, containerSelector)
            .then(() => {
              movePopupToBody(widgetId)

              if (typeof prevChecked === 'boolean') {
                const cb = getCheckbox()
                if (cb) cb.checked = prevChecked
              }
            })
            .then(ensureHandlers)
            .catch((e: unknown) => tryEditorCartImpactPreview(widgetId, e))
        })
    }

    fetch('/cart.js')
      .then((r) => {
        return r?.json()
      })
      .then((cartData) => {
        if (!cartData) return
        const order = parseCart(cartData)
        if (order.lineItems.length === 0) {
          maybeMountEmptyCartEditorPreview(widgetId)
          return
        }

        containerSelector = getWidgetContainer(widgetId)
        if (!document.querySelector(containerSelector)) return

        const widget = greenspark.cartById({
          widgetId,
          containerSelector,
          useShadowDom,
          order,
          version,
        })
        window[cartWidgetWindowKey] = widget

        return widget
          .render({ order }, containerSelector)
          .then(() => movePopupToBody(widgetId))
          .then(ensureHandlers)
          .catch((e: unknown) => tryEditorCartImpactPreview(widgetId, e))
      })
      .catch((e: unknown) => console.error('Greenspark Widget - Error fetching cart:', e))
  }

  const renderOffsetPerOrder = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.perOrderById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(widgetId, 'Greenspark per-order widget', e, (c, sel) =>
          c
            .perOrder({
              color: PREVIEW_WIDGET_COLOR,
              containerSelector: sel,
              useShadowDom,
              style: PREVIEW_WIDGET_STYLE,
              withPopup: true,
              popupTheme: PREVIEW_POPUP_THEME,
              version,
            })
            .render(),
        ),
      )
  }

  const renderOffsetByProduct = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.perProductById({
      widgetId,
      productId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(widgetId, 'Greenspark per-product widget', e, (c, sel) =>
          c
            .perProduct({
              productId: productId || '1',
              color: PREVIEW_WIDGET_COLOR,
              containerSelector: sel,
              useShadowDom,
              style: PREVIEW_WIDGET_STYLE,
              withPopup: true,
              popupTheme: PREVIEW_POPUP_THEME,
              version,
            })
            .render(),
        ),
      )
  }

  const renderOffsetBySpend = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.spendLevelById({
      widgetId,
      currency,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(widgetId, 'Greenspark spend-level widget', e, (c, sel) =>
          c
            .spendLevel({
              currency,
              color: PREVIEW_WIDGET_COLOR,
              containerSelector: sel,
              useShadowDom,
              style: PREVIEW_WIDGET_STYLE,
              withPopup: true,
              popupTheme: PREVIEW_POPUP_THEME,
              version,
            })
            .render(),
        ),
      )
  }

  const renderOffsetByStoreRevenue = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.tieredSpendLevelById({
      widgetId,
      currency,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(
          widgetId,
          'Greenspark tiered spend-level widget',
          e,
          (c, sel) =>
            c
              .tieredSpendLevel({
                currency,
                color: PREVIEW_WIDGET_COLOR,
                containerSelector: sel,
                useShadowDom,
                style: PREVIEW_WIDGET_STYLE,
                withPopup: true,
                popupTheme: PREVIEW_POPUP_THEME,
                version,
              })
              .render(),
        ),
      )
  }

  const renderByPercentage = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.byPercentageById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(widgetId, 'Greenspark by-percentage widget', e, (c, sel) =>
          c
            .byPercentage({
              color: PREVIEW_WIDGET_COLOR,
              containerSelector: sel,
              useShadowDom,
              style: PREVIEW_WIDGET_STYLE,
              withPopup: true,
              popupTheme: PREVIEW_POPUP_THEME,
              version,
            })
            .render(),
        ),
      )
  }

  const renderByPercentageOfRevenue = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.byPercentageOfRevenueById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(
          widgetId,
          'Greenspark by-percentage-of-revenue widget',
          e,
          (c, sel) =>
            c
              .byPercentageOfRevenue({
                color: PREVIEW_WIDGET_COLOR,
                containerSelector: sel,
                useShadowDom,
                style: PREVIEW_WIDGET_STYLE,
                withPopup: true,
                popupTheme: PREVIEW_POPUP_THEME,
                version,
              })
              .render(),
        ),
      )
  }

  const renderStats = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.topStatsById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(widgetId, 'Greenspark stats widget', e, (c, sel) =>
          c
            .topStats({
              color: PREVIEW_WIDGET_COLOR,
              containerSelector: sel,
              useShadowDom,
              withPopup: true,
              popupTheme: PREVIEW_POPUP_THEME,
              version,
            })
            .render(),
        ),
      )
  }

  const renderStatic = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.staticById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(widgetId, 'Greenspark static widget', e, (c, sel) =>
          c
            .static({
              color: PREVIEW_WIDGET_COLOR,
              containerSelector: sel,
              useShadowDom,
              style: PREVIEW_WIDGET_STYLE,
              version,
            })
            .render(),
        ),
      )
  }

  const renderBanner = (widgetId: string, containerSelector: string) => {
    const widget = greenspark.fullWidthBannerById({
      widgetId,
      containerSelector,
      useShadowDom,
      version,
    })

    widget
      .render()
      .then(() => movePopupToBody(widgetId))
      .catch((e: unknown) =>
        tryEditorPreviewForByIdFailure(widgetId, 'Greenspark banner widget', e, (c, sel) =>
          c
            .fullWidthBanner({
              containerSelector: sel,
              useShadowDom,
              options: ['trees', 'carbon', 'plastic'],
              version,
            })
            .render(),
        ),
      )
  }

  const targets = document.querySelectorAll('.greenspark-widget-target')

  if (!document.getElementById('greenspark-widget-style')) {
    const style = document.createElement('style')
    style.id = 'greenspark-widget-style'
    style.textContent = `
      .greenspark-widget-target {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 8px 0;
      }
    `
    document.head.appendChild(style)
  }

  targets.forEach((target) => {
    target.querySelectorAll('.greenspark-widget-instance').forEach((el) => el.remove())

    let type: string
    try {
      ;[type] = atob(target.id).split('|')
    } catch {
      console.error('Invalid widget ID encoding:', target.id)
      return
    }

    const variant = EnumToWidgetTypeMap[type]

    const containerSelector = getWidgetContainer(target.id)

    if (variant === 'orderImpacts') renderOrderImpacts(target.id, containerSelector)
    if (variant === 'offsetPerOrder') renderOffsetPerOrder(target.id, containerSelector)
    if (variant === 'offsetByProduct') renderOffsetByProduct(target.id, containerSelector)
    if (variant === 'offsetBySpend') renderOffsetBySpend(target.id, containerSelector)
    if (variant === 'offsetByStoreRevenue') renderOffsetByStoreRevenue(target.id, containerSelector)
    if (variant === 'byPercentage') renderByPercentage(target.id, containerSelector)
    if (variant === 'byPercentageOfRevenue')
      renderByPercentageOfRevenue(target.id, containerSelector)
    if (variant === 'stats') renderStats(target.id, containerSelector)
    if (variant === 'static') renderStatic(target.id, containerSelector)
    if (variant === 'banner') renderBanner(target.id, containerSelector)
  })
}

function loadScript(url: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = function () {
      resolve()
    }

    script.src = url
    const head = document.querySelector('head')

    if (head) {
      head.appendChild(script)
    }
  })
}

async function setup() {
  if (window.GreensparkWidgets) return

  if (document.readyState === 'loading') {
    return new Promise((resolve) => {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          setup().then(resolve)
        },
        { once: true },
      )
    })
  }

  try {
    await loadScript(widgetUrl)
    window.dispatchEvent(new Event('greenspark-setup'))
  } catch (error) {
    console.error('Greenspark Widget - Failed to load script:', error)
    setTimeout(() => setup(), 1000)
  }
}

setup().catch((e) => console.error('Greenspark Widget -', e))

if (!window.GreensparkWidgets) {
  window.addEventListener('greenspark-setup', runGreenspark, { once: true })
} else {
  runGreenspark()
}

;(function (context, fetch) {
  if (typeof fetch !== 'function') return

  context.fetch = function (...args: [input: URL | RequestInfo, init?: RequestInit | undefined]) {
    const response = fetch.apply(this, args)

    response
      .then((res) => {
        const url = new URL(res.url, window.location.origin)
        const pathname = url.pathname
        const isCartMutation = /\/cart\/(add|update|change|clear)(\.js)?$/.test(pathname)

        if (isCartMutation) {
          setTimeout(() => {
            runGreenspark()
          }, 300)
        }
      })
      .catch((error) => {
        console.error('Error in fetch response handling:', error)
      })

    return response
  }
})(window, window.fetch)
