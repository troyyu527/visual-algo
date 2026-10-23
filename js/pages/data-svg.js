// ============================================================================
// Behaviour-preserving module for the SVG data pages (Hash-Table/Tree/Heap/Graph).
//
// This is the original animate.js + data-control.js + data-display.js + data.js,
// moved OFF the fragile global <script> load-order onto ES module imports. The
// logic is unchanged on purpose — these pages must look and behave exactly as
// before. d3 is imported; jQuery stays a global <script> (only `$` is used).
// `className` now comes from <body data-structure="...">, and the inline
// onclick= handlers are bridged to module functions at the bottom.
// ============================================================================
import d3 from "../lib/d3.js";
import { HashTable } from "../class/Hash_table.js";
import { BinarySearchTree } from "../class/Binary_search_tree.js";
import { BinaryMaxHeap } from "../class/Binary_max_heap.js";
import { Graph } from "../class/Graph.js";

const className = document.body.dataset.structure;

// ---- animate.js ----------------------------------------------------------
const delayP = ms => new Promise(res => setTimeout(res, ms));
async function swapArr(source,targetArr,initDelay=0,duration=1000){
  await delayP(initDelay)
  for(const target of targetArr){
    swap(source,"._"+target)
    await delayP(duration)
  }
}
function moveToE(ele1,ele2,delay=0,time=1000){
  let pos1 = getPos(ele1)
  let pos2 = getPos(ele2)
  let x1 = pos1[0]
  let y1 = pos1[1]
  let x2 = pos2[0]
  let y2 = pos2[1]
  let moveX=x2-x1;
  let moveY=y2-y1;
  move(ele1,moveX,moveY,delay,time)
}
function move(ele,x, y,delay=0,time=1000) {
  let element = document.querySelector(`${ele}`)
  if (!element.currentDeltaX) {
    element.currentDeltaX = 0;
  }
  if (!element.currentDeltaY) {
    element.currentDeltaY = 0;
  }
  if (x) {
    element.currentDeltaX = element.currentDeltaX + x;
  }
  if (y) {
    element.currentDeltaY = element.currentDeltaY + y;
  }
  element.style.transition= `all ${time/1000}s`
  element.style.transitionDelay = (delay/1000)+"s"
  element.style.transform="translate(" + element.currentDeltaX + "px, " + element.currentDeltaY + "px)";
}

function swap(e1,e2,delay=0,time=1000){
  moveToE(e1,e2,delay,time)
  moveToE(e2,e1,delay,time)
}
function getPos(ele){
  let div = document.querySelector(`${ele}`);
  let Obj= div.getBoundingClientRect();
  let eX = Obj.x+(Obj.width/2);
  let eY = Obj.y+(Obj.height/2);
  return [eX,eY]
}
// ---- data-control.js -----------------------------------------------------
  
  
  function push(){
    let list =$(`.${className}`).children()
    let include = null
    if(className==="Graph"){
      inputData = $("#inputText").val()
    }else{
      inputData = $("#inputData").val()
    }
    for(const ele of list){
      if(ele.innerText === inputData){
        include = true
        break
      }
    }
    if(!include && inputData){
      setBus(inputData,"push")
    }
  }
  function unshift(){
    let list =$(`.${className}`).children()
    let include = null
    inputData = $("#inputData").val()
    for(const ele of list){
      if(ele.innerText === inputData){
        include = true
        break
      }
    }
    if(!include && inputData){
      setBus(inputData,"unshift")
    }
  }
  function rand(){
    let include = false
    let count=0
    if(className==="Tree"){
      do{
        count++
        include=false
        inputData= Math.floor(Math.random()*(RANDSIZE*2)-(RANDSIZE/2))
        $(".tree-group").find(`._${inputData}`).length?include=true:"";
      }while(include && count<RANDSIZE)
    }else if(className==="Graph"){
      do{
        count++
        include=false
        inputData= ALPHABET[Math.floor(Math.random()*ALPHABET.length)]
        $(".node-group").find(`._${inputData}`).length?include=true:"";
      }while(include && count<ALPHABET.length)
    }else{
      do{
        count++
        include=false
        inputData= Math.floor(Math.random()*(RANDSIZE*2)-(RANDSIZE/2))
        $(`.${className}`).find(`._${inputData}`).length?include=true:"";
      }while(include && count<RANDSIZE)
    }
    if(!include) setBus(inputData,"rand")
  }
  function pop(){
    setBus("","pop")
  }
  function shift(){
    setBus("","shift")
  }
  function replaceRoot(){
    inputData = $("#inputData").val()
    if(inputData!=="") setBus(inputData,"replace")
  }
  function heapifyArray(){
    setBus("","heapify")
  }
  function changeHeapType(){
    setBus($("#heap-type").val(),"setType")
  }
  function setItem(){
    let n = $("#inputData").val();
    if(n!=="") setBus([n,n],"set");
  }
  function getItem(){
    let n = $("#inputData").val();
    if(n!=="") setBus(n,"get")
  }
  function getLink(){
    let sNode = $("#source-node").val();
    let tNode = $("#target-node").val();
    setBus([sNode,tNode],"link")
  }
  function delNode(){
    inputData = $("#inputText").val()
    setBus(inputData,"delNode")
  }
  function delLink(){
    let sNode = $("#source-node").val();
    let tNode = $("#target-node").val();
    setBus([sNode,tNode],"delLink")
  }
  function deleteData(){
    inputData = $("#inputData").val()
    setBus(inputData,"delete")
  }
  function travel(){
    inputData = $("#inputText").val()
    // Graph: if no start node typed, default to the first node so Travel always runs.
    if(className==="Graph" && !inputData){
      let firstCls = $(".node-group .nodeG").first().attr("class")
      if(firstCls){ let parts = firstCls.split("_"); inputData = parts[parts.length-1]; }
    }
    setBus((inputData||"").toUpperCase(),"travel")
  }
  function clearAll(){
    setBus("","clear")
  }
