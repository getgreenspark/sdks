import { createWidgetPage } from '@/stories/Widgets'
import {
  AVAILABLE_LOCALES,
  AVAILABLE_STATISTIC_TYPES,
  DEFAULT_LOCALE,
  IMPACT_TYPES,
  WIDGET_COLORS,
} from '@/constants'
import type { StoryObj, Meta } from '@storybook/html'
import type {
  ByPercentageOfRevenueWidgetParams,
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
import { STORE_USERS as USERS } from '@/stories/users'

type WIDGET_VARIANTS =
  | 'byPercentage'
  | 'byPercentageOfRevenue'
  | 'cart'
  | 'fullWidthBanner'
  | 'perOrder'
  | 'perProduct'
  | 'spendLevel'
  | 'tieredSpendLevel'
  | 'topStats'

const meta = {
  title: 'Widget SDK/Store Widgets',
  tags: ['autodocs'],
  render: (args) => {
    const { apiKey, integrationSlug, widgetType, widgetArgs, locale, user } = args

    const widgets = new GreensparkWidgets({
      apiKey: apiKey || USERS[user].apiKey,
      integrationSlug: integrationSlug || USERS[user].integrationSlug,
      locale,
    })

    const basicVariants = [
      { version: '', style: 'default', withPopup: false },
      { version: '', style: 'default', withPopup: true },
      { version: 'v2', style: 'default', withPopup: false },
      { version: 'v2', style: 'default', withPopup: true, popupTheme: 'dark' },
      { version: 'v2', style: 'simplified', withPopup: true, popupTheme: 'light' },
    ]

    const fullWidthIcons = [
      'monthsEarthPositive',
      ...IMPACT_TYPES,
      'straws',
      'miles',
      'footballPitches',
    ]
    const fullWidthBannerVariants = [
      { options: fullWidthIcons },
      { version: 'v2', options: fullWidthIcons },
      {
        version: 'v2',
        options: fullWidthIcons,
        title: 'Our positive climate impact',
        description:
          'We joined Greenspark to ensure a positive impact on our planet and its people. Check out our impact so far and join our journey!',
      },
      {
        version: 'v2',
        options: fullWidthIcons,
        title: 'Our positive climate impact',
        description:
          'We joined Greenspark to ensure a positive impact on our planet and its people. Check out our impact so far and join our journey!',
        callToActionUrl: 'some.url.com',
      },
    ]

    const topStatsVariants = [
      { withPopup: true },
      { version: 'v2', withPopup: false },
      { version: 'v2', withPopup: true },
      { version: 'v2', withPopup: true, popupTheme: 'dark' },
    ]

    const newVariants = [
      { version: 'v2', style: 'default', withPopup: true },
      { version: 'v2', style: 'simplified', withPopup: true },
    ]

    let widget: Widget
    switch (widgetType) {
      case 'byPercentage':
        widget = widgets.byPercentage(widgetArgs as ByPercentageWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)

      case 'byPercentageOfRevenue':
        widget = widgets.byPercentageOfRevenue(widgetArgs as ByPercentageOfRevenueWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, newVariants)

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
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, topStatsVariants)

      default:
        widget = widgets.byPercentage(widgetArgs as ByPercentageWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, basicVariants)
    }
  },
  argTypes: {
    user: {
      control: { type: 'select' },
      options: Object.keys(USERS),
    },
    locale: {
      control: { type: 'select' },
      options: AVAILABLE_LOCALES,
    },
    apiKey: {
      control: 'text',
      name: 'API Key (overwrite the test user apiKey)',
      description: 'overwrite the test user apiKey',
    },
    integrationSlug: {
      control: 'text',
      name: 'Integration Slug (overwrite the test user integrationSlug)',
      description: 'overwrite the test user integrationSlug',
    },
  },
  args: {
    user: 'SINGULAR',
    locale: DEFAULT_LOCALE,
    apiKey: '',
    integrationSlug: '',
  },
} satisfies Meta<
  GreensparkWidgets & {
    widgetType: WIDGET_VARIANTS
    widgetArgs: unknown
    locale: (typeof AVAILABLE_LOCALES)[number]
    user: keyof typeof USERS
  }
>

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

export const ByPercentageOfRevenue: StoryObj<{
  widgetArgs: ByPercentageOfRevenueWidgetParams
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
    widgetType: 'byPercentageOfRevenue',
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
          lineItems: [{ productId: '1234', quantity: 0 }],
          currency: 'EUR',
          totalPrice: 1,
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
      textColor: '#FFF',
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
      productId: undefined,
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
      },
      withPopup: { control: 'boolean' },
      impactTypes: {
        control: { type: 'select' },
        options: IMPACT_TYPES.filter,
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
