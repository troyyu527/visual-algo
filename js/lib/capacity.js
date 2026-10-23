const MIN_ITEMS = 3;
const MAX_ITEMS = 60;

/** Keep a computed panel capacity inside the range the demos look good at. */
export function clampCapacity(count) {
  return Math.max(MIN_ITEMS, Math.min(Math.floor(count), MAX_ITEMS));
}
