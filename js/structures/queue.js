import { renderLinearList } from "../render/linear-list.js";
import { clampCapacity } from "../lib/capacity.js";

const ANIMATION = { enter: "animate__backInLeft", exit: "animate__backOutRight" };

/** @type {import("./registry.js").Structure} */
export default {
  id: "Queue",
  notice: "NOTICE: A queue is <b>FIFO</b> — first in, first out. Enqueue adds to the back; Dequeue removes from the front.",
  seedCount: 2,

  inputs: [{ id: "inputData", type: "number", placeholder: "Input data", min: -100, max: 100 }],

  controls: [
    { action: "push", label: "Add/Enqueue", source: "input" },
    { action: "push", label: "Add Random/Enqueue", source: "random" },
    { action: "shift", label: "Remove/Dequeue" },
    { action: "clear", label: "ClearAll", tone: "red" },
  ],

  createModel: () => [],
  items: (model) => model,
  additive: ["push"],

  // enqueue appends; dequeue removes the front. The CSS (row-reverse) draws the
  // front on the right, so the visual matches the FIFO arrows.
  actions: {
    push: (model, key) => [...model, { key }],
    shift: (model) => model.slice(1),
    clear: () => [],
  },

  // A single row of ~52px cells, plus the side arrows.
  capacity(main) {
    return clampCapacity((main.clientWidth - 140) / 52);
  },

  render(items, container, options) {
    renderLinearList(container, items, { ...ANIMATION, ...options });
  },
};
