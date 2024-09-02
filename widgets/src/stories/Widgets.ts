import type { WidgetTemplate } from '@/widgets/base'
import './widgets.css'

export const createWidgetPage = (id: string, widget: WidgetTemplate, colors: Readonly<string[]>, versions: string[]) => {
  const article = document.createElement('article')

  versions.forEach(version => {
    const versionContainer = document.createElement('div')
    const versionContainerClass = `widget-container-${id}-${version}`
    if (!versionContainer.classList.contains(versionContainerClass)) versionContainer.classList.add(versionContainerClass)
    article.appendChild(versionContainer)
    
    colors.forEach(color => {
      const colorContainer = document.createElement('div')
      const colorContainerClass = `widget-color-${id}-${color}-${version}`
      if (!colorContainer.classList.contains(colorContainerClass)) colorContainer.classList.add(colorContainerClass)
      versionContainer.appendChild(colorContainer)

      widget.render({ color, version }, `.${colorContainerClass}`).catch((error) => console.error(error))
    })
  })
  return article
}
