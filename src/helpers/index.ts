/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
  * Returns a value only if it is within a min and max value
  */
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
