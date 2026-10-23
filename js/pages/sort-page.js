// ============================================================================
// Behaviour-preserving module for the sorting pages.
//
// The original sort-control.js + sort-display.js + sort.js, moved off global
// <script> load-order onto an ES module. Logic is unchanged. d3 is imported;
// jQuery + jQuery UI stay global <script>s (the range slider needs jQuery UI,
// and the code binds via .on() so no inline-onclick bridge is required).
// `className` now comes from <body data-structure="...">.
// ============================================================================
import d3 from "../lib/d3.js";

const className = document.body.dataset.structure;

// ---- sort-control.js -----------------------------------------------------
  let arrSize = $("#size-slider")
  //Adjust legend
  // Show the neutral "Unsorted" bar colour so every legend colour is accounted for.
  $("#notice").prepend('<div class="legend"><div class="color" style="background:#7c89a0"></div><div class="text">Unsorted</div></div>');
  if(className==="InsertionSort"){
    $(".color-swap").css("background-color","#a78bfa")
    $(".text-swap").text("Insert")
  }
  if(className==="QuickSort"){
    $(".legend-pivot").css('display', "flex");
  }

  $(".size-value").text(arrSize.val())
  arrSize.on("change",e=>sizeUpdate(e));
  arrSize.on("input",e=>sizeUpdate(e));
  function sizeUpdate(event){
    let value = $("#size-slider").val();
    $(".size-value").text(value)
    if(event.type==="input") initialElements()
  }
  $( function() {
    $("#range-slider").slider({
      range: true,
      min: -100,
      max: 100,
      values: [-50,50],
      slide: function(e,ui) {
        $(".range-value-1").text(ui.values[0]);
        $(".range-value-2").text(ui.values[1]);
        initialElements();
      }
    });
    let rangeStart = $("#range-slider").slider("values",0)
    let rangeEnd = $("#range-slider").slider("values",1)
    $(".range-value-1").text(rangeStart);
    $(".range-value-2").text(rangeEnd);
    initialElements() //init
  });
  //New event
  $(".new-button").on("click",function(){
    initialElements()
  })
  //Start Event
  $(".start-button").on("click",function(){
    $("#size-slider").prop('disabled', true);
    $("#range-slider").slider("disable")
    $(".new-button").prop('disabled', true);
    $(".pause-button").css('display', "inline");
    $(".start-button").css("display","none")

    speed=findSpeed()
    resetMetrics()
    start()
  })
  //Pause Event
  $(".pause-button").on("click",function(){
    speed=0
    isPause=true
    $(".resume-button").css("display","inline")
    $(".pause-button").css("display","none")
  })
  

  function start(){
    algo = className
    switch(algo){
      case "BubbleSort":
        bubbleSort(arr)
        break;
      case "InsertionSort":
        insertionSort(arr)
        break;
      case "SelectionSort":
        selectionSort(arr)
        break;
      case "MergeSort":
        mergeSort(arr)
        break;
      case "HeapSort":
        heapSort(arr)
        break;
      case "QuickSort":
        quickSort(arr)
        break;
    }
  }
  function restart(){
    $(".restart-button").css("display","inline")
    $(".pause-button").css("display","none");
  }
  // Bound ONCE at load. It used to be (re)bound inside restart(), which runs at
  // the end of every sort — so each completed sort stacked another identical
  // handler, and a single Restart click then fired all of them (redraw/reset N
  // times). The button is hidden until a sort finishes, so binding early is safe.
  $(".restart-button").on("click",function(){
    $("#size-slider").prop('disabled', false);
    $("#range-slider").slider("enable")
    $(".new-button").prop('disabled', false);
    $(".start-button").css("display","inline")
    $(".restart-button").css("display","none")
    arr=[...backupArr]
    d3.select("main svg").selectAll("*").remove()
    resetMetrics()
    $("#narration-text").text("Press Run to watch it sort")
    drawArray(arr)
  })
  function pauseEvent(){
    return new Promise(res=>{
      // .one, not .on: the resume handler must fire exactly once and then
      // unbind itself. The old code used .on — stacking a new handler on every
      // pause of a run — and passed {once:true} as a second argument to the
      // Promise constructor, which ignores it. So neither guard actually worked.
      $(".resume-button").one("click",function(){
        $(".resume-button").css("display","none")
        $(".pause-button").css("display","inline")
        speed=findSpeed()
        isPause=false;
        res();
      })
    })
  }
  function findSpeed(){
    let selection=$("#speed").find(":selected").val()
    return Number(selection)
  }
