import type { WidgetConfig } from '@/widgets/base'
import { Widget } from '@/widgets/base'
import type { PopupTheme, TopStatsWidgetParams, WidgetColor } from '@/interfaces'
import { WidgetValidator } from '@/utils/widget-validation'
import type { IMPACT_TYPES } from '@/constants'

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

  private get requestBody(): TopStatsWidgetParams {
    return {
      color: this.color,
      impactTypes: this.impactTypes,
      withPopup: this.withPopup,
      popupTheme: this.popupTheme,
      version: this.version,
    }
  }

  async render(options?: Partial<TopStatsWidgetParams>, containerSelector?: string): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<TopStatsWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchTopStatsWidget(this.requestBody)
    return response.data
  }

  async renderToElement(options?: Partial<TopStatsWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }

  private updateDefaults({
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

  private validateOptions() {
    WidgetValidator.for('Top Stats Widget')
      .color(this.color)
      .withPopup(this.withPopup)
      .popupTheme(this.popupTheme)
      .impactTypes(this.impactTypes)
      .validate()
  }
}
