/**
 * Every data-structure page is the same controller driving one of these.
 * A page declares which via `<body data-structure="...">`; the controller
 * builds the inputs, buttons and notice from the definition and loads only
 * that structure's code.
 *
 * @typedef {object} Structure
 * @property {string}   id           Container class + CSS hook (see css/data.css).
 * @property {string}   notice       Help text for #notice. May contain HTML.
 * @property {number}   [seedCount]  Random items to pre-fill on load.
 * @property {InputSpec[]}   inputs
 * @property {ControlSpec[]} controls
 * @property {() => any}          createModel
 * @property {(model: any) => {key: string}[]} items  Model -> renderable list.
 * @property {string[]}  [additive]  Actions that grow the model, so are capacity-checked.
 * @property {Record<string, (model: any, key: string|null) => any>} actions
 *           Each returns the NEXT model; they must not mutate the one passed in.
 * @property {(main: HTMLElement) => number} [capacity]
 *           Items that fit at the current panel size. Omit for structures
 *           that manage their own space.
 * @property {(items: {key: string}[], container: HTMLElement, options: {animate: boolean}) => void} render
 * @property {Record<string, (ctx: HandlerContext) => Promise<void>>} [handlers]
 *           Named animated actions that read the rendered DOM instead of
 *           changing the model — e.g. a traversal. Referenced by a control's
 *           `run`. Buttons are locked for the duration.
 *
 * @typedef {object} HandlerContext
 * @property {{key: string}[]} items          Snapshot of the current items.
 * @property {HTMLElement}     container      The structure's root element.
 * @property {(html: string) => void} note    Write the readout line.
 * @property {() => void}      clearNote
 * @property {(ms: number) => Promise<void>} delay
 *
 * @typedef {object} InputSpec
 * @property {string} id
 * @property {string} [type]
 * @property {string} [placeholder]
 * @property {number} [min]
 * @property {number} [max]
 * @property {number} [maxLength]
 *
 * @typedef {object} ControlSpec
 * @property {string} action  Key into `actions`.
 * @property {string} label
 * @property {"input"|"random"} [source]  Where the action's key comes from.
 *           Omit for actions that take no value (pop/shift/clear).
 * @property {string} [input]  Input id when `source` is "input" and the
 *           structure has more than one. Defaults to the first.
 * @property {string} [run]    Name of a `handlers` entry to run instead of a
 *           model action (animated, model-read-only). Mutually exclusive with
 *           `action`/`source`.
 * @property {string} [tone]   Semantic UI button colour. Defaults to "blue".
 */

/** Lazily loaded so a page ships only the structure it renders. */
const loaders = {
  Stack: () => import("./stack.js"),
  Queue: () => import("./queue.js"),
  LinkedList: () => import("./linkedlist.js"),
  Array: () => import("./array.js"),
};

export async function loadStructure(id) {
  const load = loaders[id];
  if (!load) throw new Error(`Unknown structure "${id}". Known: ${Object.keys(loaders).join(", ")}`);
  return (await load()).default;
}