// ---- sort-display.js -----------------------------------------------------

// ------------------------------------------------------------------
// Live metrics + narration state (read/written by markClass in sort.js)
// ------------------------------------------------------------------
let metrics = { comparisons: 0, swaps: 0, start: null };

const BIG_O = {
  BubbleSort:    { best: "O(n)",       avg: "O(n²)",     worst: "O(n²)",     space: "O(1)" },
  InsertionSort: { best: "O(n)",       avg: "O(n²)",     worst: "O(n²)",     space: "O(1)" },
  SelectionSort: { best: "O(n²)", avg: "O(n²)",     worst: "O(n²)",     space: "O(1)" },
  MergeSort:     { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  HeapSort:      { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
  QuickSort:     { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" }
};

const NARRATION = {
  compare: "Comparing elements — deciding their order…",
  swap:    "Out of order — swapping the two elements",
  insert:  "Inserting the key into the sorted region",
  sorted:  "Element locked into its final sorted position",
  pivot:   "Choosing a pivot and partitioning around it"
};

function ensureHud() {
  if (document.querySelector(".viz-hud")) return;
  const name = (typeof className !== "undefined") ? className : "";
  const o = BIG_O[name] || { best: "", avg: "", worst: "", space: "" };
  const html = `
    <div class="viz-hud">
      <div class="hud-stat"><span class="hud-k">Comparisons</span><span class="hud-v" id="hud-comp">0</span></div>
      <div class="hud-stat"><span class="hud-k">Swaps / Moves</span><span class="hud-v" id="hud-swap">0</span></div>
      <div class="hud-stat"><span class="hud-k">Time</span><span class="hud-v" id="hud-time">0.0s</span></div>
      <div class="hud-bigo">
        <span class="bigo best">best ${o.best}</span>
        <span class="bigo avg">avg ${o.avg}</span>
        <span class="bigo worst">worst ${o.worst}</span>
        <span class="bigo space">space ${o.space}</span>
      </div>
    </div>
    <div class="viz-narration"><span id="narration-text">Press Run to watch it sort</span></div>`;
  $("main").append(html);
}

function resetMetrics() {
  metrics = { comparisons: 0, swaps: 0, start: null };
  $("#hud-comp").text("0");
  $("#hud-swap").text("0");
  $("#hud-time").text("0.0s");
}

function bumpMetric(kind) {
  if (metrics.start === null) metrics.start = performance.now();
  if (kind === "comparisons") { metrics.comparisons++; setHud("#hud-comp", metrics.comparisons); }
  if (kind === "swaps") { metrics.swaps++; setHud("#hud-swap", metrics.swaps); }
  $("#hud-time").text(((performance.now() - metrics.start) / 1000).toFixed(1) + "s");
}

function setHud(sel, val) {
  const el = $(sel);
  if (!el.length) return;
  el.text(val);
  el.removeClass("pulse");
  void el[0].offsetWidth; // reflow so the animation can retrigger
  el.addClass("pulse");
}

function narrate(kind) {
  const t = NARRATION[kind];
  if (t) $("#narration-text").text(t);
}

// ------------------------------------------------------------------
// Rendering
// ------------------------------------------------------------------
function initialElements() {
  const size = +$("#size-slider").val();
  const range = $("#range-slider").slider("option", "values");

  let svgSel = d3.select("main svg");
  if (svgSel.empty()) svgSel = d3.select("main").append("svg");
  svgSel.selectAll("*").remove();

  ensureHud();
  resetMetrics();
  $("#narration-text").text("Press Run to watch it sort");

  arr = [];
  for (let i = 0; i < size; i++) {
    let rand = 0;
    while (rand === 0) rand = randGen(range[0], range[1]);
    arr.push({ id: `_${i}_${rand}`, value: rand });
  }
  backupArr = [...arr];
  drawArray(arr);
}

function drawArray(data) {
  const svgSel = d3.select("main svg");
  const node = svgSel.node();
  if (!node) return;
  const W = node.clientWidth || 800;
  const H = node.clientHeight || 420;
  svgSel.attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "none");

  const margin = { top: 58, right: 14, bottom: 44, left: 38 };
  const innerW = W - margin.left - margin.right;
  const innerH = H - margin.top - margin.bottom;

  // Persistent structure (built once).
  let chart = svgSel.select(".chart");
  if (chart.empty()) {
    chart = svgSel.append("g").attr("class", "chart");
    chart.append("g").attr("class", "axis-y");
    chart.append("line").attr("class", "baseline");
    chart.append("g").attr("class", "arr");
  }
  chart.attr("transform", `translate(${margin.left},${margin.top})`);

  const values = data.map(d => d.value);
  const vmin = d3.min(values);
  const vmax = d3.max(values);
  const dmin = Math.min(0, vmin);
  const dmax = Math.max(0, vmax);

  const x = d3.scaleBand().domain(d3.range(data.length)).range([0, innerW]).paddingInner(0.18).paddingOuter(0.1);
  const y = d3.scaleLinear().domain([dmin, dmax]).nice().range([innerH, 0]);
  // Bars share ONE neutral colour; colour is reserved for algorithm STATES
  // (compare/swap/…) so the legend maps unambiguously. See sort.css.
  const base = y(0);
  const bw = x.bandwidth();
  const showText = data.length <= 35;
  const dur = Math.max(0, speed);

  data.forEach((d, i) => { d._i = i; });

  // y-axis with faint gridlines
  chart.select(".axis-y")
    .transition().duration(dur)
    .call(d3.axisLeft(y).ticks(5).tickSize(-innerW))
    .on("end", function () { d3.select(this).select(".domain").remove(); });

  chart.select(".baseline")
    .attr("x1", 0).attr("x2", innerW)
    .transition().duration(dur)
    .attr("y1", base).attr("y2", base);

  const yTop = d => Math.min(y(d.value), base);
  const barH = d => Math.abs(y(d.value) - base);
  const labelY = d => d.value >= 0 ? yTop(d) - 5 : yTop(d) + barH(d) + 12;

  chart.select(".arr").selectAll("g.element").data(data, d => d.id)
    .join(
      enter => {
        const g = enter.append("g")
          .attr("class", d => `element ${d.id}`)
          .attr("transform", d => `translate(${x(d._i)},0)`);
        g.append("rect")
          .attr("x", 0).attr("width", bw)
          .attr("rx", Math.min(5, bw / 3))
          .attr("y", base).attr("height", 0)
          .transition().duration(dur).delay((d, i) => i * 6).ease(d3.easeCubicOut)
          .attr("y", yTop).attr("height", barH);
        g.append("text")
          .attr("class", "bar-label")
          .attr("text-anchor", "middle").attr("x", bw / 2)
          .attr("y", labelY)
          .text(d => showText ? d.value : "");
        return g;
      },
      update => {
        // Object constancy: each element GLIDES to its new slot.
        update.transition().duration(dur).ease(d3.easeCubicInOut)
          .attr("transform", d => `translate(${x(d._i)},0)`);
        update.select("rect")
          .attr("width", bw).attr("rx", Math.min(5, bw / 3))
          .transition().duration(dur).ease(d3.easeCubicInOut)
          .attr("y", yTop).attr("height", barH);
        update.select("text.bar-label")
          .attr("x", bw / 2).text(d => showText ? d.value : "")
          .transition().duration(dur)
          .attr("y", labelY);
        return update;
      },
      exit => exit.remove()
    );
}

function randGen(max, min) {
  return Math.floor(Math.random() * (max - min) + min);
}

// ---- sort.js -------------------------------------------------------------
//Global Vars.
const 
  RANDSIZE = 100;
const delay = ms => new Promise(res => setTimeout(res, ms));
let arr = []
let speed=500
let algo
let backupArr=[]
let isPause=false

let selectSpeed = $("#speed")

selectSpeed.on("change",e=>{
  speed=findSpeed()
})

async function bubbleSort(arr){
  for(let i=0;i<arr.length-1;i++){
    for (let j=0;j<arr.length-1-i;j++){
      markClass([j,j+1],arr,"compare",true)
      await delay(speed)
      if(arr[j].value>arr[j+1].value){
        if(isPause) await pauseEvent();
        markClass([j,j+1],arr,"compare",false)
        markClass([j,j+1],arr,"swap",true)
        await delay(speed);
        [arr[j],arr[j+1]]=[arr[j+1],arr[j]]; 
        if(isPause) await pauseEvent();
        drawArray(arr)
        await delay(speed)
      }
      if(isPause) await pauseEvent();
      markClass([j,j+1],arr,"compare",false)
      markClass([j,j+1],arr,"swap",false)
    }
    markClass([arr.length-1-i],arr,"sorted",true)
  }
  markClass([0],arr,"sorted",true)
  restart()
  return arr
}

async function insertionSort(arr){
  let i,j,key,sortArr,remainArr
  for(i=1;i<arr.length;i++){
    markClass([i],arr,"compare",true)
    key = arr[i]
    sortArr = arr.slice(0,i)
    remainArr=arr.slice(i+1)
    for(j=0;j<sortArr.length;j++){
      markClass([j],sortArr,"sorted",true)
    }
    for(j=0;j<sortArr.length;j++){
      if(isPause) await pauseEvent();
      markClass([j],sortArr,"sorted",false)
      markClass([j],sortArr,"compare",true)
      await delay(speed)
      if(sortArr[j].value>key.value){
        if(isPause) await pauseEvent();
        markClass([j],sortArr,"compare",false)
        markClass([i],arr,"compare",false)
        markClass([j],sortArr,"insert",true)
        markClass([i],arr,"insert",true)
        sortArr.splice(j,0,key)
        break
      } 
      if(isPause) await pauseEvent();
      markClass([j],sortArr,"compare",false)
      markClass([j],sortArr,"sorted",true)
    }
    if(isPause) await pauseEvent();
    markClass([i],arr,"compare",false)
    await delay(speed)
    if(sortArr.length<i+1) sortArr.push(key)
    arr = sortArr.concat(remainArr)
    if(isPause) await pauseEvent();
    drawArray(arr)
    await delay(speed)
    for(j=0;j<=i;j++){
      if(isPause) await pauseEvent();
      markClass([j],arr,"insert",false)
      markClass([j],arr,"sorted",true) 
    }
  }
  restart()
  return arr
}

async function selectionSort(arr){
  for(let i=0;i<=arr.length-2;i++){
    let minIdx = i;
    markClass([i],arr,"swap",true)
    for(let j=i;j<=arr.length-1;j++){
      markClass([j],arr,"compare",true)
      await delay(speed)
      if(arr[j].value<arr[minIdx].value){
        if(isPause) await pauseEvent();
        markClass([j],arr,"compare",false)
        markClass([minIdx],arr,"swap",false)
        minIdx=j;
        markClass([minIdx],arr,"swap",true)
        markClass([i],arr,"swap",true)
        await delay(speed)
      }
      if(isPause) await pauseEvent();
      markClass([j],arr,"compare",false)
    }
    //markClass([i],arr,"compare",false)
    markClass([i],arr,"swap",true)
    await delay(speed);
    //markClass([minIdx,i],arr,"swap",true)
    [arr[minIdx],arr[i]]=[arr[i],arr[minIdx]]
    if(isPause) await pauseEvent();
    drawArray(arr)
    await delay(speed);
    markClass([i,minIdx],arr,"swap",false)
    markClass([i],arr,"sorted",true)
  }
  markClass([arr.length-1],arr,"sorted",true)
  restart()
  return arr
}

async function mergeSort(arr){
  
  //arr.forEach((obj,i)=>obj.index=i)
  for(let size=1;size<arr.length;size*=2){
    for(let i=0;i<arr.length;i+=size*2){
      await merge(i,i+size)
    }
  }
  arr.forEach((obj,i)=>markClass([i],arr,"sorted",true))
  restart()
  return arr
  async function merge(leftIdx, rightIdx) {
    
    let startIdx=leftIdx
    let size=rightIdx-leftIdx
    let left=[],right=[]
    const result = [];
    
  
    //if(rightIdx>=arr.length) return 
   
    for(let i=0;i<size;i++){
      if(leftIdx<arr.length){
        left.push(arr[leftIdx])
      }
      if(rightIdx<arr.length){
        right.push(arr[rightIdx])
      }
      leftIdx++,rightIdx++
    }
    let leftCopy = [...left]
    let rightCopy = [...right]
    //console.log("left",leftCopy,"right",rightCopy)
    let count =0
    while(left.length && right.length) {
      if(left[0].value <= right[0].value) {
        result.push(left.shift());
        markClass([count],result,"compare",true)
        count++
      } else {
        result.push(right.shift());
        markClass([count],result,"compare",true)
        count++
      }
    }
    while(left.length) {
      result.push(left.shift());
      markClass([count],result,"compare",true)
      count++
    }
    while(right.length) {
      result.push(right.shift());
      markClass([count],result,"compare",true)
      count++
    }
   
    await delay(speed)
    
    await backToArr(result,startIdx)
  
  }
  async function backToArr(mergeArr,start){
    let startCopy=start
    for(let i=0;i<mergeArr.length;i++){
      arr[start]=mergeArr[i]
      if(isPause) await pauseEvent();
      markClass([i],mergeArr,"compare",false)
      markClass([start],arr,"swap",true)
      //markClass([start],arr,"swap",true)
      //markClass([start],arr,"sorted",true)
      start++
    }
    if(isPause) await pauseEvent();
    drawArray(arr)
    await delay(speed)
    mergeArr.forEach((obj,i)=>markClass([i],mergeArr,"swap",false))
  }
}
async function heapSort(arr){
  let heapSize = arr.length-1;
  await buildMaxHeap();
  for(let i =arr.length -1;i>=0;i--){
    markClass([0,i],arr,"swap",true);
    await delay(speed);
    [arr[0],arr[i]] = [arr[i],arr[0]]
    heapSize-=1
    if(isPause) await pauseEvent();
    drawArray(arr);
    await delay(speed);
    if(isPause) await pauseEvent();
    markClass([0,i],arr,"swap",false);
    markClass([i],arr,"sorted",true)
    await heapify(0)
    if(isPause) await pauseEvent();
    drawArray(arr);
    await delay(speed);
  }
  restart()
  return arr
  async function buildMaxHeap(){
    for(let i=Math.floor(heapSize/2);i>=0;i--){
      await heapify(i);
    }
  }
  async function heapify(index){
    let max
    let leftIdx=index*2+1;
    let rightIdx=index*2+2;
    if(leftIdx<=heapSize && arr[leftIdx].value>arr[index].value){
      max=leftIdx;
    }else{
      max=index;
    }
    if(rightIdx<=heapSize && arr[rightIdx].value > arr[max].value){
      max=rightIdx
    }
    markClass([index,max],arr,"compare",true);
    await delay(speed);
    if(isPause) await pauseEvent();
    markClass([index,max],arr,"compare",false);
    if(max!==index){
      markClass([index,max],arr,"swap",true);
      await delay(speed);
      [arr[index],arr[max]]=[arr[max],arr[index]];
      if(isPause) await pauseEvent();
      drawArray(arr);
      await delay(speed);
      markClass([index,max],arr,"swap",false);
      await heapify(max);
    }
  }
}

async function quickSort(arr){
  await sort(0,arr.length-1)
  restart()
  return arr
  async function sort(left,right){
    if(left<right){
      let pivotIdx = await pivot(left,right)
      //left
      await sort(left,pivotIdx-1);
      for(let i=left;i<=pivotIdx;i++){
        markClass([i],arr,"sorted",true);
      }
      //right
      await sort(pivotIdx+1,right);
      for(let i=pivotIdx+1;i<=right;i++){
        markClass([i],arr,"sorted",true);
      }
    }
  }
  async function pivot(start,end){
    markClass([start],arr,"pivot",true);
    let pivot=arr[start];
    let swapIdx=start
    for(let i=start+1;i<=end;i++){
      markClass([i],arr,"compare",true);
      await delay(speed);
      if(pivot.value>arr[i].value){
        if(isPause) await pauseEvent();
        markClass([i],arr,"compare",false);
        swapIdx++
        markClass([i,swapIdx],arr,"swap",true);
        [arr[swapIdx], arr[i]] = [arr[i], arr[swapIdx]];
        if(isPause) await pauseEvent();
        drawArray(arr);
        await delay(speed);
        markClass([i,swapIdx],arr,"swap",false);
      }
      if(isPause) await pauseEvent();
      markClass([i],arr,"compare",false);
    }
    if(isPause) await pauseEvent();
    markClass([start],arr,"pivot",false);
    markClass([start,swapIdx],arr,"swap",true);
    await delay(speed);
    [arr[start],arr[swapIdx]]=[arr[swapIdx],arr[start]];
    if(isPause) await pauseEvent();
    drawArray(arr);
    await delay(speed);
    markClass([start,swapIdx],arr,"swap",false);
    return swapIdx;
  }
}

function markClass(index,array,className,toggle){
  // Feed the live metrics HUD + narration (one event per highlight action).
  if(toggle && typeof bumpMetric === "function"){
    if(className === "compare") bumpMetric("comparisons")
    else if(className === "swap" || className === "insert") bumpMetric("swaps")
    if(typeof narrate === "function") narrate(className)
  }
  for(let i of index){
    let elementID = array[i].id
    if(toggle){
      $(`.${elementID}`).addClass(`${className}`)
    }else{
      $(`.${elementID}`).removeClass(`${className}`)
    }
  }
}

