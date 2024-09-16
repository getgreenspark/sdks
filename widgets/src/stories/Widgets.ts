import type { WidgetTemplate } from '@/widgets/base'
import './widgets.css'

export const createWidgetPage = (id: string, widget: WidgetTemplate, colors: Readonly<string[]>, variants: { version?: string, style?: string }[]) => {
  const article = document.createElement('article')
  article.style.maxWidth = '100%';

  variants.forEach((optionsForVariant, index) => {
    const variantDefinitions = document.createElement('pre')
    variantDefinitions.innerHTML = JSON.stringify(optionsForVariant)
    variantDefinitions.style.maxWidth = '100%';
    variantDefinitions.style.whiteSpace = 'break-spaces';
    article.appendChild(variantDefinitions)

    const variantContainer = document.createElement('div')
    const versionContainerClass = `widget-container-${id}-${index}`
    if (!variantContainer.classList.contains(versionContainerClass)) variantContainer.classList.add(versionContainerClass)
    article.appendChild(variantContainer)
    
    colors.forEach(color => {
      const colorContainer = document.createElement('div')
      const colorContainerClass = `widget-color-${id}-${index}-${color}`
      if (!colorContainer.classList.contains(colorContainerClass)) colorContainer.classList.add(colorContainerClass)
      variantContainer.appendChild(colorContainer)

      widget.render({ color, ...optionsForVariant }, `.${colorContainerClass}`).catch((error) => console.error(error))
    })
  })
  return article
}
