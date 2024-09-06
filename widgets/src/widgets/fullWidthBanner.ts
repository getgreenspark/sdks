import { Widget } from '@/widgets/base'

import { AVAILABLE_STATISTIC_TYPES } from '@/constants'
import type { WidgetConfig } from '@/widgets/base'
import type { FullWidthBannerWidgetParams } from '@/interfaces'

export class FullWidthBannerWidget extends Widget implements FullWidthBannerWidgetParams {
  options: Array<(typeof AVAILABLE_STATISTIC_TYPES)[number]>
  imageUrl?: string
  title?: string
  description?: string
  showButton?: boolean
  version?: 'v2'

  constructor(params: WidgetConfig & FullWidthBannerWidgetParams) {
    super(params)
    this.options = params.options
    this.imageUrl = params.imageUrl
    this.title = params.title
    this.description = params.description
    this.showButton = params.showButton
    this.version = params.version
  }

  get fullWidthBannerWidgetRequestBody(): FullWidthBannerWidgetParams {
    return {
      options: this.options,
      imageUrl: this.imageUrl,
      title: this.title,
      description: this.description,
      showButton: this.showButton,
      version: this.version,
    }
  }

  updateDefaults({ options, imageUrl, title, description, showButton, version }: Partial<FullWidthBannerWidgetParams>) {
    this.options = options ?? this.options
    this.imageUrl = imageUrl ?? this.imageUrl
    this.title = title ?? this.title
    this.description = description ?? this.description
    this.showButton = showButton ?? this.showButton
    this.version = version ?? this.version
  }

  validateOptions() {
    if (this.options.length <= 0) {
      throw new Error(
        `Greenspark - the "options" value that was provided to the Full Width Banner Widget has no elements within the array.`,
      )
    }

    this.options.forEach((option) => {
      if (!AVAILABLE_STATISTIC_TYPES.includes(option) || typeof option !== 'string') {
        throw new Error(
          `Greenspark - "${option}" was provided as an option for the Full Width Banner Widget, but this is not a valid option. Please use values from the following list: ${AVAILABLE_STATISTIC_TYPES.join(
            ', ',
          )}`,
        )
      }
    })

    if (this.imageUrl && typeof this.imageUrl !== 'string') {
      throw new Error(
        `Greenspark - "${this.imageUrl}" was set has the background image for the Full Width Banner, but this is not a valid value. Please use a valid URL string.`,
      )
    }
  }

  async render(
    options?: Partial<FullWidthBannerWidgetParams>,
    containerSelector?: string,
  ): Promise<void> {
    const node = await this.renderToElement(options)
    this.inject(node, containerSelector)
  }

  async renderToString(options?: Partial<FullWidthBannerWidgetParams>): Promise<string> {
    if (options) this.updateDefaults(options)
    this.validateOptions()
    const response = await this.api.fetchFullWidthBannerWidget(
      this.fullWidthBannerWidgetRequestBody,
    )
    return response.data
  }

  async renderToElement(options?: Partial<FullWidthBannerWidgetParams>): Promise<HTMLElement> {
    const html = await this.renderToString(options)
    return this.parseHtml(html)
  }
}