// ---- data-display.js -----------------------------------------------------
  $("<div/>").addClass(`${className}`).appendTo($("main"))
  let initCountGen = 2
  let initCountTree = 2
  let initCountGraphNode = 4
  let initCountGraphLink = 4
  let initCountHeap = 6
  function initialElements(class_name){
    let count=0,countLink=0,checkList=[],linkList=[],rand
    if(class_name==="HashTable"){
      for(let i=0;i<10;i++){
        $("<div/>").addClass(`_${i} box`)
        .appendTo(".HashTable");
      }
      // Seed a few numbers so the table starts populated.
      let seeded=[]
      while(seeded.length<5){
        let n = Math.floor(Math.random()*90)
        if(!seeded.includes(n)){ seeded.push(n); setBus([String(n),String(n)],"set"); }
      }
    }else if(class_name==="Heap"){
      while(count<initCountHeap){
        rand = Math.floor(Math.random()*(RANDSIZE*2)-(RANDSIZE/2))
        if(!checkList.includes(rand)){
          checkList.push(rand)
          dataModel.insert(rand)
          dataModel.siftUp()
          count++
        }
      }
      updateHeap(dataModel)
    
    }else if(class_name==="Tree"){
      while(count<initCountTree){
        rand = Math.floor(Math.random()*(RANDSIZE*2)-(RANDSIZE/2))
        if(!checkList.includes(rand)){
          checkList.push(rand)
          dataModel.insert(Number(rand))
          count++
        }
      }
      updateTree(dataModel.root,true)
    }else if(class_name==="Graph"){
      const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      let gW = Math.max(200, $("main").width()) - 60, gH = Math.max(200, $("main").height()) - 60
      //Add random nodes spread across the whole canvas
      while(count<initCountGraphNode){
        rand = ALPHABET[Math.floor(Math.random()*ALPHABET.length)]
        if(!checkList.includes(rand)){
          checkList.push(rand);
          let index = dataModel.addNode(rand,randGen(gW,50),randGen(gH,50))
          count++
        }
      }
      //Add random links
      while(countLink<initCountGraphLink){
        let isIncluded = false
        let randS = checkList[Math.floor(Math.random()*checkList.length)]
        let remainderList = checkList.slice(checkList.indexOf(randS)+1).concat(checkList.slice(0,checkList.indexOf(randS)))
        let randT = remainderList[Math.floor(Math.random()*remainderList.length)]
        let link =[randS,randT]
        linkList.forEach(arr=>{
          if(arr[0]===randS && arr[1]===randT) isIncluded=true
        })
        if(!isIncluded){
          linkList.push(link)
          dataModel.addLink(link[0],link[1])
          countLink++
        }
      }
      updateGraph(dataModel,true)
    }
  }

