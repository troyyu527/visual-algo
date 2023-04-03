console.log("load data.js")
//Global Vars.
let inputData,dataModel,setBus,inputList,buttonList,aniList
const 
  ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  RANDSIZE = 100;
const delay = ms => new Promise(res => setTimeout(res, ms));
//Tree global Vars.



switch(className){
case "Stack":
  dataModel= new Stack();
  setBus = (data,act)=>{setStack(data,act)};
  inputList=["inputData"];
  buttonList = ["push","rand","pop","clear"];
  aniList = {enter:"animate__backInDown",exit:"animate__backOutUp"}
  $("#notice").html("NOTICE: Push action => Add/Push button; Pop action => Remove/Pop button; Max items = 7")
  break;
case "Queue":
  dataModel= new Queue();
  setBus = (data,act)=>{setQueue(data,act)};
  inputList=["inputData"];
  buttonList = ["push","rand","shift","clear"];
  aniList = {enter:"animate__backInLeft",exit:"animate__backOutRight"}
  $("#notice").html("NOTICE: Enqueue action => Add/Push button; Dequeue action => Remove/Pop button; Max items = 7")
  break;
case "LinkedList":
  dataModel= new SinglyLinkedList();
  setBus = (data,act)=>{setLinkedList(data,act)};
  inputList=["inputData"];
  buttonList = ["push","rand","shift","clear"];
  aniList = {enter:"animate__fadeInDown",exit:"animate__fadeOutDown"}
  $("#notice").html("NOTICE: Singly linked list demo here; Max items = 6")
  break;
case "Array":
  dataModel= [];
  setBus = (data,act)=>{setArray(data,act)};
  inputList=["inputData"];
  buttonList = ["push","rand","pop","shift","unshift","clear"];
  aniList = {enter:"animate__fadeInDown",exit:"animate__fadeOutUp"}
  $("#notice").html("NOTICE: Max items = 10")
  break;
case "HashTable":
  dataModel= new HashTable();
  setBus = (data,act)=>{setHashTable(data,act)};
  inputList=["inputKey","inputValue"];
  buttonList = ["set","get","clear","travel"];
  $("#notice").html("NOTICE: Using 'separate chaining' for collision resolution in Demo. Click 'Travel' button to show all stored keys. Hash function: Input => UTF-16 code, Index= K mod M (Division Method) where K= key (w/Prime number), M= 10 (table size), Max chaining = 6")
  break;
case "Tree":
  dataModel= new BinarySearchTree();
  setBus = (data,act)=>{setTree(data,act)};
  inputList=["inputData"];
  buttonList = ["push","rand","clear","travel"];
  $("#notice").html("NOTICE: Binary Search Tree demo here. Depth-first Pre-order traversal is selected for Travel button. Max nodes = 15")
  break;
case "Heap":
  dataModel= new BinaryMaxHeap();
  setBus = (data,act)=>{setHeap(data,act)};
  inputList=["inputData"];
  buttonList = ["push","rand","shift","clear"];
  $("#notice").html("NOTICE: Max Heap data takes the form of a binary tree in demo. Max tree level = 4")
  break;
case "Graph":
  dataModel= new Graph();
  setBus = (data,act)=>{setGraph(data,act)};
  inputList=["inputText","source-node","target-node"];
  buttonList = ["push","rand","get-link","del-node","del-link","travel","clear"];
  $("#linkInput").attr("class","")
  $("#notice").html("NOTICE: Directed graph demo here. Click & Drag Node to desired position. Double Click Node to add new Link. 'Travel' triggered only when starter node typed in 'input data'")
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

//Stack
function setStack(data,action){
  
  switch(action){
    case "push":
    case "rand":
      if(dataModel.print().length<=6){
        dataModel.push({key:data})
        update(dataModel.print(),className,aniList.enter,aniList.exit)
      }
      break;
    case "pop":
      dataModel.pop()
      update(dataModel.print(),className,aniList.enter,aniList.exit)
      break;
    case "clear":
      dataModel.clearData()
      update(dataModel.print(),className,aniList.enter,aniList.exit)
      break;
    default: 
      console.log("Can't find matched action");
  }
  
}

//Queue
function setQueue(data,action){
  switch(action){
    case "push":
    case "rand":
      if(dataModel.print().length<=6){
        dataModel.enqueue({key:data})
        update(dataModel.print(),className,aniList.enter,aniList.exit)
      }
      break;
    case "shift":
      dataModel.dequeue()
      update(dataModel.print(),className,aniList.enter,aniList.exit)
      break;
    case "clear":
      dataModel.clearData()
      update(dataModel.print(),className,aniList.enter,aniList.exit)
      break;
    default: 
      console.log("Can't find matched action");
  }
}

//linked list
function setLinkedList(data,action){
  
  switch(action){
    case "push":
    case "rand":
      if(dataModel.print().length<=5){
        dataModel.push({key:data})
        update(dataModel.print(),className,aniList.enter,aniList.exit)
      }
      break;
    case "shift":
      dataModel.shift()
      update(dataModel.print(),className,aniList.enter,aniList.exit)
      break;
    case "clear":
      dataModel.clearData()
      update(dataModel.print(),className,aniList.enter,aniList.exit)
      break;
    default: 
      console.log("Can't find matched action");
  }
}

//array
function setArray(data,action){
  switch(action){
    case "push":
    case "rand":
      if(dataModel.length<=9){
        dataModel.push({key:data})
        update(dataModel,className,aniList.enter,aniList.exit)
      }
      break;
    case "pop":
      dataModel.pop()
      update(dataModel,className,aniList.enter,aniList.exit)
      break;
    case "shift":
      dataModel.shift()
      update(dataModel,className,aniList.enter,aniList.exit)
      break;
    case "unshift":
      dataModel.unshift({key:data})
      update(dataModel,className,aniList.enter,aniList.exit)
      break;
    case "clear":
      dataModel=[]
      update(dataModel,className,aniList.enter,aniList.exit)
      break;
    default: 
      console.log("Can't find matched action");
  }
}

//hash table(convert string to 0-255 by matching ASCII code set and add up. Hashing by division )
function setHashTable(data,action){
  switch(action){
    case "set":
    case "rand":
      let result = dataModel.set(data[0],data[1])
      if(result){
        $("<div/>").addClass(`element animate__animated key-${data[0]}`)
        //.text(`${data[1]}`)
        .css("background-color",`white`)
        //.css("opacity",`20%`)
        .appendTo(`._${dataModel._hash(data[0])}`);
      }
      break;
    case "get":
      let value = dataModel.get(data)
      $(`div.key-${data}`).addClass("animate__heartBeat").text(`${value}`)
        .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",function(){
          $(this)
            .removeClass("animate__heartBeat")
            .text("")
        })
      break;
    case "clear":
      $(".box").empty();
      dataModel.clearData();
      break;
    case "travel":
      let travelList = dataModel.traversal()
      if(travelList){
        let time =0
        let delay= 0
        $("#travel").addClass("disabled")
        travelList.forEach(ele => {
          $(`div.key-${ele[0]}`).delay(time).queue(function(){
            $(this)
              .addClass("animate__heartBeat")
              .text(`${ele[0]}`)
              .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",function(){
                $(this)
                  .removeClass("animate__heartBeat")
                  .text("")
                })
            $(this).dequeue();
          })
          time+=delay
        });
        $("#travel").delay(travelList.length*delay).queue(function(){
          $(this).removeClass("disabled").dequeue();
        })
      }
      
      break;
    default: 
      console.log("Can't find matched action");
  }
}

