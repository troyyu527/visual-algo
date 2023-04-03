console.log("load algo.js")
//Global Vars.

const 
  ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  RANDSIZE = 100;
const delay = ms => new Promise(res => setTimeout(res, ms));
let inputData,dataModel,setBus,inputList,buttonList,aniList,start,goal
//$("<div/>").addClass(`${className}`).appendTo($("main"))
//init display
let width=$("main").width()
let height=$("main").height()
let rowCount= 20
let columnCount =33
let spacingX=width/columnCount
let spacingY=height/rowCount
//let column=Math.floor(width/spacing)
//let row=Math.floor(height/spacing)
let arr=[]
let moveX=0
let moveY=0

dataModel= new Graph(false)
//console.log(column,row)
//initial map nodes
for(let i=0;i<rowCount;i++){
  let partialArr=[]
  moveX=0
  for(let j=0;j<columnCount;j++){
    partialArr.push(`_${j}_${i}`)
    dataModel.addNode(`_${j}_${i}`,moveX,moveY,1)
    moveX+=spacingX
  }
  arr.push(partialArr)
  moveY+=spacingY
}
//Add boundary condition(Add links)
//1.All rows elements connect to it's previous and next neighbor (first add)
//2.All columns elements connect to it's previous and next neighbor (second add)
//3.All diagonal connections (third & fouth add)(optional)
for(let i=0;i<arr.length;i++){
  arr[i].reduce((accm,curr)=>{
    dataModel.addLink(accm,curr,0)
    return curr
  })
  if(i<arr.length-1){
    for(let j=0;j<arr[i].length;j++){
      dataModel.addLink(arr[i][j],arr[i+1][j],1)
      //(optional for adding diagonal connection)
      // if(j<arr[i].length-1){
      //   dataModel.addLink(arr[i][j],arr[i+1][j+1],1)
      //   dataModel.addLink(arr[i][j+1],arr[i+1][j],1)
      // } 
      
    }
  }

}
let startIndex = Math.floor(Math.random()*dataModel.nodes.length)
let goalIndex = Math.floor(Math.random()*dataModel.nodes.length)
let startNode = dataModel.nodes[startIndex]
let goalNode = dataModel.nodes[goalIndex]

start={name:"Start",node:startNode,x:startNode.x,y:startNode.y,preX:startNode.x,preY:startNode.y}
goal={name:"Goal",node:goalNode,x:goalNode.x,y:goalNode.y,preX:goalNode.x,preY:goalNode.y}
drawMap(dataModel,start,goal)



//Dijkstra(dataModel.nodes[0])
async function Dijkstra(dataModel,start,end){
  let startNode = dataModel.searchNode(start)[0]
  let endNode = dataModel.searchNode(end)[0]
  let MH = new MinHeap();
  let travelList=[]
  let count=0
  startNode.distFromStart = 0;
  startNode.visited = true;
  //load all nodes into min heap
  dataModel.nodes.forEach(node=>MH.enqueue(node))
  //1.Get shortest dist. Node (starting from startNode dist=0)
  let currentNode = MH.dequeue();
  while (MH.values.length > 0) {
    // 2. node => neighborNode
    // 3. neighborNode.distance > currentNode.distance + weight
    // 4. neighborNode.distance = currentNode.distance + weight
    // 5. neighborNode.previous = currentNode, MH decrease neighborNode's priority
    currentNode.neighbor.forEach(neighborNode => {
      if (!neighborNode.visited) {
        if (neighborNode.distFromStart > currentNode.distFromStart + neighborNode.weight) {
          neighborNode.distFromStart = currentNode.distFromStart + neighborNode.weight;
          neighborNode.previous = currentNode;
          MH.siftUp(neighborNode);
        }
      }
    });
    currentNode = MH.dequeue();
    //d3 add animate/transition for visited nodes
    if(currentNode==goal.node) break
      const circlesGroup = d3.select(`.${currentNode.name}`).append('g')

    circlesGroup.append('rect')
      .attr("class","visited")
      .attr('rx', spacingX)
      .attr('ry', spacingY)
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', 'rgba(110, 218, 234, .6)')
      .transition()
      .duration(5)
      .attr('rx', spacingX)
      .attr('ry', spacingY)
      .attr('width', spacingX)
      .attr('height', spacingY)
    
    await delay(5)
    currentNode.visited = true;
    count++
  }
  let current = endNode
  while(current.previous){
    travelList.unshift(current.name)
    current=current.previous
  }
  travelList.unshift(current.name)
  return travelList

}
$(".go").on("click",run)
$(".clear").on("click",clear)
$(".random").on("click",randomLayout)
async function run(){
  dataModel.restart()
  let oldPath = sessionStorage.getItem("path")
  if(oldPath){
    let oldList = oldPath.split(",")
    oldList.forEach(nodeName=>{
      $(`.${nodeName}`).children().css("fill", "DarkGray")
    })
    d3.select(`.${oldList[oldList.length-1]}`).select("text").remove()
  }
  $(".clear").prop('disabled', true)
  $(".random").prop('disabled', true)
  $("svg").attr("pointer-events","none")
  let list = await Dijkstra(dataModel,start.node.name,goal.node.name)
  d3.select("svg").selectAll(".visited").remove()
  for(let node of list){
    $(`.${node}`).children().css({fill: "green", transition: ".1s"})
    await delay(100)
  }
  d3.select(`.${list[list.length-1]}`).append("text").text(d=>d.distFromStart)
  $(".clear").prop('disabled', false)
  $(".random").prop('disabled', false)
  $("svg").attr("pointer-events","auto")
  sessionStorage.setItem("path", list);
}