function updateHeap(heapModel,action="update",data=null){
    let width = $("main").width(),height = $("main").height(),nodeSize=14,arr=[],count=20,current=-3,
    heap,pending=[],points=[],pause=false,level=3,speed=800,inputNode
    
    heap = heapModel.getTreePositions(width,nodeSize);
    
    // if(action=="input"){
    //   inputNode=heapN[heap.length-1]
    //   heapN.pop()
    // }
    let svg =d3.select(`.${className}`).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform","translate(0,50)")
      .attr("class","heap-group")
    svg
      .append("rect")
      .attr("width", nodeSize*3)
      .attr("height", nodeSize*6)
      .attr("x", (width-nodeSize*3)/2)
      .attr("fill", "#afead7")
      .attr("stroke", "#CCC")
      .attr("stroke-width", 2)
      .attr("y", -nodeSize*6/2);
    
    let lines = svg.selectAll("line").data(heap).enter().append("line")
    lines
      .attr("x1",d=>d.x)
      .attr("y1",d=>d.y)
      .attr("x2",d=>heap[d.parent].x)
      .attr("y2",d=>heap[d.parent].y)
      .attr("stroke", "#CCC")
      .attr("stroke-width", 2)
    let nodeGroups = svg.selectAll("g").data(heap).enter().append("g").attr("class",d=>`heap-node _${d.value}`)
    let circle = nodeGroups.append("circle")
      .attr("cx",d=>d.x)
      .attr("cy",d=>d.y)
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width",1)
      .attr("r",nodeSize)
      .attr("opacity",(d,i)=>i==heap.length-1 && action=="input"? 0:1)
      
      
    let text = nodeGroups.append("text").attr("class","value")
      .attr("x",d=>d.x)
      .attr("y",d=>d.y+4)
      .attr("text-anchor","middle")
      .attr("font-size","12")
      .text((d,i)=>i==heap.length-1 && action=="input"? "":d.value)
      
      
      
    
    //draw input node
    // heap.length guard: an empty heap has no last node, and reading one threw
    // when Remove/Pop was pressed on an empty tree.
    if(action!=="update" && heap.length){
      let input = svg.append("g").attr("class","check-node")
      let lastNodeValue = heap[heap.length-1].value
      // The node floating above the tree carries the incoming value for
      // input/replace; for extract it is an invisible carrier for the old root.
      let checkValue = action==="input" ? lastNodeValue
                     : action==="replace" ? Number(data)
                     : null
      input.append("circle")
        .attr("cx",width/2)
        .attr("cy",(-nodeSize*6/2)/2)
        .attr("r",nodeSize)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width",1)
        .attr("opacity",checkValue!==null?1:0)
      input.append("text")
        .attr("x",width/2)
        .attr("y",(-nodeSize*6/2)/2+4)
        .attr("text-anchor","middle")
        .attr("font-size","12")
        .text(checkValue!==null?checkValue:"")
      if(action==="input"){
        let list = heapModel.siftUp()
        list.unshift(lastNodeValue)
        $("button").addClass("disabled")
        $("button").delay(list.length*1000).queue(function(){
          $(this).removeClass("disabled").dequeue();
          $("svg").remove().dequeue()
          updateHeap(heapModel,"update")
        })
        swapArr(".check-node",list)
      }else if(action==="extract"){
        $("button").addClass("disabled")
        heapModel.extractMax()
        let initList = [heap[0].value,lastNodeValue]
        let list = heapModel.siftDown()
        swapArr(".check-node",initList)
        swapArr("._"+lastNodeValue,list,initList.length*1000)
        $("line").last().delay(1000).queue(function(){$(this).remove().dequeue()})
        $("button").delay((initList.length+list.length)*1000).queue(function(){
          $(this).removeClass("disabled").dequeue();
          $("svg").remove().dequeue()
          updateHeap(heapModel,"update")
        })
      }else if(action==="replace"){
        // Mirror image of "input": the incoming value trades places with the
        // root, then follows the sift-down path instead of sifting up. The
        // tree keeps its size, so no node fades in and no line is removed.
        $("button").addClass("disabled")
        let oldRoot = heap[0].value
        heapModel.replace(Number(data))
        let list = [oldRoot,...heapModel.siftDown()]
        swapArr(".check-node",list)
        $("button").delay(list.length*1000).queue(function(){
          $(this).removeClass("disabled").dequeue();
          $("svg").remove().dequeue()
          updateHeap(heapModel,"update")
        })
      }
    }
  }

  function updateTree(rootNode,init=false){
    let width = $("main").width(),
      height = $("main").height(),
      nodeSize=14,
      treeLayout = d3.tree().size([width,height-100]);
    if(init){
      d3.select(`.${className}`).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform","translate(0,30)")
        .attr("class","tree-group")
    } 
    //convert data to d3 tree
    let treeData = d3.hierarchy(rootNode);
    //set up links & nodes
    let links = treeLayout(treeData).links();
    let nodes = treeLayout(treeData).descendants();
    //links style
    let linkCurve = d3.linkVertical().x(d=>d.x).y(d=>d.y);
    let linkStraight = d => "M" + d.source.x + "," + d.source.y +"H" + d.target.x + "V" + d.target.y;
    let linkGroup = d3.select(`.tree-group`).selectAll("path").data(links)
    let nodeGroup = d3.select(`.tree-group`).selectAll("g").data(nodes,d=>d)
    linkGroup
      .join(
        function(enter){
          return enter
            .append('path')
            .attr('d',linkCurve)
            .attr("fill","none")
            .attr("stroke","black")
            .attr("stroke-width",2); 
        },
        function(update){
          return update
            .attr('d',linkCurve)
            .attr("fill","none")
            .attr("stroke","black")
            .attr("stroke-width",2);
        },
        function(exit){
          return exit
            .remove()
        }
      )
    nodeGroup
      .join(
        function(enter){
          let group = enter.append("g").attr("transform",d=>"translate("+d.x+","+d.y+")")
          let eleGroup = group.append("g").attr("class",d=>`animate__animated _${d.data.value}`)
          eleGroup
            .append("circle")
            .attr("r",nodeSize)
            .attr("fill",function(d){
              if(d.data){
                return "white"
              }else{
                return "gray"
              }
            })
            .attr("stroke","black")
            .attr("stroke-width",2)
          eleGroup 
            .append("text")
            .attr("y",nodeSize/2-2)
            .attr("text-anchor","middle")
            .attr("font-size","0")
            .attr("font-size","12")
            .text(d=>d.data?`${d.data.value}`:"Null")
          return eleGroup
        },
        function(update){
          let group = update
            .attr("transform",d=>"translate("+d.x+","+d.y+")")
          let eleGroup = group
            .append("g")
            .attr("class",d=>`animate__animated _${d.data.value}`)
          eleGroup
            .append("circle")
            .attr("r",nodeSize)
            .attr("fill",function(d){
              if(d.data){
                return "white"
              }else{
                return "gray"
              }
            })
            .attr("stroke","black")
            .attr("stroke-width",2)
          eleGroup 
            .append("text")
            .attr("y",nodeSize/2-2)
            .attr("text-anchor","middle")
            .attr("font-size","0")
            .attr("font-size","12")
            .text(d=>d.data?`${d.data.value}`:"Null")  
          return eleGroup  
        },
        function(exit){
          return exit
            .remove() 
        }
      )
  }  

  function updateGraph(graphModel,init=false){
    let width = $("main").width(),
      height = $("main").height(),
      nodeSize=14,
      radius =13,
      posRad = 150,
      circleStroke = 2,
      lineThick = 2,
      nodeFontSize = radius*1.2,
      pathFontSize = radius,
      arrHeadWidthRatio = 2,
      arrHeadHeightRatio = 2,
      arrowSizeFactor =radius/arrHeadWidthRatio,
      arrowColor = "#aaa"
    if(init){
      let svg = d3
        .select(`.${className}`)
        .append("svg")
        .attr("width",width)
        .attr("height",height)
        //.attr("viewBox",`0,0,${width},${height}`)
        //.attr("preserveAspectRatio","xMidYMid meet")
        //.append("path")
        //.attr("d",`M0,0 L${width/10},0 L${width/10},${height/10} L0,${height/10}`)
      svg
        .append("defs")
        .selectAll("marker")
        .data([{}])
        .enter()
        .append("marker")
        // .attr("id", d => `arrow-${d}`)
        .attr("id","arrow")
        .attr("viewBox", `0 -${arrHeadHeightRatio/2} ${arrHeadWidthRatio} ${arrHeadHeightRatio}`)
        .attr("refX", arrHeadWidthRatio*2)
        .attr("refY", 0)
        .attr("markerWidth", arrowSizeFactor)
        .attr("markerHeight", arrowSizeFactor)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", arrowColor)
        .attr("d", `M0,-${arrHeadHeightRatio/2} L${arrHeadWidthRatio},0 L0,${arrHeadHeightRatio/2}`)
    } 
    let nodes = graphModel.nodes;
    let links = graphModel.links;
    
    //console.log(nodes,links)
    let linkGroup = d3.select("svg").selectAll("g").data(links)
    let nodeGroup = d3.select("svg").selectAll("g").data(nodes,d=>d.name)
    
    linkGroup
      .join(
        function(enter){
          let lineGroup = enter
            .append("g")
            .attr("class",d=>`line-group s_${d.source} t_${d.target}`)
          lineGroup
            .append("line")
            .attr("class","link ")
            .attr("stroke-width", lineThick)
            .attr("stroke",arrowColor)
            .attr("marker-end","url(#arrow)")
            .attr("x1",function(d){
              let sNode = nodes.filter(node=>node.id===d.source)[0]
              d3.select(this).attr("y1",sNode.y)
              return sNode.x
            })
            .attr("x2",function(d){
              let tNode = nodes.filter(node=>node.id===d.target)[0]
              d3.select(this).attr("y2",tNode.y)
              return tNode.x
            })
          return lineGroup
        },
        function(update){
          return update
        },
        function(exit){
          return exit
            .remove()
        }
      )
    
    nodeGroup
      .join(
        function(enter){
          let group = enter
            .append("g")
            .attr("class","node-group")
            .style("cursor","pointer")
            .attr("transform",d=>"translate("+d.x+","+d.y+")")
            .call(drag())
            .on("dblclick",creatLink)
            
          let eleGroup = group
            .append("g")
            .attr("class",d=>`nodeG animate__animated _${d.name}`)
          eleGroup
            .append("circle")
            .attr("class","node")
            .attr("r", radius)
            .attr("fill","white")
            .attr("stroke","black")
            .attr("stroke-width",circleStroke)
          eleGroup 
            .append("text")
            .attr("class","name")
            .attr("y",radius/2-1)
            .attr("text-anchor","middle")
            .attr("font-size",nodeFontSize)
            .text(d=>d.name)
          return eleGroup
        },
        function(update){
          return update
            
        },
        function(exit){
          return exit
            .remove()
        }
      )
    function creatLink(){
      //d3.select(this).on("mousedown.drag",null)
      let sNodeName = d3.select(this).select(".nodeG").attr("class").split("_")
      sNodeName=sNodeName[sNodeName.length-1]
      let transform = d3.select(this).attr("transform")
      let x1 = Number(transform.split(",")[0].split("(")[1])
      let y1 = Number(transform.split(",")[1].split(")")[0])
      
      let finalX = ""
      let finalY = ""
      let newLine = d3.select("svg").append("line").attr("class","temp-line")
        .attr("stroke-width", lineThick)
        .attr("stroke",arrowColor)
        .attr("marker-end","url(#arrow)")
        .attr("x1",x1)
        .attr("y1",y1)

      d3.select("svg")
        .on("mousemove",d=>{
          newLine.attr("x2",d.offsetX).attr("y2",d.offsetY)
        })

      d3.select("svg").on("click",d=>{
        d3.select("svg").on("mousemove",null)
        let visualX = newLine.attr("x2")
        let visualY = newLine.attr("y2")
        let finalName;
        d3.selectAll(".node-group").each(function(){
          let tNodeName = d3.select(this).select(".nodeG").attr("class").split("_")
          tNodeName=tNodeName[tNodeName.length-1]
          let transform = d3.select(this).attr("transform")
          let x2 = Number(transform.split(",")[0].split("(")[1])
          let y2 = Number(transform.split(",")[1].split(")")[0])
          if(Math.abs(x2-visualX)<=15 && Math.abs(y2-visualY)<=15){
            finalX=x2
            finalY=y2
            finalName=tNodeName
          }
        })
        if(finalX && finalY){
          graphModel.addLink(sNodeName,finalName)
          $("svg").remove()
          updateGraph(graphModel,true)
        }else{
          newLine.remove()
        }
        
      })  
      
    }
    function drag(){
      function dragstarted(event, d) {
        d3
          .select(this)
          .select("circle")
          .attr("stroke-width",circleStroke*1.3) 
        d3
          .select(this)
          .select("text")
          .attr("font-weight","bold")
      }
      function dragged(event, d) {
        //update nodes pos
        let posX = Math.max(radius+5,Math.min(width-5-radius,event.x));
        let posY = Math.max(radius+8,Math.min(height-3-radius,event.y));
        d.x = posX
        d.y = posY
        d3.select(this).attr("transform", `translate(${d.x},${d.y})`)
        //update links
        let sline = d3
          .select("svg")
          .selectAll(`g.s_${d.id}`)
          .select("line")
          .attr("x1",posX)
          .attr("y1",posY)
        let tline = d3
          .select("svg")
          .selectAll(`g.t_${d.id}`)
          .select("line")
          .attr("x2",posX)
          .attr("y2",posY)
        
      }
      function dragended(event, d) {
        d3
          .select(this)
          .select("circle")
          .attr("stroke-width",circleStroke)
        d3
          .select(this)
          .select("text")
          .attr("font-weight","normal")
      }
      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
  }
  
  function randGen(max,min){
    let rand=Math.floor(Math.random()*(max-min)+min)
    return rand
  }

  function shuffled(list){
    let arr=[...list]
    for(let i=arr.length-1;i>0;i--){
      let j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]]
    }
    return arr
  }

  function uniqueRandomList(count){
    let out=[]
    while(out.length<count){
      let n=Math.floor(Math.random()*(RANDSIZE*2)-(RANDSIZE/2))
      if(!out.includes(n)) out.push(n)
    }
    return out
  }

