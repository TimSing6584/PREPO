export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}
