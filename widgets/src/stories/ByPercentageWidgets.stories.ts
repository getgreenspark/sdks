import { AVAILABLE_LOCALES, DEFAULT_LOCALE, IMPACT_TYPES } from '@/constants'
import type { StoryObj, Meta } from '@storybook/html'
import type GreensparkWidgets from '@/index'
import { ConnectionHandler } from '@/network'
import type { WidgetStyle } from '@/interfaces'
import { PREVIEWS_USER } from '@/stories/users'

type WIDGET_VARIANTS = 'byPercentage' | 'byPercentageOfRevenue'

const meta = {
  title: 'Widget SDK/By Percentage Widgets',
  tags: ['autodocs'],
  render: (args) => {
    const { locale, widgetType } = args
    const container = document.createElement('div')

    const byPercentageVariants = [
      { version: '', style: 'default' },
      { version: 'v2', style: 'default' },
      { version: 'v2', style: 'simplified' },
    ]

    const byPercentageOfRevenueVariants = [
      { version: 'v2', style: 'default' },
      { version: 'v2', style: 'simplified' },
    ]

    const handler = new ConnectionHandler({
      apiKey: PREVIEWS_USER.apiKey,
      integrationSlug: PREVIEWS_USER.integrationSlug,
      locale: locale,
      isShopifyIntegration: false,
    })

    const article = document.createElement('article')
    article.style.maxWidth = '100%'

    switch (widgetType) {
      case 'byPercentage':
        for (const variant of byPercentageVariants) {
          for (const type of IMPACT_TYPES) {
            handler
              .fetchByPercentageWidget(
                {
                  color: 'beige',
                  version: variant.version as unknown as 'v2',
                  style: variant.style as WidgetStyle,
                  // @ts-expect-error testing purposes
                  type,
                },
                undefined,
                true,
              )
              .then((response) => {
                const widgetContainer = document.createElement('div')
                widgetContainer.style.maxWidth = '100%'
                widgetContainer.style.margin = '20px 0'
                widgetContainer.innerHTML = response.data
                container.appendChild(widgetContainer)
              })
          }
        }
        break
      case 'byPercentageOfRevenue':
        for (const variant of byPercentageOfRevenueVariants) {
          for (const type of IMPACT_TYPES) {
            handler
              .fetchByPercentageOfRevenueWidget({
                color: 'beige',
                version: variant.version as unknown as 'v2',
                style: variant.style as WidgetStyle,
                // @ts-expect-error testing purposes
                type,
              })
              .then((response) => {
                const widgetContainer = document.createElement('div')
                widgetContainer.style.maxWidth = '100%'
                widgetContainer.style.margin = '20px 0'
                widgetContainer.innerHTML = response.data
                container.appendChild(widgetContainer)
              })
          }
        }
        break
    }

    return container
  },
  argTypes: {
    locale: {
      control: { type: 'select' },
      options: AVAILABLE_LOCALES,
    },
  },
  args: {
    locale: DEFAULT_LOCALE,
  },
} satisfies Meta<
  GreensparkWidgets & {
    widgetType: WIDGET_VARIANTS
    locale: (typeof AVAILABLE_LOCALES)[number]
    type: (typeof IMPACT_TYPES)[number]
  }
>

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ByPercentage: StoryObj<{
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {},
  args: {
    widgetType: 'byPercentage',
  },
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ByPercentageOfRevenue: StoryObj = {
  argTypes: {},
  args: {
    widgetType: 'byPercentageOfRevenue',
  },
}