// The tree's SHAPE never changes during heapify — only which value sits at each
// slot. getTreePositions builds the node <g>s in heap-index order, so the k-th
// group is heap index k. Updating those groups in place (instead of removing
// the <svg> and rebuilding) is what keeps the animation smooth: no teardown, no
// svgFade re-trigger, no flicker.
function heapNodeGroups(){
  return d3.select(".heap-group").selectAll("g.heap-node")
}
function refreshHeapValues(heapModel){
  heapNodeGroups().each(function(_, k){
    let v = heapModel.values[k]
    let g = d3.select(this)
    g.attr("class", `heap-node _${v}`)   // keep the _value hook in sync
    g.select("text.value").text(v)
  })
}
function highlightHeapIndex(i,on){
  heapNodeGroups().filter((_,k)=>k===i).classed("sifting",on)
}

// "Heapify" from the page description: build a heap out of a given array,
// bottom-up (Floyd's). Shown pass by pass — the subtree root being sifted is
// highlighted, then its values settle in place — because the lesson is WHICH
// subtree gets fixed and in what order.
//   shuffle=true  -> scramble the current values first (the Heapify button)
//   shuffle=false -> rebuild the current arrangement under a new rule (Min/Max toggle)
async function animateHeapify(heapModel, shuffle=true){
  let source = shuffle
    ? (heapModel.values.length>=3 ? shuffled(heapModel.values) : uniqueRandomList(7))
    : [...heapModel.values]
  if(!source.length) source = uniqueRandomList(7)
  heapModel.load(source)

  let kind = heapModel.type==="min" ? "min-heap" : "max-heap"
  $("button").addClass("disabled")
  $("#heap-type").prop("disabled",true)
  $("svg").remove()
  updateHeap(heapModel,"update")               // one draw of the scrambled tree
  $("#heapify-note").html(`<b>Given array:</b> ${source.join(", ")} — <span class="not-heap">not a ${kind} yet</span>`)
  await delayP(1100)

  let swaps = 0
  let order = heapModel.parentIndexes()
  for(const i of order){
    highlightHeapIndex(i,true)                 // "fixing the subtree rooted here"
    await delayP(600)
    swaps += heapModel.siftDown(i).length
    refreshHeapValues(heapModel)               // in place — no rebuild
    highlightHeapIndex(i,true)                 // refresh wiped the class; re-apply
    await delayP(600)
    highlightHeapIndex(i,false)
  }

  let n = source.length
  $("#heapify-note").html(
    `<b>Heapified (${kind}):</b> ${heapModel.values.join(", ")} — ${order.length} sift-down${order.length===1?"":"s"}, `+
    `${swaps} swap${swaps===1?"":"s"}. Floyd's build-heap is <b>O(n)</b>: it skips the `+
    `${n-order.length} leaves entirely. Building by ${n} one-at-a-time inserts is <b>O(n log n)</b>.`
  )
  $("button").removeClass("disabled")
  $("#heap-type").prop("disabled",false)
}
// ---- data.js -------------------------------------------------------------
//Global Vars.
let inputData,dataModel,setBus,inputList,buttonList,aniList
// Heap: true once the tree has just been (re)built and nothing has changed
// since, so a second Heapify press would only redo identical work.
let heapBuilt=false
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const RANDSIZE = 100;
const delay = ms => new Promise(res => setTimeout(res, ms));


