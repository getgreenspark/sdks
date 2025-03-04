import { AVAILABLE_LOCALES, STATIC_WIDGET_STYLES, WIDGET_COLORS } from '@/constants'
import type { StoryObj, Meta } from '@storybook/html'
import type GreensparkWidgets from '@/index'
import { ConnectionHandler } from '@/network'
import { PREVIEWS_USER } from '@/stories/users'

const meta = {
  title: 'Widget SDK/Static Widgets',
  tags: ['autodocs'],
  render: (args) => {
    const { locale } = args
    const container = document.createElement('div')

    const variants = [{ version: 'v2' }]

    const handler = new ConnectionHandler({
      apiKey: PREVIEWS_USER.apiKey,
      locale: locale,
      isShopifyIntegration: false,
    })

    const article = document.createElement('article')
    article.style.maxWidth = '100%'

    for (const color of WIDGET_COLORS) {
      for (const variant of variants) {
        handler
          .fetchStaticWidget({
            color,
            version: variant.version as unknown as 'v2',
            style: 'simplified',
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

    return container
  },
  argTypes: {
    locale: {
      control: { type: 'select' },
      options: AVAILABLE_LOCALES,
    },
  },
  args: {
    locale: 'en',
  },
} satisfies Meta<
  GreensparkWidgets & {
    locale: (typeof AVAILABLE_LOCALES)[number]
  }
>

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Static: StoryObj<{
  widgetType: keyof GreensparkWidgets
}> = {
  argTypes: {},
}
