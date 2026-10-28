import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import { useStageWindowDrag } from './use-stage-window-drag'

async function setup() {
  const canvas = document.createElement('canvas')
  const button = document.createElement('button')
  document.body.append(canvas, button)
  const enabled = ref(true)
  const startDrag = vi.fn()
  const scope = effectScope()
  scope.run(() => useStageWindowDrag(canvas, enabled, startDrag))
  await nextTick()
  onTestFinished(() => {
    scope.stop()
    canvas.remove()
    button.remove()
  })
  function pointer(target: EventTarget, type: string, x = 100, buttons = 1, buttonValue = 0) {
    target.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      pointerType: 'mouse',
      button: buttonValue,
      buttons,
      screenX: x,
      screenY: 100,
    }))
  }
  return { canvas, button, enabled, startDrag, pointer, scope }
}

describe('character window dragging', () => {
  it('starts native dragging once after the character moves five pixels', async () => {
    const { canvas, pointer, startDrag } = await setup()
    pointer(canvas, 'pointerdown')
    pointer(window, 'pointermove', 104)
    expect(startDrag).not.toHaveBeenCalled()
    pointer(window, 'pointermove', 105)
    pointer(window, 'pointermove', 120)
    expect(startDrag).toHaveBeenCalledTimes(1)
  })

  it('preserves character clicks and ignores control buttons and right clicks', async () => {
    const { canvas, button, pointer, startDrag } = await setup()
    pointer(canvas, 'pointerdown')
    pointer(canvas, 'pointerup', 100, 0)
    pointer(window, 'pointermove', 120)
    pointer(button, 'pointerdown')
    pointer(window, 'pointermove', 120)
    pointer(canvas, 'pointerdown', 100, 2, 2)
    pointer(window, 'pointermove', 120, 2)
    expect(startDrag).not.toHaveBeenCalled()
  })

  it('cancels on disabled interaction, pointer cancellation, focus loss, and disposal', async () => {
    const { canvas, enabled, pointer, startDrag, scope } = await setup()
    pointer(canvas, 'pointerdown')
    enabled.value = false
    pointer(window, 'pointermove', 120)
    enabled.value = true
    pointer(canvas, 'pointerdown')
    pointer(canvas, 'pointercancel')
    pointer(window, 'pointermove', 120)
    pointer(canvas, 'pointerdown')
    window.dispatchEvent(new Event('blur'))
    pointer(window, 'pointermove', 120)
    scope.stop()
    pointer(canvas, 'pointerdown')
    pointer(window, 'pointermove', 120)
    expect(startDrag).not.toHaveBeenCalled()
  })
})
