import type { WidgetTemplate } from '@/widgets/base'

export const createWidgetPage = (id: string, widget: WidgetTemplate) => {
  const article = document.createElement('article')
  const containerClass = `widget-container-${id}`
  if (!article.classList.contains(containerClass)) article.classList.add(containerClass)
  widget.render(undefined, `.${containerClass}`).catch((error) => console.error(error))
  return article
}
