import { createWidgetPage } from '@/stories/Widgets'
import { AVAILABLE_STATISTIC_TYPES, WIDGET_COLORS, WIDGET_COLORS_EXTENDED } from '@/constants'

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
  '6kQypJppcK9F5FMGHxUM53rc3Kx%2FPFz%2Bi3wni6geNSf%2FIbUq06e5KES8IyR7bKViR11ZM5AabP'
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

    const basicVariants = [
      { version: 'v1' },
      { version: 'v2', simplified: false },
      { version: 'v2', simplified: true },
    ]

    const fullWidthIcons = ["monthsEarthPositive", "trees", "plastic", "carbon", "straws"]
    const fullWidthBannerVariants = [
      { version: 'v1', options: fullWidthIcons },
      { version: 'v2', options: fullWidthIcons },
      { version: 'v2', options: fullWidthIcons, title: 'Our positive climate impact', description: 'We joined Greenspark to ensure a positive impact on our planet and its people. Check out our impact so far and join our journey!' },
      { version: 'v2', options: fullWidthIcons, title: 'Our positive climate impact', description: 'We joined Greenspark to ensure a positive impact on our planet and its people. Check out our impact so far and join our journey!', showButton: true },
    ]

    const topStatsVariants = [
      { version: 'v1' },
      { version: 'v2' },
      { version: 'v2', withPopup: true },
    ]

    let widget: Widget
    switch (widgetType) {
      case 'byPercentage':
        widget = widgets.byPercentage(widgetArgs as ByPercentageWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)

      case 'cart':
        widget = widgets.cart(widgetArgs as CartWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)

      case 'fullWidthBanner':
        widget = widgets.fullWidthBanner(widgetArgs as FullWidthBannerWidgetParams)
        return createWidgetPage(widgetType, widget, ['default'], fullWidthBannerVariants)

      case 'perOrder':
        widget = widgets.perOrder(widgetArgs as PerOrderWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)

      case 'perProduct':
        widget = widgets.perProduct(widgetArgs as PerProductWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)

      case 'spendLevel':
        widget = widgets.spendLevel(widgetArgs as SpendLevelWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)

      case 'tieredSpendLevel':
        widget = widgets.tieredSpendLevel(widgetArgs as TieredSpendLevelWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)

      case 'topStats':
        widget = widgets.topStats(widgetArgs as TopStatsWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS_EXTENDED, topStatsVariants)

      default:
        widget = widgets.byPercentage(widgetArgs as ByPercentageWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)
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
        options: WIDGET_COLORS,
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
          options: WIDGET_COLORS,
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
        options: WIDGET_COLORS,
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
        options: WIDGET_COLORS,
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
        options: WIDGET_COLORS,
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
        options: WIDGET_COLORS,
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
        options: WIDGET_COLORS_EXTENDED,
        withPopup: { control: 'boolean' },
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
