export const createContainer = (customSelector?: string): string => {
  const id = 'test-widget-container'
  const selector = customSelector ?? `#${id}`

  const container = document.querySelector(selector) ?? document.createElement('div')
  container.innerHTML = ''
  container.id = id
  document.body.appendChild(container)
  return selector
}
