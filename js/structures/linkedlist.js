import { renderLinearList } from "../render/linear-list.js";
import { clampCapacity } from "../lib/capacity.js";

const ANIMATION = { enter: "animate__fadeInDown", exit: "animate__fadeOutDown" };

/** @type {import("./registry.js").Structure} */
export default {
  id: "LinkedList",
  notice: "NOTICE: Singly linked list — push adds a node at the tail, shift removes the head. Travel walks the list from head to tail, following each node's <b>next</b> pointer.",
  seedCount: 2,

  inputs: [{ id: "inputData", type: "number", placeholder: "Input data", min: -100, max: 100 }],

  controls: [
    { action: "push", label: "Add/Push", source: "input" },
    { action: "push", label: "Add Random/Push", source: "random" },
    { action: "shift", label: "Remove/Shift" },
    { run: "travel", label: "Travel", tone: "brown" },
    { action: "clear", label: "ClearAll", tone: "red" },
  ],

  createModel: () => [],
  items: (model) => model,
  additive: ["push"],

  actions: {
    push: (model, key) => [...model, { key }],
    shift: (model) => model.slice(1),
    clear: () => [],
  },

  // Nodes wrap, so fill by area (bigger cells than Array).
  capacity(main) {
    const cols = Math.max(1, Math.floor((main.clientWidth - 60) / 104));
    const rows = Math.max(1, Math.floor((main.clientHeight - 60) / 58));
    return clampCapacity(cols * rows);
  },

  render(items, container, options) {
    renderLinearList(container, items, { ...ANIMATION, ...options });
  },

  handlers: {
    // Light up each node as the head->tail pointer reaches it, printing the
    // running sequence. `items` is already in head->tail order.
    async travel({ items, container, note, delay }) {
      if (!items.length) return;
      const seq = [];
      for (const item of items) {
        const el = container.querySelector(`._${item.key}`);
        el?.classList.add("visiting");
        seq.push(item.key);
        note(`<b>Traversal (head → tail):</b> ${seq.join(" → ")}`);
        await delay(700);
        el?.classList.remove("visiting");
      }
    },
  },
};
