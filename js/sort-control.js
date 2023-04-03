console.log("load sort_control.js")
  let arrSize = $("#size-slider")
  //Adjust legend
  if(className==="InsertionSort"){
    $(".color-swap").css("background-color","brown")
    $(".text-swap").text("Insert")
  }
  if(className==="QuickSort"){
    $(".legend-pivot").css('display', "flex");
  }

  $(".size-value").text(arrSize.val())
  // let minusBtn = $(".control-minus")
  // let plusBtn = $(".control-plus")
  // let slidertip = $(".current-value")
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
    console.log(algo)
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
    restartEvent()
  }
  function restartEvent(){
    $(".restart-button").on("click",function(){
      $("#size-slider").prop('disabled', false);
      $("#range-slider").slider("enable")
      $(".new-button").prop('disabled', false);
      $(".start-button").css("display","inline")
      $(".restart-button").css("display","none")
      arr=[...backupArr]
      mainHeight = $("main").height()
      $("svg").remove()
      d3.select("main").append("svg")
      .append("g").attr("transform",`translate(0,${mainHeight/2})`).attr("class","arr")
      drawArray(arr)
    })
  }
  function pauseEvent(){
    return new Promise(res=>{
      let resume = function(){
        $(".resume-button").css("display","none")
        $(".pause-button").css("display","inline")
        speed=findSpeed()
        isPause=false;
        res();
      }
      $(".resume-button").on("click",resume)
    },{once:true})
  }
  function findSpeed(){
    let selection=$("#speed").find(":selected").val()
    return Number(selection)
  }