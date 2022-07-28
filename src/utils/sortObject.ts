export const sortObject = <T extends Record<string, unknown>>(obj: T): T =>
  Object.keys(obj)
    .sort()
    .reduce((result, key) => ({ ...result, [key]: obj[key] }), {}) as T
