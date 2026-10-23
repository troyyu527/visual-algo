// Single point of truth for the d3 dependency.
//
// d3 is loaded as a local UMD <script> (vendor/d3.min.js), which sets the
// global `window.d3`. This shim re-exports it so modules can still do
// `import d3 from "../lib/d3.js"` and stay decoupled from how d3 is delivered —
// swapping the source (CDN, npm, a different build) is a one-line change here.
export default window.d3;