// Re-triggerable heartbeat pulse for a hash-table cell. Clears any entrance
// class and forces a reflow so the animation replays every time.
function pulseHashCell($el){
  $el.removeClass("animate__fadeInDown animate__heartBeat");
  $el.each(function(){ void this.offsetWidth; });
  $el.addClass("animate__heartBeat").one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
    $(this).removeClass("animate__heartBeat");
  });
}
//Tree global Vars.



switch(className){
case "HashTable":
  dataModel= new HashTable();
  setBus = (data,act)=>{setHashTable(data,act)};
  inputList=["inputData"];
  buttonList = ["set","get","clear","travel"];
  $("#inputData").attr("placeholder","Number to hash");
  $("#set").text("Insert");
  $("#get").text("Search");
  $("#notice").html("NOTICE: Insert a number — it is hashed into a bucket by <b>index = number mod 10</b> (division method). Numbers that collide chain in the same bucket (max 6). 'Search' pulses a number if present; 'Travel' walks every stored number.")
  break;
case "Tree":
  dataModel= new BinarySearchTree();
  setBus = (data,act)=>{setTree(data,act)};
  inputList=["inputData"];
  buttonList = ["push","rand","clear","travel"];
  $("#notice").html("NOTICE: Binary Search Tree demo here. Pick a traversal from the dropdown, then press Travel to watch it walk the tree — the visit order is printed below. Max nodes = 15")
  $("#notice").append('<div id="travel-path"></div>')
  break;
case "Heap":
  dataModel= new BinaryMaxHeap();
  setBus = (data,act)=>{setHeap(data,act)};
  inputList=["inputData"];
  buttonList = ["push","rand","shift","replace","heapify","clear"];
  $("#notice").html("NOTICE: Heap data takes the form of a binary tree in demo. Use the Max/Min dropdown to switch which value rises to the root. Add/Push inserts and sifts up; Remove/Pop extracts the root and sifts down; Replace Root swaps a new value into the root; Heapify scrambles the values and rebuilds the heap bottom-up. Max tree level = 4")
  $("#notice").append('<div id="heapify-note"></div>')
  break;
case "Graph":
  dataModel= new Graph();
  setBus = (data,act)=>{setGraph(data,act)};
  inputList=["inputText","source-node","target-node"];
  buttonList = ["push","rand","get-link","del-node","del-link","travel","clear"];
  $("#linkInput").attr("class","")
  $("#notice").html("NOTICE: Directed graph demo here. Click & Drag Node to desired position. Double Click Node to add new Link. Pick a traversal, type a start node, then press Travel — the visit order is printed below. Links are one-way, so a traversal only follows arrows out of a node.")
  $("#notice").append('<div id="travel-path"></div>')
}
//init element display
initialElements(className)
//DOM UI display
$("button").each(function(){
  buttonList.includes($(this).attr("id"))?"":$(this).addClass("inactive")
})
$("input").each(function(){
  inputList.includes($(this).attr("id"))?"":$(this).addClass("inactive")
})


