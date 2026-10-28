import type { MaybeRefOrGetter } from 'vue'

import { useEventListener } from '@vueuse/core'
import { toValue } from 'vue'

/** Moves the native window after a left-button drag on the character canvas. Clicks remain available to the renderer. */
export function useStageWindowDrag(
  canvas: MaybeRefOrGetter<HTMLCanvasElement | undefined>,
  enabled: MaybeRefOrGetter<boolean>,
  startDrag: () => void,
) {
  let press: { pointerId: number, x: number, y: number } | undefined

  function cancel() {
    press = undefined
  }

  useEventListener(window, 'pointerdown', (event) => {
    cancel()
    if (!toValue(enabled) || event.button !== 0 || event.pointerType !== 'mouse')
      return
    if (!toValue(canvas) || event.target !== toValue(canvas))
      return
    press = { pointerId: event.pointerId, x: event.screenX, y: event.screenY }
  }, { capture: true })

  useEventListener(window, 'pointermove', (event) => {
    if (!press || press.pointerId !== event.pointerId)
      return
    if (!toValue(enabled) || !(event.buttons & 1)) {
      cancel()
      return
    }
    if (Math.hypot(event.screenX - press.x, event.screenY - press.y) < 5)
      return
    cancel()
    startDrag()
  }, { capture: true })

  useEventListener(window, 'pointerup', cancel)
  useEventListener(window, 'pointercancel', cancel)
  useEventListener(window, 'blur', cancel)
}
