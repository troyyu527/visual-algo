import { loadStructure } from "../structures/registry.js";
import { uniqueRandomKey } from "../lib/random.js";

const structure = await loadStructure(document.body.dataset.structure);

const main = document.querySelector("main");
const controlHost = document.querySelector(".data-control");
const notice = document.querySelector("#notice");

let model = structure.createModel();

const container = document.createElement("div");
container.className = structure.id;
main.append(container);

const items = () => structure.items(model);
const isTaken = (key) => items().some((item) => item.key === key);

// ---------------------------------------------------------------- controls
const inputs = new Map();

for (const spec of structure.inputs) {
  const input = document.createElement("input");
  input.id = spec.id;
  input.type = spec.type ?? "text";
  input.placeholder = spec.placeholder ?? "";
  if (spec.min !== undefined) input.min = spec.min;
  if (spec.max !== undefined) input.max = spec.max;
  if (spec.maxLength !== undefined) input.maxLength = spec.maxLength;
  inputs.set(spec.id, input);
  controlHost.append(input);
}

const buttons = [];
for (const control of structure.controls) {
  const button = document.createElement("button");
  button.className = `mini ui button ${control.tone ?? "blue"}`;
  button.textContent = control.label;
  button.addEventListener("click", () => dispatch(control));
  controlHost.append(button);
  buttons.push(button);
}

controlHost.append(notice); // keep the help text below the buttons
notice.innerHTML = structure.notice;

// Readout line handlers can write to (e.g. a traversal sequence). Kept below
// the notice; cleared whenever the model changes so it can never contradict
// what is on screen.
const readout = document.createElement("div");
readout.className = "readout";
notice.append(readout);
const setNote = (html) => { readout.innerHTML = html; };
const clearNote = () => { readout.innerHTML = ""; };

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ---------------------------------------------------------------- dispatch
/**
 * Resolve a control's key, or null when it has none to give — an empty input,
 * or a random draw that could not find a free value. Distinct from "0", which
 * is a perfectly good key.
 */
function keyFor(control) {
  if (control.source === "random") return uniqueRandomKey(isTaken);
  if (control.source === "input") {
    const input = inputs.get(control.input ?? structure.inputs[0].id);
    const value = input.value.trim();
    return value === "" ? null : value;
  }
  return null;
}

async function dispatch(control) {
  // Animated handlers (traversal, etc.) don't touch the model — they run their
  // own choreography with the buttons locked.
  if (control.run) return runHandler(control.run);

  const key = keyFor(control);

  if (control.source) {
    if (key === null || isTaken(key)) return;
    const capped = structure.capacity && structure.additive?.includes(control.action);
    if (capped && items().length >= capacity()) return;
  }

  clearNote();
  model = structure.actions[control.action](model, key);
  render();
}

let busy = false;
async function runHandler(name) {
  const handler = structure.handlers?.[name];
  if (!handler || busy) return;
  busy = true;
  buttons.forEach((b) => b.classList.add("disabled"));
  try {
    await handler({ items: items(), container, note: setNote, clearNote, delay });
  } finally {
    buttons.forEach((b) => b.classList.remove("disabled"));
    busy = false;
  }
}

function render() {
  structure.render(items(), container, { animate: true });
}

// ---------------------------------------------------------------- capacity
function capacity() {
  return structure.capacity(main);
}

if (structure.capacity) {
  const capNote = document.createElement("div");
  capNote.id = "cap-note";
  notice.append(capNote);

  const refresh = () => {
    capNote.textContent = `Fits ~${capacity()} items at this panel size — resize the window to fit more or fewer.`;
  };
  window.addEventListener("resize", refresh);
  refresh();
}

// ---------------------------------------------------------------- start
for (let i = 0; i < (structure.seedCount ?? 0); i++) {
  const key = uniqueRandomKey(isTaken);
  if (key !== null) model = structure.actions.push(model, key);
}
render();