function clear(){
  dataModel.reset()
  $("svg").remove()
  drawMap(dataModel,start,goal)
}
function randomLayout(){
  clear()
  let topList=[],botList=[],leftList=[],rightList=[]
  //Add wall to 4 borders
  //top
  arr[0].forEach(name=>{
    if(name!==start.node.name && name!==goal.node.name) {
      edit(true,name,"wall")
      topList.push(name)
    }
  })
  topList.pop()
  topList.unshift()
  //bot
  arr[arr.length-1].forEach(name=>{
    if(name!==start.node.name && name!==goal.node.name) {
      edit(true,name,"wall")
      botList.push(name)
    }
  })
  botList.pop()
  botList.unshift()

  //left
  arr.forEach(array=>{
    if( array[0]!==start.node.name && array[0]!==goal.node.name) {
      if(array[0]!=="_0_0" && array[0]!==`_0_${rowCount-1}`)
      edit(true,array[0],"wall")
      leftList.push(array[0])
    } 
  })
  //right
  arr.forEach(array=>{
    if( array[array.length-1]!==start.node.name && array[array.length-1]!==goal.node.name) {
      if(array[array.length-1]!==`_${columnCount-1}_0` && array[array.length-1]!==`_${columnCount-1}_${rowCount-1}`)
      edit(true,array[array.length-1],"wall")
      rightList.push(array[array.length-1])
    } 
  })
  let totalList=[leftList,topList,rightList,botList]
  grow(totalList)
  
  // recursively grow walls from boundaries in 70% portion=>30% of list grow, 70% of viewport length is grow length 
  function grow(totalList){
    let dirList=["left","top","right","bot"]
    let order,growLength,idxList,list
    while(totalList[0].length>rowCount*0.7 || totalList[1].length>columnCount*0.7){
      for(let dir=0;dir<dirList.length;dir++){
        list=totalList[dir]
        order = Math.floor(Math.random()*list.length)
        if(dir==0){
          growLength = Math.floor(Math.random()*(columnCount*0.7))
          idxList = list[order].split("_")
          list.splice(order,1)
          for(let i=1;i<growLength;i++){
            let obsName = `_${i}_${idxList[2]}`
            if( obsName!==start.node.name && obsName!==goal.node.name){
              if(checkNeighborWall(obsName,"left")){
                break
              }else{
                edit(true,obsName,"wall")
              }
            }
          } 
        }else if(dir==2){
          growLength = Math.floor(Math.random()*(columnCount*0.7))
          idxList = list[order].split("_")
          list.splice(order,1)
          for(let i=columnCount-2;i>columnCount-growLength;i--){
            let obsName = `_${i}_${idxList[2]}`
            if( obsName!==start.node.name && obsName!==goal.node.name){
              if(checkNeighborWall(obsName,"right")){
                break
              }else{
                edit(true,obsName,"wall")
              }
            }
          } 
        }else if(dir==1){
          growLength = Math.floor(Math.random()*(rowCount*0.7))
          idxList = list[order].split("_")
          list.splice(order,1)
          for(let i=1;i<growLength;i++){
            let obsName = `_${idxList[1]}_${i}`
            if( obsName!==start.node.name && obsName!==goal.node.name){
              if(checkNeighborWall(obsName,"top")){
                break
              }else{
                edit(true,obsName,"wall")
              }
            }
          } 
        }else if(dir==3){
          growLength = Math.floor(Math.random()*(rowCount*0.7))
          idxList = list[order].split("_")
          list.splice(order,1)
          for(let i=rowCount-2;i>rowCount-growLength;i--){
            let obsName = `_${idxList[1]}_${i}`
            if( obsName!==start.node.name && obsName!==goal.node.name){
              if(checkNeighborWall(obsName,"bot")){
                break
              }else{
                edit(true,obsName,"wall")
              }
            }
          } 
        }
      }
    }
  }
}



