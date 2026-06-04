export function joinClassNames(...classes: (string | false | null | undefined)[]): string {
  return classes.filter((c): c is string => Boolean(c)).join(' ')
}
