import d3 from "../lib/d3.js";

const EXIT_MS = 1000;

/**
 * Renders a flat list of `{ key }` items as `.element` divs inside `container`.
 * Shared by every structure that lays its items out in a row or column
 * (Array, Stack, Queue, Linked-List); the per-structure look is pure CSS,
 * selected by the container's class.
 *
 * Items are keyed by `key`, so a re-render moves existing nodes instead of
 * rebuilding them, and `.order()` re-sorts the DOM to match the data — without
 * it, d3 appends entering nodes at the end and a front-insert (unshift) would
 * render on the wrong side.
 */
export function renderLinearList(container, items, { enter = "", exit = "", animate = true } = {}) {
  const join = d3.select(container).selectAll("div.element").data(items, (d) => d.key);

  const entered = join
    .enter()
    .append("div")
    .attr("class", (d) => `element animate__animated _${d.key}`)
    .text((d) => d.key);

  if (animate && enter) entered.classed(enter, true);

  const exiting = join.exit();
  if (animate && exit) {
    exiting.classed(exit, true).transition().duration(EXIT_MS).remove();
  } else {
    exiting.remove();
  }

  join.merge(entered).order();
}
