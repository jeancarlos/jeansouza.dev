export const DIRECTORY_PERMISSIONS = 'drwxr-xr-x'

export function toFileSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
