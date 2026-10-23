# VisualAlgo — Data Structure & Sorting Algorithm Visualizer

Interactive, animated walkthroughs of the data structures and sorting algorithms
you meet in a first algorithms course. Every structure steps through its own
insert, search, and delete operations on screen, so you watch the shape of the
data change instead of reading about it.

**Live:** <http://troyyu527.github.io/visual-algo>

Built as a **zero-build static site** — no bundler, no transpiler, no
`node_modules`. Open the folder on any web server and it runs. It also installs
as a **Progressive Web App** and keeps working with no network at all.

## What's inside

**Data structures** (8) — each with its own animated operations:

| | |
|---|---|
| Array | index access, insert, delete, resize |
| Linked List | node traversal, insert, delete |
| Stack | push / pop, LIFO ordering |
| Queue | enqueue / dequeue, FIFO ordering |
| Hash Table | hashing, bucket placement, collision handling |
| Binary Search Tree | insert, search, traversal |
| Heap | binary max-heap, sift-up / sift-down |
| Graph | vertices, edges, traversal |

**Sorting algorithms** (6) — animated comparisons and swaps, side by side with
the array state: bubble, insertion, selection, merge, quick, and heap sort.

**Force-directed graph** — a 3D graph explorer for larger structures, rendered
with `3d-force-graph`.

## Tools & technologies

| Area | Used |
|---|---|
| Visualization | **D3.js**, SVG, `3d-force-graph` |
| Language | JavaScript (ES modules, no build step) |
| UI | Semantic UI, Animate.css, jQuery / jQuery UI |
| Offline | **Progressive Web App** — service worker, web app manifest |
| Dev server | Python (`http.server`, no-cache wrapper) |

## Running it

The site needs to be served over HTTP — opening `index.html` straight off disk
(`file://`) will not work, because service workers and module paths both require
a real origin.

```bash
npm start           # runs serve.py → http://localhost:5180
```

On Windows you can double-click **`start.bat`** instead — it does the same thing.

Pick a different port by passing one through:

```bash
python serve.py 8000
```

Any other static server works just as well, for example:

```bash
npx serve .
python -m http.server 8000
```

> The bundled `serve.py` sends no-cache headers deliberately, so edits show up on
> refresh instead of being masked by the service worker's cache.

## Offline / PWA

`sw.js` pre-caches the app shell — HTML, CSS, vendor scripts — and serves
`offline.html` when a page is requested that isn't cached. Once the site has been
loaded on a device, every visualization keeps working with no connection.

To see changes after editing while the service worker is active, hard-reload
(**Ctrl + Shift + R**) or unregister it under DevTools → Application → Service
Workers.

## Project layout

```
index.html            entry page, links every visualization
html/data/            one page per data structure
html/sort/            one page per sorting algorithm
html/algo/            force-directed graph explorer
js/class/             data-structure implementations (BST, heap, graph, hash table)
js/structures/        registry-driven modules (array, linked list, stack, queue)
js/render/            shared renderers
js/pages/             per-page controllers
js/lib/               helpers (d3 wrappers, capacity, random)
css/                  stylesheets
vendor/               third-party libraries, committed for zero-install use
sw.js                 service worker
manifest.webmanifest  PWA manifest
serve.py              no-cache dev server
```

Structures are wired through `js/structures/registry.js`, which keeps the
data-structure logic, the renderers, and the page controllers separate — adding a
new visualization means registering a module rather than editing shared files.

## Deploying

It's already static: copy the folder to any host. For GitHub Pages, push it to a
`gh-pages` branch (or serve the repo root) — no build step required. Keep
`sw.js` and `manifest.webmanifest` at the site root so the service worker can
claim the whole scope.