//hash table(convert string to 0-255 by matching ASCII code set and add up. Hashing by division )
function setHashTable(data,action){
  switch(action){
    case "set":
    case "rand":
      let result = dataModel.set(data[0],data[1])
      if(result){
        // The number stays visible inside its bucket (no clearing to empty).
        // Drop the entrance class once it finishes so a later heartBeat can play.
        $("<div/>").addClass(`element animate__animated animate__fadeInDown key-${data[0]}`)
        .text(`${data[0]}`)
        .one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",function(){
          $(this).removeClass("animate__fadeInDown")
        })
        .appendTo(`._${dataModel._hash(data[0])}`);
      }
      break;
    case "get":
      let value = dataModel.get(data)
      if(value!==undefined){
        pulseHashCell($(`div.key-${data}`))
      }
      break;
    case "clear":
      $(".box").children().remove();
      dataModel.clearData();
      break;
    case "travel":
      let travelList = dataModel.traversal()
      if(travelList){
        let time =0
        let gap= 500
        $("#travel").addClass("disabled")
        travelList.forEach(ele => {
          $(`div.key-${ele[0]}`).delay(time).queue(function(){
            pulseHashCell($(this))
            $(this).dequeue();
          })
          time+=gap
        });
        $("#travel").delay(travelList.length*gap).queue(function(){
          $(this).removeClass("disabled").dequeue();
        })
      }
      break;
    default: 
      console.log("Can't find matched action");
  }
}

