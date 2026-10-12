import type { CustomerChoiceStorage } from '@/interfaces'

const INPUT_SELECTOR = 'input[data-greenspark-project-choice-input]'

export interface CustomerChoiceHost {
  // Re-renders the widget for the recorded project so the order-impact figures follow the pick.
  redraw(projectId: string): Promise<void>
}

// One change listener per root; only the widget that last rendered into a root handles its picks,
// so a second widget instance on the same container never writes twice.
const owners = new WeakMap<Node, CustomerChoiceController>()

const retryOnce = async <T>(attempt: () => Promise<T>): Promise<T> => {
  try {
    return await attempt()
  } catch {
    return await attempt()
  }
}

/**
 * Storefront behavior around the project choice radios in the cart widget HTML (SF-0010 AD-02).
 * The API decides which option is shown (SF-0010 AD-01); this records it on the cart through the
 * platform's storage and redraws after a shopper's pick. Highlight and panel follow the radio in CSS.
 */
export class CustomerChoiceController {
  private readonly storage: CustomerChoiceStorage
  private readonly host: CustomerChoiceHost
  private root?: Element | ShadowRoot
  private writeChain: Promise<void> = Promise.resolve()
  // The most recent choice to record; queued writes for older choices are skipped.
  private latestProjectId = ''
  // Set while a write is queued or running; the API's selection is not recorded over it.
  private pendingProjectId = ''
  // The choice last sent for recording, so repeated renders of one selection write it once.
  private recordedProjectId = ''
  // The option the last render checked: the API's selection, which a failed pick falls back to.
  private renderedProjectId = ''

  constructor(storage: CustomerChoiceStorage, host: CustomerChoiceHost) {
    this.storage = storage
    this.host = host
  }

  // Called after each inject with the stored choice the render was requested with.
  afterRender(root: Element | ShadowRoot, storedProjectId: string | undefined): void {
    this.bind(root)
    const checkedProjectId = this.checkedProjectId(root)
    this.renderedProjectId = checkedProjectId
    if (this.pendingProjectId) return

    // A missing stored choice differs from any shown option, so the API's default is recorded.
    if (!checkedProjectId || checkedProjectId === (storedProjectId?.trim() ?? '')) {
      this.recordedProjectId = ''
      return
    }
    if (this.recordedProjectId === checkedProjectId) return

    this.recordedProjectId = checkedProjectId
    this.record(checkedProjectId, false)
  }

  private bind(root: Element | ShadowRoot): void {
    this.root = root
    if (!owners.has(root)) {
      root.addEventListener('change', (event) => owners.get(root)?.onChange(event))
    }
    owners.set(root, this)
  }

  private onChange(event: Event): void {
    const input = event.target
    if (!(input instanceof HTMLInputElement) || !input.matches(INPUT_SELECTOR) || !input.checked) {
      return
    }
    const projectId = input.value.trim()
    if (!projectId) return

    this.recordedProjectId = projectId
    this.record(projectId, true)
  }

  private checkedProjectId(root: Element | ShadowRoot): string {
    return root.querySelector<HTMLInputElement>(`${INPUT_SELECTOR}:checked`)?.value.trim() ?? ''
  }

  // Writes run one at a time, so the cart ends on the latest choice.
  private record(projectId: string, redraw: boolean): void {
    this.latestProjectId = projectId
    this.pendingProjectId = projectId
    this.writeChain = this.writeChain.then(() => this.write(projectId, redraw))
  }

  private async write(projectId: string, redraw: boolean): Promise<void> {
    if (this.latestProjectId !== projectId) return

    try {
      await retryOnce(async () => {
        if ((await this.storage.read()).trim() === projectId) return
        await this.storage.write(projectId)
      })
    } catch (error) {
      console.error(`Greenspark - Failed to record the project choice "${projectId}"`, error)
      this.restore(projectId)
      return
    }

    // A newer choice is queued; its own write redraws.
    if (this.latestProjectId !== projectId) return
    this.pendingProjectId = ''
    if (!redraw) return

    try {
      await this.host.redraw(projectId)
    } catch (error) {
      console.error(`Greenspark - Failed to redraw the widget for the project choice "${projectId}"`, error)
    }
  }

  // After a failed write the radios go back to the API's selection, which the figures on screen
  // include (SF-0010 AD-01). Nothing more is written until the next selection or render.
  private restore(projectId: string): void {
    if (this.latestProjectId !== projectId) return

    this.pendingProjectId = ''
    this.recordedProjectId = ''
    this.root?.querySelectorAll<HTMLInputElement>(INPUT_SELECTOR).forEach((input) => {
      input.checked = input.value.trim() === this.renderedProjectId
    })
  }
}
