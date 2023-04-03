console.log("load data_control.js")
  
  
  function push(){
    let list =$(`.${className}`).children()
    let include = null
    if(className==="Graph"){
      inputData = $("#inputText").val()
    }else{
      inputData = $("#inputData").val()
    }
    for(ele of list){
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
    for(ele of list){
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
  function setItem(){
    let key = $("#inputKey").val();
    let value = $("#inputValue").val();
    if(key && value) setBus([key,value],"set");
  }
  function getItem(){
    let key = $("#inputKey").val();
    setBus(key,"get")
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
    setBus(inputData.toUpperCase(),"travel")
  }
  function clearAll(){
    setBus("","clear")
  }