// A printed path or array describes the structure at one moment; any mutation
// makes it stale, and a caption that contradicts the picture is worse than no
// caption. Cleared on every action except the one that produced it.
function clearReadout(){
  $("#travel-path, #heapify-note").empty()
}

//Binary search tree
function setTree(data,action){
  if(action!=="travel") clearReadout()
  switch(action){
    case "push":
    case "rand":
      if(dataModel.preOrder().length<=14){
        if(dataModel.root==null){
          dataModel.insert(Number(data))
          updateTree(dataModel.root,true)
        }else if(!dataModel.search(data)){
          dataModel.insert(Number(data))
          updateTree(dataModel.root)
        }
      }
      break;
    // case "delete":
    //   break;
    case "clear":
      dataModel.clearData()
      $("svg").remove()
      break;
    case "travel":
      // The selected <option> value is a BinarySearchTree method name.
      let order = $("#travel-order").val() || "preOrder"
      let travelList = dataModel[order]()
      if(travelList){
        let time =0
        $("#travel").addClass("disabled")
        $("#travel-order").prop("disabled",true)
        travelList.forEach(ele => {
          $(`g._${ele}`).delay(time).queue(function(){
            $(this)
              .addClass("animate__heartBeat")
              .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",function(){
                $(this)
                  .removeClass("animate__heartBeat")
                })
            $(this).dequeue();
          })
          time+=1000
        });
        showTravelPath(order,travelList)
        $("#travel").delay(travelList.length*1000).queue(function(){
          $(this).removeClass("disabled").dequeue();
          $("#travel-order").prop("disabled",false)
        })
      }
      break;
    default:
      console.log("Can't find matched action");
  }
}

