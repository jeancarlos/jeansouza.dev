import type { Box } from './useWindowTransform'
import type { WindowStrings } from './WindowShell'

interface Props {
  strings: WindowStrings
  onMove: () => void
  onResize: () => void
  onPreset: (next: Partial<Box>) => void
  onClose: () => void
}

/**
 * Every control is a real <button>, so one implementation serves keyboard,
 * pointer, touch, speech input and switch control at once.
 *
 * The presets are not a convenience. WCAG 2.5.7 assesses keyboard access and
 * non-dragging pointer access independently, so a drag handle with only a
 * keyboard path still fails; these buttons are that second path.
 */
export function WindowControls({ strings, onMove, onResize, onPreset, onClose }: Props) {
  return (
    <div data-window-controls>
      <button type="button" onClick={onMove}>{strings.move}</button>
      <button type="button" onClick={onResize}>{strings.resize}</button>
      <button type="button" onClick={() => onPreset({ x: 0, y: 0 })}>{strings.topLeft}</button>
      <button type="button" onClick={() => onPreset({ x: 120, y: 80 })}>{strings.center}</button>
      <button type="button" onClick={() => onPreset({ x: 240, y: 0 })}>{strings.rightHalf}</button>
      <button type="button" onClick={() => onPreset({ w: 640, h: 480 })}>{strings.resetSize}</button>
      <button type="button" onClick={() => onPreset({ x: 0, y: 0, w: 1024, h: 768 })}>
        {strings.fitViewport}
      </button>
      <button type="button" onClick={onClose}>{strings.close}</button>
    </div>
  )
}
