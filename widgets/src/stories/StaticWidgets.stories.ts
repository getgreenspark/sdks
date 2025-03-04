import { AVAILABLE_LOCALES, WIDGET_COLORS } from '@/constants'
import type { StoryObj, Meta } from '@storybook/html'
import GreensparkWidgets from '@/index'
import { PREVIEWS_USER } from '@/stories/users'
import { createWidgetPage } from './Widgets'
import type { ByPercentageWidgetParams, StaticWidgetStyle } from '../interfaces'
import type { Widget } from '../widgets/base'

const meta = {
  title: 'Widget SDK/Static Widgets',
  tags: ['autodocs'],
  render: (args) => {
    const { locale, style } = args

    const widgets = new GreensparkWidgets({
      apiKey: PREVIEWS_USER.apiKey,
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
    style: StaticWidgetStyle
    locale: (typeof AVAILABLE_LOCALES)[number]
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