// Print the visit order under the controls. In-Order on a BST comes out
// sorted — the clearest payoff of the structure, so call it out.
function showTravelPath(order,list){
  let sorted = order==="inOrder" ? " &nbsp;<b>← sorted!</b>" : ""
  $("#travel-path").html(`<b>${$("#travel-order option:selected").text()}:</b> ${list.join(" → ")}${sorted}`)
}
//Heap
function setHeap(data,action){
  if(action!=="heapify") clearReadout()
  // Any edit gives a fresh Heapify real work to do again.
  if(["push","rand","shift","replace","clear"].includes(action)) heapBuilt=false
  switch(action){
    case "push":
    case "rand":
      if(dataModel.values.length<15 && !dataModel.isInclud(Number(data))){
        dataModel.insert(Number(data))
        $("svg").remove()
        updateHeap(dataModel,"input",data)
      }
      break;
    case "shift":
      if(dataModel.values.length){
        $("svg").remove()
        updateHeap(dataModel,"extract")
      }
      break;
    case "replace":
      // Documented under Operations: swap a new value into the root and sift
      // it down. Needs a non-empty heap, and the value must be new so the
      // `_value` node classes stay unique.
      if(dataModel.values.length && !dataModel.isInclud(Number(data))){
        $("svg").remove()
        updateHeap(dataModel,"replace",data)
      }
      break;
    case "heapify":
      // Documented under Actions: build a heap out of a given array, bottom-up.
      if($("#heapify").hasClass("disabled")) break;    // an animation is already running
      if(heapBuilt){
        let kind = dataModel.type==="min" ? "min" : "max"
        $("#heapify-note").html(`<b>Already a valid ${kind}-heap.</b> Add, remove, or replace a value first, then Heapify again.`)
        break;
      }
      animateHeapify(dataModel).then(()=>{ heapBuilt=true })
      break;
    case "setType":
      // Switch the whole heap between max and min. Re-heapify the current
      // values under the new rule (no shuffle) so the switch is shown, not
      // just asserted. Every other operation already reads dataModel.type.
      dataModel.setType(data)
      if(dataModel.values.length){
        animateHeapify(dataModel,false).then(()=>{ heapBuilt=true })
      }
      break;
    case "clear":
      dataModel.clearData()
      $("svg").remove()
      break;
    default:
      console.log("Can't find matched action");
  }
}
//Graph
function setGraph(data,action){
  if(action!=="travel") clearReadout()
  switch(action){
    case "push":
    case "rand":
      let gName = String(data).toUpperCase()
      let gW = Math.max(200, $("main").width()) - 60, gH = Math.max(200, $("main").height()) - 60
      if(dataModel.nodes.length===0){
        dataModel.addNode(gName,randGen(gW,50),randGen(gH,50))
        updateGraph(dataModel,true)
      }else if(!dataModel.searchNode(gName)){
        $("svg").remove()
        dataModel.addNode(gName,randGen(gW,50),randGen(gH,50))
        updateGraph(dataModel,true)
      }
      break;
    case "link":
      if(dataModel.nodes.length){
        $("svg").remove()
        dataModel.addLink(data[0].toUpperCase(),data[1].toUpperCase())
        updateGraph(dataModel,true)
      }
      break;
    case "delNode":
      if(dataModel.nodes.length){
        $("svg").remove()
        dataModel.removeNode(data.toUpperCase())
        updateGraph(dataModel,true)
      }
      break;
    case "delLink":
      if(dataModel.nodes.length){
        $("svg").remove()
        dataModel.removeLink(data[0].toUpperCase(),data[1].toUpperCase())
        updateGraph(dataModel,true)
      }
      break;
    case "clear":
      dataModel.clearData()
      $("svg").remove()
      break;
    case "travel":
      // The selected <option> value is a Graph method name.
      let gOrder = $("#travel-order").val() || "DFSearch"
      let travelList = dataModel[gOrder](data)
      if(travelList){
        let time =0
        $("#travel").addClass("disabled")
        $("#travel-order").prop("disabled",true)
        showGraphPath(gOrder,travelList)
        travelList.forEach(ele => {
          $(`g._${ele}`).delay(time).queue(function(){
            $(this).addClass("travel-on")
            $(this)
              .addClass("animate__heartBeat")
              .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",function(){
                $(this)
                  .removeClass("animate__heartBeat")
                })
            $(this).dequeue();
          })
          time+=1000
        });
        $(".nodeG").delay(travelList.length*1000).queue(function(){
          $(this).removeClass("travel-on").dequeue();
        })
        $("#travel").delay(travelList.length*1000).queue(function(){
          $(this).removeClass("disabled").dequeue();
          $("#travel-order").prop("disabled",false)
        })
      }

      break;
    default:
      console.log("Can't find matched action");
  }
}

// Print the visit order, and call out any node the traversal could not reach.
// The graph is directed, so unreachable nodes are the norm, not a bug — saying
// so is the point of showing this.
function showGraphPath(order,list){
  let label = $("#travel-order option:selected").text()
  let missed = dataModel.nodes.map(n=>n.name).filter(name=>!list.includes(name))
  let note = missed.length
    ? ` &nbsp;<span class="unreached">${missed.join(", ")} not reachable from ${list[0]}</span>`
    : ""
  $("#travel-path").html(`<b>${label}:</b> ${list.join(" → ")}${note}`)
}

// ---- onclick bridge --------------------------------------------------------
Object.assign(window, {
  push, rand, pop, unshift, shift, setItem, getItem, getLink,
  delNode, delLink, travel, deleteData, clearAll, replaceRoot,
  heapifyArray, changeHeapType,
});
