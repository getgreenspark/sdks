import { Widget } from '@/widgets/base'
import { WIDGET_COLORS, IMPACT_TYPES } from '@/constants'

import type { WidgetConfig } from '@/widgets/base'
import type { PopupTheme, TopStatsWidgetParams, WidgetColor } from '@/interfaces'

export class TopStatsWidget extends Widget implements TopStatsWidgetParams {
  color: WidgetColor
  withPopup?: boolean
  popupTheme?: PopupTheme
  impactTypes?: (typeof IMPACT_TYPES)[number][]
  version?: 'v2'

  constructor(params: WidgetConfig & TopStatsWidgetParams) {
    super(params)
    this.color = params.color
    this.impactTypes = params.impactTypes
    this.withPopup = params.withPopup
    this.popupTheme = params.popupTheme
    this.version = params.version
  }

  get topStatsWidgetRequestBody(): TopStatsWidgetParams {
    return {
      color: this.color,
      impactTypes: this.impactTypes,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      version: this.version,
    }
  }

  updateDefaults({
    color,
    impactTypes,
    withPopup,
    popupTheme,
    version,
  }: Partial<TopStatsWidgetParams>) {
    this.color = color ?? this.color
    this.impactTypes = impactTypes ?? this.impactTypes
    this.withPopup = withPopup ?? this.withPopup
    this.popupTheme = popupTheme ?? this.popupTheme
    this.version = version ?? this.version
  }

  validateOptions() {
    if (!WIDGET_COLORS.includes(this.color)) {
      throw new Error(
        `Greenspark - "${
          this.color
        }" was selected as the color for the Top Stats Widget, but this color is not available. Please use one of the available colors: ${WIDGET_COLORS.join(
          ', ',
        )}`,
      )
    }
    if (this.impactTypes && this.impactTypes.some((s) => !IMPACT_TYPES.includes(s))) {
      throw new Error(
        `Greenspark - "${
          this.impactTypes
        }" is not a valid list for the displayed values of the Top Stats Widget. Please use only the available types: ${IMPACT_TYPES.join(
          ', ',
        )}`,
      )
    }
  }

  async render(options?: Partial<TopStatsWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<TopStatsWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchTopStatsWidget(this.topStatsWidgetRequestBody)
    return response.data
  }

  async renderToElement(options?: Partial<TopStatsWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
