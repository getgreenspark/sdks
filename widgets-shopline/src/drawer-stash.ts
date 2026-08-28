import type { CartOrderPayload } from './interfaces'
import { getWidgetContainer, widgetInstanceId } from './dom'
import { WIDGET_INSTANCE_SELECTOR } from './selectors'

export type DrawerRestoreKind = 'painted' | 'clone' | 'none'

const stashGenByTarget = new Map<string, number>()
const clonesByTarget = new Map<string, HTMLElement>()
const paintedByTarget = new Map<string, HTMLElement>()
const ordersByTarget = new Map<string, CartOrderPayload>()
const restoredCloneIds = new Set<string>()

export function pickDrawerRestoreKind(
  hasInstance: boolean,
  hasPainted: boolean,
  hasClone: boolean,
): DrawerRestoreKind {
  if (hasInstance) return 'none'
  if (hasPainted) return 'painted'
  if (hasClone) return 'clone'
  return 'none'
}

export function beginDrawerStash(targetId: string, clone: HTMLElement | null): number {
  const gen = (stashGenByTarget.get(targetId) ?? 0) + 1
  stashGenByTarget.set(targetId, gen)
  paintedByTarget.delete(targetId)
  ordersByTarget.delete(targetId)
  restoredCloneIds.delete(targetId)
  if (clone) clonesByTarget.set(targetId, clone)
  else clonesByTarget.delete(targetId)
  return gen
}

export function isCurrentStashGen(targetId: string, gen: number): boolean {
  return stashGenByTarget.get(targetId) === gen
}

export function dropDrawerClone(targetId: string): void {
  clonesByTarget.delete(targetId)
}

export function rememberPaintedNode(targetId: string, node: HTMLElement): void {
  paintedByTarget.set(targetId, node)
}

export function rememberStashedOrder(targetId: string, order: CartOrderPayload): void {
  ordersByTarget.set(targetId, order)
}

export function takeStashedOrder(targetId: string): CartOrderPayload | undefined {
  const order = ordersByTarget.get(targetId)
  ordersByTarget.delete(targetId)
  return order
}

function fillInstanceFromPainted(container: Element, paintedRoot: HTMLElement): void {
  const source = paintedRoot.cloneNode(true) as HTMLElement
  container.replaceChildren(...Array.from(source.childNodes))
}

function insertInstanceClone(target: HTMLElement, clone: HTMLElement): void {
  const instance = clone.cloneNode(true) as HTMLElement
  instance.classList.add('greenspark-widget-instance')
  instance.setAttribute('data-greenspark-widget-container-for', widgetInstanceId(target))
  target.querySelectorAll(WIDGET_INSTANCE_SELECTOR).forEach((node) => node.remove())
  target.insertAdjacentElement('afterbegin', instance)
}

/** True when this node is a post-wipe clone we put back, not the pre-wipe original. */
export function wasRestoredFromClone(targetId: string): boolean {
  return restoredCloneIds.has(targetId)
}

export function applyPaintedToTarget(target: HTMLElement): boolean {
  const painted = paintedByTarget.get(target.id)
  if (!painted) return false

  getWidgetContainer(target)
  const container = target.querySelector(WIDGET_INSTANCE_SELECTOR)
  if (!container) return false

  fillInstanceFromPainted(container, painted)
  return true
}

export function restoreDrawerWidget(target: HTMLElement): DrawerRestoreKind {
  const kind = pickDrawerRestoreKind(
    target.querySelector(WIDGET_INSTANCE_SELECTOR) != null,
    paintedByTarget.has(target.id),
    clonesByTarget.has(target.id),
  )

  switch (kind) {
    case 'painted': {
      applyPaintedToTarget(target)
      return 'painted'
    }
    case 'clone': {
      const clone = clonesByTarget.get(target.id)
      if (!clone) return 'none'
      insertInstanceClone(target, clone)
      restoredCloneIds.add(target.id)
      return 'clone'
    }
    case 'none':
      return 'none'
    default: {
      const exhaustive: never = kind
      return exhaustive
    }
  }
}
