export const RAND_SIZE = 100;

/** Random integer in [min, max). */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/** The value range the demo structures draw their random keys from. */
export function randomValue() {
  return randomInt(-RAND_SIZE / 2, RAND_SIZE * 1.5);
}

/**
 * Draw a random key that `isTaken` rejects, giving up after `attempts` tries.
 * Returns null when no free key was found, which callers must treat as "skip"
 * rather than as a value.
 */
export function uniqueRandomKey(isTaken, attempts = RAND_SIZE) {
  for (let i = 0; i < attempts; i++) {
    const candidate = String(randomValue());
    if (!isTaken(candidate)) return candidate;
  }
  return null;
}
