class Node{
  constructor(name,x=null,y=null,weight=undefined){
    this.name=name
    this.visited=false
    this.neighbor=[]
    this.distFromStart=Infinity;
    this.previous = null;
    this.weight=weight
    this.x=x
    this.y=y
  }
  addLink(link){
    this.neighbor.push(link)
  }
}
class Link{
  constructor(source,target,wt=undefined){
    this.source=source
    this.target=target
    this.wt=wt
  }
  
}
class Graph{
  constructor(){
    this.nodes = [];
    this.links = [];
    this.toggleList=[];
  }
  searchNode(name){
    for(let i =0;i<this.nodes.length;i++){
      if(this.nodes[i].name===name) return [this.nodes[i],i]
    }
    return false
  }
  addNode(data,x=null,y=null,wt){
    let node = new Node(data,x,y,wt)
    this.nodes.push(node)
  }
  removeNode(data){
    let [node,index] = this.searchNode(data);
    this.nodes.splice(index,1);
    //remove adjacent links
    this.links = this.links.filter(obj=>{
      return obj.source!==data && obj.target!==data
    })
    //update neighbor
    this.nodes.forEach(obji=>{
      obji.neighbor = obji.neighbor.filter(objj=>objj!==node)
    })
  }
  toggleNode(data){
    let node,index;
    if(this.searchNode(data)){
      [node,index] = this.searchNode(data)
    }
    //move node from nodes list to toggle list
    if(node){
      this.toggleList.push(node);
      this.removeNode(data)
    //move node from toggle list to nodes list if have
    }else{
      for(let index in this.toggleList){
        if(this.toggleList[index].name===data){
          node=this.toggleList[index]
          this.toggleList.splice(index,1)
          break
        } 
      }
      this.nodes.push(node)
      for(let obj of node.neighbor){
        this.addLink(data,obj.name)
      }
    } 
  }
  addLink(sName,tName,wt=undefined){
    if(sName!==tName){
      let sNode = this.searchNode(sName)[0]
      let tNode = this.searchNode(tName)[0]
      if(sNode && tNode){
        let link = new Link(sName,tName,wt)
        this.links.push(link);
        if(!sNode.neighbor.includes(tNode)){
          sNode.neighbor.push(tNode)
        }
        if(!tNode.neighbor.includes(sNode)){
          tNode.neighbor.push(sNode)
        }
      }
    }
  }
  removeLink(sName,tName){
    if(sName!==tName){
      let sNode = this.searchNode(sName)[0]
      let tNode = this.searchNode(tName)[0]
      for(let i=0;i<this.links.length-1;i++){
        if((this.links[i].source==sName || this.links[i].source==tName) 
        && (this.links[i].target==sName || this.links[i].target==tName)){
          this.links.splice(i,1)
          break
        }
      }
      sNode.neighbor=sNode.neighbor.filter(node=>node!==tNode)
      tNode.neighbor=tNode.neighbor.filter(node=>node!==sNode)
    }
  }
  
  DFSearch(starter){
    let result = []
    let startNode = this.searchNode(starter)
    if(startNode) helper(startNode,this)
    function helper(node,graphObj){
      node.visited=true
      result.push(node.name)
      node.neighbor.forEach(id=>{
        let neighborNode = graphObj.nodes.filter(obj=>obj.id===id)[0]
        if(!neighborNode.visited) helper(neighborNode,graphObj)
      })
    }
    this.nodes.forEach(obj=>obj.visited=false)
    return result
  }
  bfSearch(starter){

  }
  //initial datamodel not obsticle
  restart(){
    this.nodes.forEach(node=>{
      node.visited=false;
      node.distFromStart=Infinity;
      node.previous=null;
    })
  }
  //initial datamodel and clean obsticle
  reset(){
    while(this.toggleList.length){
      let node=this.toggleList.pop()
      this.nodes.push(node)
      for(let obj of node.neighbor){
        this.addLink(node.name,obj.name)
      }
    }
    this.nodes.forEach(node=>{
      node.weight=1;
      node.visited=false;
      node.distFromStart=Infinity;
      node.previous=null;
    })
  }
  clearData(){
    this.nodes = [];
    this.links = [];
    this.countID = 0;
  }
}

class MinHeap {
  constructor() {
    this.values = [];
  }
  enqueue(node) {
    // check if the priority queue is empty
    if (this.values.length === 0) {
      this.values.push(node);
      return true;
    }
    this.values.push(node);
    this.siftUp(node)
  }
  dequeue() {
    if (this.values.length === 0) {
      return null;
    }
    if (this.values.length === 1) {
      let removedNode = this.values.pop();
      return removedNode;
    }
    // extract first node and move last node to the fist of the list
    [this.values[0],this.values[this.values.length-1]]=[this.values[this.values.length-1],this.values[0]]
    let removedNode = this.values.pop();
    this.siftDown(0);
    return removedNode;
  }
 siftDown(i) {
    let smallest;
    let l = i * 2 + 1;
    let r = i * 2 + 2;
    if (
      l <= this.values.length - 1 &&
      this.values[l].distFromStart <
        this.values[i].distFromStart
    ) {
      smallest = l;
    } else {
      smallest = i;
    }

    if (
      r <= this.values.length - 1 &&
      this.values[r].distFromStart <
        this.values[smallest].distFromStart
    ) {
      smallest = r;
    }

    if (smallest != i) {
      // swap
      [this.values[i],this.values[smallest]]=[this.values[smallest],this.values[i]]
      this.siftDown(smallest);
    }
  }
  siftUp(node) {
    let newIndex = this.values.indexOf(node);
    let parentIndex = Math.floor((newIndex - 1) / 2);
    while (
      parentIndex >= 0 &&
      this.values[newIndex].distFromStart <
        this.values[parentIndex].distFromStart
    ) {
      // swap node and its parent node
      [this.values[parentIndex],this.values[newIndex]]=[this.values[newIndex],this.values[parentIndex]]
      // update index number
      newIndex = parentIndex;
      parentIndex = Math.floor((newIndex - 1) / 2);
    }
  }
}
// let g = new Graph(false)

// g.addNode("A")
// g.addNode("B")
// g.addNode("C")
// g.addNode("D")
// g.addNode("E")
// g.addNode("F")
// //console.log(g.nodes)
// g.addLink("A","B")

// g.addLink("A","C")

// g.addLink("B","D")

// g.addLink("D","E")

// g.addLink("F","D")
// //console.log(g.links)
// // //g.addLink("D","F")
// // //g.addLink("C","F")
// // //console.log(g)
// // //console.log(g)
// g.toggleNode("A")
// g.toggleNode("D")
// g.toggleNode("D")
// // // console.log(g.DFSearch("A"))
// // // console.log(g)
// // // //g.nodes.forEach(obj=>console.log(obj.neighbor))
// // g.toggleNode("A")
// // g.toggleNode("A")
// g.nodes.forEach(node=>console.log(node.name,node.neighbor))
