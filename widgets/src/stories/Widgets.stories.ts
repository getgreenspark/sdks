import { createWidgetPage } from '@/stories/Widgets'
import { AVAILABLE_STATISTIC_TYPES, WIDGET_COLORS } from '@/constants'

import type { StoryObj, Meta } from '@storybook/html'
import type {
  ByPercentageWidgetParams,
  CartWidgetParams,
  FullWidthBannerWidgetParams,
  PerOrderWidgetParams,
  PerProductWidgetParams,
  SpendLevelWidgetParams,
  TieredSpendLevelWidgetParams,
  TopStatsWidgetParams,
} from '@/interfaces'
import GreensparkWidgets from '@/index'
import type { Widget } from '@/widgets/base'

const WIDGET_API_KEY =
  '8vCV2KQpfDz%2F3dPn1cb1vz3%2FbjkKQUb9r%2BUAbuNfkn5WFmB%2BRE7oR90hkSd1Wc4vFfeipmOB'
const SHOP_UNIQUE_NAME = 'greenspark-development-store-widget-sdk-storybook.myshopify.com'
type WIDGET_VARIANTS =
  | 'byPercentage'
  | 'cart'
  | 'fullWidthBanner'
  | 'perOrder'
  | 'perProduct'
  | 'spendLevel'
  | 'tieredSpendLevel'
  | 'topStats'

const meta = {
  title: 'Widget SDK/Widgets',
  tags: ['autodocs'],
  render: (args) => {
    const { apiKey, shopUniqueName, widgetType, widgetArgs } = args

    const widgets = new GreensparkWidgets({
      apiKey,
      shopUniqueName,
    })

    let widget: Widget
    switch (widgetType) {
      case 'byPercentage':
        widget = widgets.byPercentage(widgetArgs as ByPercentageWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS.byPercentage, ['v1', 'v2'])

      case 'cart':
        widget = widgets.cart(widgetArgs as CartWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS.cart, ['v1', 'v2'])

      case 'fullWidthBanner':
        widget = widgets.fullWidthBanner(widgetArgs as FullWidthBannerWidgetParams)
        return createWidgetPage(widgetType, widget, ['default'], ['v1'])

      case 'perOrder':
        widget = widgets.perOrder(widgetArgs as PerOrderWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS.perOrder, ['v1', 'v2'])

      case 'perProduct':
        widget = widgets.perProduct(widgetArgs as PerProductWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS.perProduct, ['v1', 'v2'])

      case 'spendLevel':
        widget = widgets.spendLevel(widgetArgs as SpendLevelWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS.spendLevel, ['v1', 'v2'])

      case 'tieredSpendLevel':
        widget = widgets.tieredSpendLevel(widgetArgs as TieredSpendLevelWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS.tieredSpendLevel, ['v1', 'v2'])

      case 'topStats':
        widget = widgets.topStats(widgetArgs as TopStatsWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS.topStats, ['v1'])

      default:
        widget = widgets.byPercentage(widgetArgs as ByPercentageWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS.byPercentage, ['v1', 'v2'])
    }

  },
  argTypes: {
    apiKey: { control: 'text' },
    shopUniqueName: { control: 'text' },
  },
  args: {
    apiKey: WIDGET_API_KEY,
    shopUniqueName: SHOP_UNIQUE_NAME,
  },
} satisfies Meta<GreensparkWidgets & { widgetType: WIDGET_VARIANTS; widgetArgs: unknown }>

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ByPercentage: StoryObj<{
  widgetArgs: ByPercentageWidgetParams
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {
    widgetArgs: {
      withPopup: { control: 'boolean' },
      color: {
        control: { type: 'select' },
        options: WIDGET_COLORS.spendLevel,
      },
    },
  },
  args: {
    widgetArgs: {
      withPopup: true,
      color: 'beige',
    },
    widgetType: 'byPercentage',
  },
}

export const Cart: StoryObj<{ widgetArgs: CartWidgetParams; widgetType: keyof GreensparkWidgets }> =
  {
    argTypes: {
      widgetArgs: {
        withPopup: { control: 'boolean' },
        color: {
          control: { type: 'select' },
          options: WIDGET_COLORS.spendLevel,
        },
        order: {
          lineItems: { control: 'text' },
          currency: { control: 'text' },
          totalPrice: { control: 'number' },
        },
      },
    },
    args: {
      widgetArgs: {
        color: 'beige',
        withPopup: true,
        order: {
          lineItems: [{ productId: '1234', quantity: 1 }],
          currency: 'EUR',
          totalPrice: 100,
        },
      },
      widgetType: 'cart',
    },
  }

export const FullWidthBanner: StoryObj<{
  widgetArgs: FullWidthBannerWidgetParams
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {
    widgetArgs: {
      imageUrl: { control: 'text' },
    },
  },
  args: {
    widgetArgs: {
      options: [...AVAILABLE_STATISTIC_TYPES],
    },
    widgetType: 'fullWidthBanner',
  },
}

export const PerOrder: StoryObj<{
  widgetArgs: PerOrderWidgetParams
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {
    widgetArgs: {
      withPopup: { control: 'boolean' },
      currency: { control: 'text' },
      color: {
        control: { type: 'select' },
        options: WIDGET_COLORS.spendLevel,
      },
    },
  },
  args: {
    widgetArgs: {
      currency: 'EUR',
      withPopup: true,
      color: 'beige',
    },
    widgetType: 'perOrder',
  },
}

export const PerProduct: StoryObj<{
  widgetArgs: PerProductWidgetParams
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {
    widgetArgs: {
      productId: { control: 'text' },
      withPopup: { control: 'boolean' },
      color: {
        control: { type: 'select' },
        options: WIDGET_COLORS.spendLevel,
      },
    },
  },
  args: {
    widgetArgs: {
      productId: '9530077774147',
      withPopup: true,
      color: 'beige',
    },
    widgetType: 'perProduct',
  },
}

export const SpendLevel: StoryObj<{
  widgetArgs: SpendLevelWidgetParams
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {
    widgetArgs: {
      currency: { control: 'text' },
      withPopup: { control: 'boolean' },
      color: {
        control: { type: 'select' },
        options: WIDGET_COLORS.spendLevel,
      },
    },
  },
  args: {
    widgetArgs: {
      currency: 'EUR',
      color: 'beige',
      withPopup: true,
    },
    widgetType: 'spendLevel',
  },
}

export const TieredSpendLevel: StoryObj<{
  widgetArgs: TieredSpendLevelWidgetParams
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {
    widgetArgs: {
      withPopup: { control: 'boolean' },
      currency: { control: 'text' },
      color: {
        control: { type: 'select' },
        options: WIDGET_COLORS.spendLevel,
      },
    },
  },
  args: {
    widgetArgs: {
      currency: 'EUR',
      withPopup: true,
      color: 'beige',
    },
    widgetType: 'tieredSpendLevel',
  },
}

export const TopStats: StoryObj<{
  widgetArgs: TopStatsWidgetParams
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {
    widgetArgs: {
      color: {
        control: { type: 'select' },
        options: WIDGET_COLORS.spendLevel,
      },
    },
  },
  args: {
    widgetArgs: {
      color: 'beige',
    },
    widgetType: 'topStats',
  },
}
