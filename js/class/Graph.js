class NodeG{
  constructor(id,name,x=null,y=null,weight=undefined){
    this.id=id
    this.name=name
    this.neighbor=[]
    this.x=x
    this.y=y
  }
}
class LinkG{
  constructor(source,target,wt=undefined){
    this.source=source
    this.target=target
    this.wt=wt
  }
  
}
export class Graph{
  constructor(directed=true){
    this.nodes = [];
    this.links = [];
    this.countID = 0;
    this.directed=directed
    this.toggleList={}
    //this.toggleLinkList={}
  }
  searchNode(data){
    if(this.nodes.length){
      let result = this.nodes.filter(obj=>obj.name===data)
      return result.length ? result[0]:false;
    }
    return false
  }
  searchNodeByID(dataID){
    if(this.nodes.length){
      let result = this.nodes.filter(obj=>obj.id===dataID)
      return result.length ? result[0]:false;
    }
    return false
  }
  addNode(data,x=null,y=null,wt){
    if(!this.searchNode(data)){
      this.countID++
      let node = new NodeG(this.countID,data,x,y,wt)
      this.nodes.push(node)
    }
  }
  removeNode(data){
    let index = ""
    let id =""
    this.nodes.forEach((obj,i)=>{
      if(obj.name===data){
        index = i;
        id = obj.id;
      }
      //obj.neighbor=obj.neighbor.filter(neighborID=>neighborID!==id)
      obj.neighbor=this.getNeighbor(obj.name)
    })
    
    index ||index===0?this.nodes.splice(index,1):"";
    //remove adjacent links
    this.links = this.links.filter(obj=>{
      return obj.source!==id && obj.target!==id
    })
    
  }
  toggleNode(data){
    let index = ""
    let id =""
    //console.log(data)
    //console.log(this.searchNode(data))
    if(this.searchNode(data)){
      this.nodes.forEach((obj,i)=>{
        if(obj.name===data){
          index=i;
          id=obj.id;
          this.toggleList[id]=obj;
          obj.links=[]
        }
        obj.neighbor=obj.neighbor.filter(neighborID=>neighborID!==id)
      })
      this.nodes.splice(index,1);
      //remove adjacent links
      this.links = this.links.filter(obj=>{
        if(obj.source==id || obj.target==id){
          this.toggleList[id].links.push(obj)
        }
        return obj.source!==id && obj.target!==id
      })
      //update neighbor list foe all nodes
      this.nodes.forEach(node=>{
        node.neighbor=this.getNeighbor(node.name)
      })
    }else{
      for(let nodeID in this.toggleList){
        if(this.toggleList[nodeID].name===data){
          
          let obj= this.toggleList[nodeID]
          let links=obj.links
          this.nodes.push(obj)
          this.links = this.links.concat(links)
          delete obj.links
          delete this.toggleList[nodeID]
        }
      }
      this.nodes.forEach(node=>{
        node.neighbor=this.getNeighbor(node.name)
      })
    }
    
    
      
      
  }
  addLink(sName,tName,wt=undefined){
    if(sName!==tName){
      let sObj = this.nodes.find(obj=>obj.name===sName)
      let tObj = this.nodes.find(obj=>obj.name===tName)
    
      if(sObj && tObj){
        let link = new LinkG(sObj.id,tObj.id,wt)
        let isInclude = false
        this.links.forEach(obj=>{
          if(obj.source===sObj.id && obj.target===tObj.id){
            isInclude=true
          }
        })
        // this.nodes.forEach(obj=>{
        //   if(obj.id===link.source) obj.neighbor.push(link.target)
        //   if(!this.directed){
        //     if(obj.id===link.target) obj.neighbor.push(link.source)
        //   }
        // })
        this.nodes.forEach(node=>{
          node.neighbor=this.getNeighbor(node.name)
        })
        isInclude? "": this.links.push(link);
      }

    }
  }
  removeLink(sName,tName){
    if(sName!==tName){
      let sObj = this.nodes.find(obj=>obj.name===sName)
      let tObj = this.nodes.find(obj=>obj.name===tName)
      let index = ""
      this.links.forEach((obj,i)=>{
        if(obj.source===sObj.id && obj.target===tObj.id){
          index=i
        }
      })
      index ||index===0?this.links.splice(index,1):"";
    }
    this.nodes.forEach(node=>{
      node.neighbor=this.getNeighbor(node.name)
    })
  }
  getNeighbor(data){
    
    let dataNode = this.searchNode(data)
    let neighborList=[]
    if(dataNode && this.directed){
      
      let linkList = this.links.filter(obj=>{
        return (obj.source===dataNode.id) 
      })
      linkList.forEach(obj=>neighborList.push(obj.target))
    }else if(dataNode && !this.directed){
      
      let linkList = this.links.filter(obj=>{
        return (obj.source===dataNode.id || obj.target===dataNode.id)
      })
      linkList.forEach(obj=>{
        let testID
        if(obj.source==dataNode.id){
          testID=obj.target
        }else if(obj.target==dataNode.id){
          testID=obj.source
        }
        if(!neighborList.includes(testID)){
          neighborList.push(testID)
        }
      })
    }

    return neighborList
  }
  // ---- Traversals -------------------------------------------------
  // Both return node names in visit order, starting from `starter`. This graph
  // is directed, so they only follow links OUT of a node: anything with no
  // inbound path from the start is unreachable and will not appear.
  //
  // Neighbours are read from the links at traversal time (getNeighbor) rather
  // than the cached node.neighbor list, which removeNode can leave stale.
  // "Seen" is tracked locally, so a traversal reads the graph without
  // mutating it and repeat runs cannot interfere with each other.

  // Depth-first: follow one branch as deep as it goes, then backtrack.
  DFSearch(starter){
    const result = []
    const seen = new Set()
    const visit = name => {
      seen.add(name)
      result.push(name)
      for(const id of this.getNeighbor(name)){
        const next = this.searchNodeByID(id)
        if(next && !seen.has(next.name)) visit(next.name)
      }
    }
    if(this.searchNode(starter)) visit(starter)
    return result
  }

  // Breadth-first: visit every neighbour before going a step further out.
  // Marks on enqueue, so a node is never queued twice.
  bfSearch(starter){
    const result = []
    if(!this.searchNode(starter)) return result
    const seen = new Set([starter])
    const queue = [starter]
    while(queue.length){
      const name = queue.shift()
      result.push(name)
      for(const id of this.getNeighbor(name)){
        const next = this.searchNodeByID(id)
        if(next && !seen.has(next.name)){
          seen.add(next.name)
          queue.push(next.name)
        }
      }
    }
    return result
  }
  clearData(){
    this.nodes = [];
    this.links = [];
    this.countID = 0;
  }
}

