/**
 * Polite live region for keyboard move and resize feedback.
 *
 * WCAG 4.1.3 does not require inventing these messages — it governs status
 * messages an interface already presents. They exist because a keyboard move
 * mode with no feedback is unusable; once presented without moving focus, 4.1.3
 * then requires them to be programmatically determinable, which is what this is.
 *
 * role=status defaults to atomic, but ARIA22 advises setting aria-atomic
 * explicitly because some environments do not honour the default.
 */
export function WindowStatus({ message }: { message: string }) {
  return (
    <div role="status" aria-atomic="true" className="sr-only">
      {message}
    </div>
  )
}
