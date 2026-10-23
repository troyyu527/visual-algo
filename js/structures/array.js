import { renderLinearList } from "../render/linear-list.js";
import { clampCapacity } from "../lib/capacity.js";

const ANIMATION = { enter: "animate__fadeInDown", exit: "animate__fadeOutUp" };

/** @type {import("./registry.js").Structure} */
export default {
  id: "Array",
  notice: "NOTICE: Array supports push / pop (end) and unshift / shift (front).",
  seedCount: 2,

  inputs: [{ id: "inputData", type: "number", placeholder: "Input data", min: -100, max: 100 }],

  controls: [
    { action: "push", label: "Add/Push", source: "input" },
    { action: "push", label: "Add Random/Push", source: "random" },
    { action: "pop", label: "Remove/Pop" },
    { action: "unshift", label: "Add/Unshift", source: "input" },
    { action: "shift", label: "Remove/Shift" },
    { action: "clear", label: "ClearAll", tone: "red" },
  ],

  createModel: () => [],
  items: (model) => model,

  // Only these can overflow the panel, so only these are capacity-checked.
  additive: ["push", "unshift"],

  actions: {
    push: (model, key) => [...model, { key }],
    unshift: (model, key) => [{ key }, ...model],
    pop: (model) => model.slice(0, -1),
    shift: (model) => model.slice(1),
    clear: () => [],
  },

  // The Array wraps, so it fills by area rather than by a single run.
  capacity(main) {
    const cols = Math.max(1, Math.floor((main.clientWidth - 120) / 44));
    const rows = Math.max(1, Math.floor((main.clientHeight - 60) / 60));
    return clampCapacity(cols * rows);
  },

  render(items, container, options) {
    renderLinearList(container, items, { ...ANIMATION, ...options });
  },
};
