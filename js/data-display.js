console.log("load data_display.js")
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
      //Add random nodes
      while(count<initCountGraphNode){
        rand = ALPHABET[Math.floor(Math.random()*ALPHABET.length)]
        if(!checkList.includes(rand)){
          checkList.push(rand);
          let index = dataModel.addNode(rand,randGen(360,40),randGen(360,40))
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
    }else{
      while(count<initCountGen){
        rand = Math.floor(Math.random()*(RANDSIZE*2)-(RANDSIZE/2))
        if(!checkList.includes(rand)){
          checkList.push(rand)
          setBus(rand,"rand")
          count++
        }
      }
    }
  }
  function update(data,className,enterAniName="",exitAniName="",isPlay=true,isTravel=false){
    let elements = d3.select(`.${className}`).selectAll("div").data(data,d=>d.key)
    let enter = elements.enter();
    let exit = elements.exit();
    let enterElements = enter.append("div").attr("class",d=>`element animate__animated _${d.key}`).text(d=>d.key)
    //Animate
    if(isPlay){
      enterElements._groups[0].forEach(function(obj){
        obj.classList.add(enterAniName)
      })
      exit._groups[0].forEach(function(obj){
        obj.classList.add(exitAniName)
      })
      exit.transition().duration(1000).remove()
    }else{
      exit.remove()
    }
  }

function updateHeap(heapModel,action="update",data=null){
    let width = $("main").width(),height = $("main").height(),nodeSize=10,arr=[],count=20,current=-3,
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
      .attr("font-size","10")
      .text((d,i)=>i==heap.length-1 && action=="input"? "":d.value)
      
      
      
    
    //draw input node
    if(action!=="update"){
      let input = svg.append("g").attr("class","check-node")
      let lastNodeValue = heap[heap.length-1].value
      input.append("circle")
        .attr("cx",width/2)
        .attr("cy",(-nodeSize*6/2)/2)
        .attr("r",nodeSize)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width",1)
        .attr("opacity",action=="input"?1:0)
      input.append("text")
        .attr("x",width/2)
        .attr("y",(-nodeSize*6/2)/2+4)
        .attr("text-anchor","middle")
        .attr("font-size","10")
        .text(action=="input"?lastNodeValue:"")
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
      }
    }
  }

  function updateTree(rootNode,init=false){
    let width = $("main").width(),
      height = $("main").height(),
      nodeSize=12,
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
    function clearNull(links,nodes){
      let newLinks =links.filter(obj=>obj.target.data!=="")
      let newNodes = nodes.filter(obj=>obj.data!=="")
      return [newLinks,newNodes]
    }
    //let [nLinks,nNodes] = clearNull(links,nodes)
    let linkGroup = d3.select(`.tree-group`).selectAll("path").data(links)
    let nodeGroup = d3.select(`.tree-group`).selectAll("g").data(nodes,d=>d)
    linkGroup
      .join(
        function(enter){
          return enter
            .append('path')
            // .transition()
            // .duration(1000)
            .attr('d',linkCurve)
            .attr("fill","none")
            .attr("stroke","black")
            .attr("stroke-width",2); 
        },
        function(update){
          return update
            // .transition()
            // .duration(1000)
            .attr('d',linkCurve)
            .attr("fill","none")
            .attr("stroke","black")
            .attr("stroke-width",2);
        },
        function(exit){
          return exit
            // .transition()
            // .duration(1000)
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
            // .transition()
            // .duration(1000)
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
            // .transition()
            // .duration(1000)
            .attr("font-size","10")
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
            // .transition()
            // .duration(1000)
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
            // .transition()
            // .duration(1000)
            .attr("font-size","10")
            .text(d=>d.data?`${d.data.value}`:"Null")  
          return eleGroup  
        },
        function(exit){
          return exit
            // .transition()
            // .duration(1000)
            .remove() 
        }
      )
  }  

  function updateGraph(graphModel,init=false){
    let width = $("main").width(),
      height = $("main").height(),
      nodeSize=12,
      radius =10,
      posRad = 150
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