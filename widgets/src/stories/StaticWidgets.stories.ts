import { AVAILABLE_LOCALES, WIDGET_COLORS } from '@/constants'
import type { StoryObj, Meta } from '@storybook/html'
import GreensparkWidgets from '@/index'
import { PREVIEWS_USER, STORE_USERS } from '@/stories/users'
import { createWidgetPage } from './Widgets'
import type { ByPercentageWidgetParams, StaticWidgetStyle } from '../interfaces'
import type { Widget } from '../widgets/base'
const USERS = { PREVIEW: PREVIEWS_USER, SINGULAR: STORE_USERS.SINGULAR }

const meta = {
  title: 'Widget SDK/Static Widgets',
  tags: ['autodocs'],
  render: (args) => {
    const { locale, style, user } = args

    const widgets = new GreensparkWidgets({
      apiKey: USERS[user].apiKey,
      integrationSlug: USERS[user].integrationSlug,
      locale,
    })

    const variants = [{ version: 'v2' }]

    let widget: Widget
    switch (style) {
      case 'default':
        widget = widgets.static({ color: 'blue', style })
        return createWidgetPage('static', widget, WIDGET_COLORS, variants)
      case 'simplified':
        widget = widgets.static({ color: 'blue', style })
        return createWidgetPage('static', widget, WIDGET_COLORS, variants)
      case 'rounded':
        widget = widgets.static({ color: 'blue', style })
        return createWidgetPage('static', widget, WIDGET_COLORS, variants)
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
  },
  args: {
    user: 'SINGULAR',
    locale: 'en',
  },
} satisfies Meta<
  GreensparkWidgets & {
    style: StaticWidgetStyle
    locale: (typeof AVAILABLE_LOCALES)[number]
    user: keyof typeof USERS
  }
>

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: StoryObj<{
  widgetArgs: ByPercentageWidgetParams
  style: StaticWidgetStyle
}> = {
  argTypes: {},
  args: {
    style: 'default',
  },
}

export const Simplified: StoryObj<{
  widgetArgs: ByPercentageWidgetParams
  style: StaticWidgetStyle
}> = {
  argTypes: {},
  args: {
    style: 'simplified',
  },
}

export const Rounded: StoryObj<{
  widgetArgs: ByPercentageWidgetParams
  style: StaticWidgetStyle
}> = {
  argTypes: {},
  args: {
    style: 'rounded',
  },
}
