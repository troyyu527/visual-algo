import { renderLinearList } from "../render/linear-list.js";
import { clampCapacity } from "../lib/capacity.js";

const ANIMATION = { enter: "animate__backInDown", exit: "animate__backOutUp" };

/** @type {import("./registry.js").Structure} */
export default {
  id: "Stack",
  notice: "NOTICE: A stack is <b>LIFO</b> — last in, first out. Push adds to the top; Pop removes the item added most recently.",
  seedCount: 2,

  inputs: [{ id: "inputData", type: "number", placeholder: "Input data", min: -100, max: 100 }],

  controls: [
    { action: "push", label: "Add/Push", source: "input" },
    { action: "push", label: "Add Random/Push", source: "random" },
    { action: "pop", label: "Remove/Pop" },
    { action: "clear", label: "ClearAll", tone: "red" },
  ],

  createModel: () => [],
  items: (model) => model,
  additive: ["push"],

  actions: {
    push: (model, key) => [...model, { key }],
    pop: (model) => model.slice(0, -1),
    clear: () => [],
  },

  // Grows vertically: a single column of ~42px rows.
  capacity(main) {
    return clampCapacity((main.clientHeight - 110) / 42);
  },

  render(items, container, options) {
    renderLinearList(container, items, { ...ANIMATION, ...options });
  },
};
