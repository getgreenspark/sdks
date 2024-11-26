import { createWidgetPage } from '@/stories/Widgets'
import { AVAILABLE_LOCALES, POPUP_THEMES, WIDGET_COLORS } from '@/constants'

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

const WIDGET_API_KEY =
  '6kQypJppcK9F5FMGHxUM53rc3Kx%2FPFz%2Bi3wni6geNSf%2FIbUq06e5KES8IyR7bKViR11ZM5AabP'
const INTEGRATION_SLUG = 'storybook-demo-stripe-54511'
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
    const { apiKey, integrationSlug, widgetType, widgetArgs, locale } = args

    const widgets = new GreensparkWidgets({
      apiKey,
      integrationSlug,
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
    apiKey: { control: 'text' },
    integrationSlug: { control: 'text' },
    locale: {
      control: { type: 'select' },
      options: AVAILABLE_LOCALES,
    },
  },
  args: {
    apiKey: WIDGET_API_KEY,
    integrationSlug: INTEGRATION_SLUG,
    locale: 'en',
  },
} satisfies Meta<
  GreensparkWidgets & {
    widgetType: WIDGET_VARIANTS
    widgetArgs: unknown
    locale: (typeof AVAILABLE_LOCALES)[number]
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
      currency: 'EUR',
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