//Binary search tree
function setTree(data,action){
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
      let travelList = dataModel.preOrder()
      if(travelList){
        let time =0
        $("#travel").addClass("disabled")
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
        $("#travel").delay(travelList.length*1000).queue(function(){
          $(this).removeClass("disabled").dequeue();
        })
      }
      break;
    default: 
      console.log("Can't find matched action");
  }
}
//Heap
function setHeap(data,action){
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
      $("svg").remove()
      updateHeap(dataModel,"extract")
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
  
  switch(action){
    case "push":
    case "rand":
      if(dataModel.nodes.length===0){
        dataModel.addNode(data.toUpperCase(),randGen(360,40),randGen(360,40))
        updateGraph(dataModel,true)
      }else if(!dataModel.searchNode(data)){
        $("svg").remove()
        dataModel.addNode(data.toUpperCase(),randGen(360,40),randGen(360,40))
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
      let travelList = dataModel.DFSearch(data)
      if(travelList){
        let time =0
        $("#travel").addClass("disabled")
        travelList.forEach(ele => {
          $(`g._${ele}`).delay(time).queue(function(){
            $(this).children("circle").attr("fill","green")
            $(this)
              .addClass("animate__heartBeat")
              .attr("background-color","red")
              .on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",function(){
                $(this)
                  .removeClass("animate__heartBeat")
                  
                })
            $(this).dequeue();
          })
          time+=1000
        });
        $("g circle").delay(travelList.length*1000).queue(function(){
          $(this).attr("fill","white").dequeue();
        })
        $("#travel").delay(travelList.length*1000).queue(function(){
          $(this).removeClass("disabled").dequeue();
        })
      }
      
      break;
    default: 
      console.log("Can't find matched action");
  }
}