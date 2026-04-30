export const CPR_PATTERN = /^\d{6}-?\d{4}$/

export const normalizeCpr = (value: string | null | undefined): string =>
  (value ?? "").replace(/-/g, "")

export const isValidCpr = (value: string | null | undefined): boolean =>
  CPR_PATTERN.test(value ?? "")
