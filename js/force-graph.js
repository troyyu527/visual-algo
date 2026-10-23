
(function () {
  const delay = ms => new Promise(r => setTimeout(r, ms));

  let Graph, nodes = [], links = [], adj = new Map();
  let sourceId = 0, targetId = 1, running = false, speed = 550;
  let metrics = { visited: 0, frontier: 0, cost: 0 };

  // Single palette — unvisited is ONE neutral colour so the traversal states pop.
  const C = {
    unvisited: "#8a94a8",
    source:    "#38bdf8",
    target:    "#f472b6",
    frontier:  "#fbbf24",
    current:   "#ffffff",
    visited:   "#475569",
    path:      "#34d399"
  };

  const NARR = {
    ready: "Pick Source & Target (dropdown + click a node), then press Run",
    start: "Searching for the shortest path from Source to Target…",
    visitBFS: id => `Exploring node ${id} (breadth-first)…`,
    visitDij: (id, d) => `Settling node ${id} at distance ${d}…`,
    found: (c, algo) => `Target reached! ${algo} path cost = ${c} (green).`,
    none: "No path exists between Source and Target."
  };

  // ---------------- HUD ----------------
  function ensureHud() {
    if (document.querySelector(".viz-hud")) return;
    $("main").append(`
      <div class="viz-hud">
        <div class="hud-stat"><span class="hud-k">Visited</span><span class="hud-v" id="hud-visited">0</span></div>
        <div class="hud-stat"><span class="hud-k">Frontier</span><span class="hud-v" id="hud-frontier">0</span></div>
        <div class="hud-stat"><span class="hud-k">Path cost</span><span class="hud-v" id="hud-cost">—</span></div>
        <div class="hud-bigo">
          <span class="bigo best">BFS O(V+E)</span>
          <span class="bigo avg">Dijkstra O(E log V)</span>
        </div>
      </div>
      <div class="viz-narration"><span id="narration-text">${NARR.ready}</span></div>`);
  }
  function setHud(sel, val) {
    const el = $(sel); if (!el.length) return;
    el.text(val); el.removeClass("pulse"); void el[0].offsetWidth; el.addClass("pulse");
  }
  function resetHud() {
    metrics = { visited: 0, frontier: 0, cost: 0 };
    $("#hud-visited").text("0"); $("#hud-frontier").text("0"); $("#hud-cost").text("—");
  }
  function narrate(t) { $("#narration-text").text(t); }

  // ---------------- Graph generation ----------------
  function genGraph(n) {
    nodes = d3.range(n).map(i => ({ id: i, state: null, dist: Infinity }));
    links = [];
    const has = (a, b) => links.some(l => (l.source === a && l.target === b) || (l.source === b && l.target === a));
    for (let i = 1; i < n; i++) {
      const j = Math.floor(Math.random() * i);
      links.push({ source: i, target: j, weight: 1 + Math.floor(Math.random() * 9), state: null });
    }
    const extra = Math.floor(n * 0.7);
    for (let k = 0; k < extra; k++) {
      const a = Math.floor(Math.random() * n), b = Math.floor(Math.random() * n);
      if (a !== b && !has(a, b)) links.push({ source: a, target: b, weight: 1 + Math.floor(Math.random() * 9), state: null });
    }
    sourceId = 0;
    buildAdj();
    targetId = farthestFrom(sourceId); // default: a genuinely distant destination
  }
  function buildAdj() {
    adj = new Map(nodes.map(n => [n.id, []]));
    for (const l of links) {
      const s = typeof l.source === "object" ? l.source.id : l.source;
      const t = typeof l.target === "object" ? l.target.id : l.target;
      adj.get(s).push({ v: t, w: l.weight, link: l });
      adj.get(t).push({ v: s, w: l.weight, link: l });
    }
  }
  function farthestFrom(src) {
    const dist = new Map([[src, 0]]); const q = [src]; let far = src, fd = 0;
    while (q.length) {
      const u = q.shift();
      for (const { v } of adj.get(u) || []) {
        if (!dist.has(v)) { dist.set(v, dist.get(u) + 1); if (dist.get(v) > fd) { fd = dist.get(v); far = v; } q.push(v); }
      }
    }
    return far === src && nodes.length > 1 ? (src + 1) % nodes.length : far;
  }
  const nodeById = id => nodes.find(n => n.id === id);

  // ---------------- Visual accessors ----------------
  function nodeColor(n) {
    if (n.id === sourceId) return C.source;   // Source/Target always keep their identity colour
    if (n.id === targetId) return C.target;
    if (n.state === "current") return C.current;
    if (n.state === "path") return C.path;
    if (n.state === "frontier") return C.frontier;
    if (n.state === "visited") return C.visited;
    return C.unvisited;
  }
  const nodeVal = n => (n.id === sourceId || n.id === targetId) ? 8
    : n.state === "current" ? 7 : n.state === "path" ? 6 : n.state === "frontier" ? 5 : 4;
  function linkColor(l) {
    if (l.state === "path") return "#34d399";
    if (l.state === "active") return "#ffffff";
    return "#9db2ce";
  }
  const linkWidth = l => l.state === "path" ? 4 : l.state === "active" ? 2.6 : 1.4;
  const linkParticles = l => (l.state === "active" || l.state === "path") ? 4 : 0;
  const linkParticleColor = l => l.state === "path" ? "#34d399" : "#ffffff";

  function refreshViz() {
    if (!Graph) return;
    Graph.nodeColor(nodeColor).nodeVal(nodeVal)
      .linkColor(linkColor).linkWidth(linkWidth)
      .linkDirectionalParticles(linkParticles).linkDirectionalParticleColor(linkParticleColor);
  }

  // ---------------- Build the 3D graph ----------------
  function render() {
    const el = document.getElementById("graph3d");
    const host = document.querySelector("main");
    const W = host.clientWidth || 820, H = host.clientHeight || 480;
    if (!Graph) {
      Graph = ForceGraph3D({ controlType: "orbit" })(el)
        .backgroundColor("#0b1220")
        .showNavInfo(false)
        .nodeOpacity(0.95)
        .nodeResolution(16)
        .linkOpacity(0.7)
        .linkDirectionalParticleWidth(2.4)
        .nodeLabel(n => `Node ${n.id}${n.id === sourceId ? " (Source)" : n.id === targetId ? " (Target)" : ""}${n.dist != null && n.dist < Infinity ? " · dist " + n.dist : ""}`)
        .onNodeClick(n => { if (!running) onNodeClick(n.id); });
      try { Graph.controls().autoRotate = true; Graph.controls().autoRotateSpeed = 0.7; } catch (e) {}
    }
    Graph.width(W).height(H).graphData({ nodes, links });
    refreshViz();
    buildAdj();
    setTimeout(() => { try { Graph.zoomToFit(500, 40); } catch (e) {} }, 1400);
  }

  // ---------------- Interaction ----------------
  function onNodeClick(id) {
    const mode = ($("#click-mode").val() || "source");
    if (mode === "target") setTarget(id); else setSource(id);
  }
  function setSource(id) {
    if (id === targetId) { narrate("That node is already the Target."); return; }
    sourceId = id; clearStates();
    narrate(`Source → node ${id}. Press Run.`);
  }
  function setTarget(id) {
    if (id === sourceId) { narrate("That node is already the Source."); return; }
    targetId = id; clearStates();
    narrate(`Target → node ${id}. Press Run.`);
  }

  // ---------------- Traversal ----------------
  function clearStates() {
    nodes.forEach(n => { n.state = null; n.dist = Infinity; });
    links.forEach(l => { l.state = null; });
    refreshViz();
  }
  function step() { return delay(Math.max(120, speed)); }

  async function bfs() {
    clearStates(); resetHud();
    if (sourceId === targetId) { narrate("Source and Target are the same node."); return; }
    const seen = new Set([sourceId]); const q = [sourceId]; const prev = new Map();
    refreshViz(); narrate(NARR.start); await step();
    let found = false;
    while (q.length && running) {
      const u = q.shift();
      nodeById(u).state = "current";
      metrics.visited++; setHud("#hud-visited", metrics.visited);
      refreshViz(); narrate(NARR.visitBFS(u)); await step();
      if (u === targetId) { found = true; break; }
      for (const { v, link } of adj.get(u)) {
        if (!seen.has(v)) { seen.add(v); prev.set(v, u); q.push(v); nodeById(v).state = "frontier"; link.state = "active"; }
      }
      metrics.frontier = q.length; setHud("#hud-frontier", q.length);
      refreshViz(); await step();
      nodeById(u).state = "visited"; refreshViz();
    }
    if (running) { if (found) highlightPath(prev, "BFS"); else narrate(NARR.none); }
  }

  async function dijkstra() {
    clearStates(); resetHud();
    if (sourceId === targetId) { narrate("Source and Target are the same node."); return; }
    const done = new Set(); const prev = new Map();
    nodeById(sourceId).dist = 0;
    refreshViz(); narrate(NARR.start); await step();
    let found = false;
    while (running) {
      let u = -1, best = Infinity;
      for (const n of nodes) if (!done.has(n.id) && n.dist < best) { best = n.dist; u = n.id; }
      if (u === -1) break;
      done.add(u);
      nodeById(u).state = "current";
      metrics.visited++; setHud("#hud-visited", metrics.visited);
      refreshViz(); narrate(NARR.visitDij(u, best)); await step();
      if (u === targetId) { found = true; break; }
      for (const { v, w, link } of adj.get(u)) {
        if (done.has(v)) continue;
        const nd = best + w, vn = nodeById(v);
        if (nd < vn.dist) { vn.dist = nd; prev.set(v, u); vn.state = "frontier"; link.state = "active"; }
      }
      metrics.frontier = nodes.filter(n => !done.has(n.id) && n.dist < Infinity).length;
      setHud("#hud-frontier", metrics.frontier);
      refreshViz(); await step();
      nodeById(u).state = "visited"; refreshViz();
    }
    if (running) { if (found) highlightPath(prev, "Dijkstra"); else narrate(NARR.none); }
  }

  // Reconstruct + light up the Source → Target path in green.
  function highlightPath(prev, algo) {
    let cur = targetId, cost = 0, reached = (targetId === sourceId);
    const pathNodes = [];
    while (cur !== undefined) {
      pathNodes.push(cur);
      const p = prev.get(cur);
      if (p !== undefined) {
        const e = adj.get(cur).find(x => x.v === p);
        if (e) { e.link.state = "path"; cost += e.w; }
        if (p === sourceId) reached = true;
      }
      cur = p;
    }
    pathNodes.forEach(id => { if (id !== sourceId && id !== targetId) nodeById(id).state = "path"; });
    metrics.cost = reached ? cost : "—";
    setHud("#hud-cost", metrics.cost);
    refreshViz();
    narrate(reached ? NARR.found(cost, algo) : NARR.none);
  }

  // ---------------- Controls ----------------
  async function run() {
    if (running || !Graph) return;
    running = true;
    $(".start-button, .new-button").prop("disabled", true);
    speed = Number($("#speed").val());
    const algo = $("#algo-select").val();
    if (algo === "Dijkstra") await dijkstra(); else await bfs();
    running = false;
    $(".start-button, .new-button").prop("disabled", false);
  }
  function fresh() {
    if (running) return;
    ensureHud(); resetHud();
    genGraph(Number($("#node-count").val() || 16));
    render();
    narrate(NARR.ready);
  }

  function webglOK() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }

  function init() {
    if (typeof ForceGraph3D === "undefined") {
      $("main").append('<div style="color:#fca5a5;padding:24px;font-weight:600">3D library failed to load — this page needs an internet connection (it loads 3d-force-graph from a CDN) and must be opened through a local server, e.g. <code>python -m http.server</code>.</div>');
      return;
    }
    if (!webglOK()) {
      $("main").append('<div style="color:#fca5a5;padding:24px;font-weight:600">WebGL is unavailable or disabled in this browser, so the 3D view cannot render. Enable hardware acceleration / WebGL and reload.</div>');
      return;
    }
    ensureHud();
    $(".start-button").on("click", run);
    $(".new-button").on("click", fresh);
    $("#node-count").on("input", () => { $(".count-value").text($("#node-count").val()); if (!running) fresh(); });
    $(".count-value").text($("#node-count").val());
    window.addEventListener("resize", () => {
      if (!Graph) return;
      const host = document.querySelector("main");
      Graph.width(host.clientWidth).height(host.clientHeight);
    });
    fresh();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
