import type { WidgetTemplate } from '@/widgets/base'

export const createWidgetPage = (widget: WidgetTemplate) => {
  const article = document.createElement('article')
  const containerId = 'widget-container'
  article.id = containerId
  widget.render(undefined, '#widget-container')
  return article
}
