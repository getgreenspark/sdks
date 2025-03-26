import { createWidgetPage } from '@/stories/Widgets'
import { AVAILABLE_LOCALES, DEFAULT_LOCALE, POPUP_THEMES, WIDGET_COLORS } from '@/constants'
import type { StoryObj, Meta } from '@storybook/html'
import type {
  ByPercentageWidgetParams,
  ByPercentageOfRevenueWidgetParams,
  PerPurchaseWidgetParams,
  SpendLevelWidgetParams,
  TieredSpendLevelWidgetParams,
  WidgetParams,
} from '@/interfaces'
import GreensparkWidgets from '@/index'
import type { Widget } from '@/widgets/base'
import { BILLING_USERS as USERS } from '@/stories/users'

type WIDGET_VARIANTS =
  | 'byPercentage'
  | 'byPercentageOfRevenue'
  | 'perPurchase'
  | 'spendLevel'
  | 'tieredSpendLevel'

const meta = {
  title: 'Widget SDK/Billing Widgets',
  tags: ['autodocs'],
  render: (args) => {
    const { apiKey, integrationSlug, widgetType, widgetArgs, locale, user } = args

    const widgets = new GreensparkWidgets({
      apiKey: apiKey || USERS[user].apiKey,
      integrationSlug: integrationSlug || USERS[user].integrationSlug,
      locale,
    })

    const variants = [
      { version: 'v2', style: 'default' },
      { version: 'v2', style: 'simplified' },
    ]

    let widget: Widget
    switch (widgetType) {
      case 'byPercentage':
        widget = widgets.byPercentage(widgetArgs as ByPercentageWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, variants)

      case 'byPercentageOfRevenue':
        widget = widgets.byPercentageOfRevenue(widgetArgs as ByPercentageOfRevenueWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, variants)

      case 'perPurchase':
        widget = widgets.perPurchase(widgetArgs as PerPurchaseWidgetParams & Required<WidgetParams>)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, variants)

      case 'spendLevel':
        widget = widgets.spendLevel(widgetArgs as SpendLevelWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, variants)

      case 'tieredSpendLevel':
        widget = widgets.tieredSpendLevel(widgetArgs as TieredSpendLevelWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, variants)

      default:
        widget = widgets.byPercentage(widgetArgs as ByPercentageWidgetParams)
        return createWidgetPage(widgetType, widget, WIDGET_COLORS, variants)
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
      popupTheme: {
        control: { type: 'select' },
        options: POPUP_THEMES,
      },
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
      popupTheme: {
        control: { type: 'select' },
        options: POPUP_THEMES,
      },
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

export const PerPurchase: StoryObj<{
  widgetArgs: PerPurchaseWidgetParams
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {
    widgetArgs: {
      withPopup: { control: 'boolean' },
      popupTheme: {
        control: { type: 'select' },
        options: POPUP_THEMES,
      },
      currency: { control: 'text' },
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
    widgetType: 'perPurchase',
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
      popupTheme: {
        control: { type: 'select' },
        options: POPUP_THEMES,
      },
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
      popupTheme: {
        control: { type: 'select' },
        options: POPUP_THEMES,
      },
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