function checkNeighborWall(name,direction,layer=1){
  let idx = name.split("_")
 if(direction=="left"){
  if($(`._${idx[1]}_${Number(idx[2])-layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])+layer}_${idx[2]}:has(image)`).length) return true
  if($(`._${idx[1]}_${Number(idx[2])+layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])+layer}_${Number(idx[2])-layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])+layer}_${Number(idx[2])+layer}:has(image)`).length) return true
 }else if(direction=="right"){
  if($(`._${idx[1]}_${Number(idx[2])-layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])-layer}_${idx[2]}:has(image)`).length) return true
  if($(`._${idx[1]}_${Number(idx[2])+layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])-layer}_${Number(idx[2])-layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])-layer}_${Number(idx[2])+layer}:has(image)`).length) return true
 }else if(direction=="top"){
  if($(`._${Number(idx[1])-layer}_${idx[2]}:has(image)`).length) return true
  if($(`._${idx[1]}_${Number(idx[2])+layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])+layer}_${idx[2]}:has(image)`).length) return true
  if($(`._${Number(idx[1])+layer}_${Number(idx[2])+layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])-layer}_${Number(idx[2])+layer}:has(image)`).length) return true
 }else if(direction=="bot"){
  if($(`._${Number(idx[1])-layer}_${idx[2]}:has(image)`).length) return true
  if($(`._${idx[1]}_${Number(idx[2])-layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])+layer}_${idx[2]}:has(image)`).length) return true
  if($(`._${Number(idx[1])-layer}_${Number(idx[2])-layer}:has(image)`).length) return true
  if($(`._${Number(idx[1])+layer}_${Number(idx[2])-layer}:has(image)`).length) return true
 }
 return false
}
function edit(isRandom=false,className,action=undefined){
  let node=d3.select(`.${className}`);
  if(!isRandom) action=$("#obstacle").find(":selected").attr("class")
  
  if(action==="wall"){     
    dataModel.toggleNode(className)
    node.append("image")
      .attr("width",spacingX)
      .attr("height",spacingY)
      .attr("href","./img/wall.png")
      .attr("class","wall")
    node.on("click",toggleEdit)
  }else if(action==="sand"){
    let dataNode = dataModel.searchNode(className)[0]
    dataNode.weight=3
    node.append("image")
      .attr("width",spacingX)
      .attr("height",spacingY)
      .attr("href","./img/sand.png")
      .attr("class","sand")
    node.on("click",toggleEdit)
  }
}  

function toggleEdit(){
  let node = d3.select(this)
  let action=node.select("image").attr("class")
  let dataNode = dataModel.searchNode(node.attr("class"))[0]
  if(action==="wall"){
    dataModel.toggleNode(node.attr("class"))
  }else if(action==="sand"){
    dataNode.weight=1
  }
  node.select("image").remove()
  node.on("click",obstacleEvent)
}
function obstacleEvent(e,d){
  let className = d3.select(this).attr("class")
  edit(false,className)
}
