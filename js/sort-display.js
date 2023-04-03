console.log("load sort_display.js")
  function initialElements(){
    console.log("init elements")
    $("svg").remove()
    let size = $("#size-slider").val()
    let range = $("#range-slider").slider("option","values")
    let mainHeight = $("main").height()
    d3.select("main").append("svg")
    .append("g").attr("transform",`translate(0,${mainHeight/2})`).attr("class","arr")
    arr=[]
    
    for(let i=0;i<size;i++){
      let rand=0
      while(rand===0){
        rand = randGen(range[0],range[1])
      }
      arr.push({id:`_${i}_${rand}`,value:rand})
      backupArr=[...arr]
    }
    console.log(arr,size)
    drawArray(arr)
  }
  function drawArray(data){
    let scaleHeight = 18
    let arrSize = data.length
    let arrWidth = $("svg").width()
    let gap = 1
    let elementWidth = arrWidth/arrSize - gap*2
    let elementPosX =gap
    data.forEach(obj=>{
      obj.x=elementPosX
      elementPosX=elementPosX+elementWidth+gap*2
    })
    update(data)
    function update(data){
      let elements =  d3.select(".arr").selectAll("g").data(data,d=>d.id)
      elements
      .join(
        function(enter){
          let group = enter.append("g").attr("class",d=>`element ${d.id}`)
          group
            .attr("transform",d=>`translate(${d.x},0)`)
          group
            .append("polygon")
            .attr("points",d=>{
              let sign = Math.sign(d.value)
              let height = Math.sqrt(Math.abs(d.value))*scaleHeight
              if(sign===1){
                return `0,0 ${elementWidth},0 ${elementWidth},${-height} 0,${-height}`
              }else{
                return `0,0 ${elementWidth},0 ${elementWidth},${height} 0,${height}`
              }
            })
            .attr("fill","#f5ceb3")
            .attr("stroke","black")
            .attr("stroke-width",0.5)
          group
            .append("text")
            .attr("text-anchor","middle")
            .attr("x",`${elementWidth/2}`)
            .attr("y",d=>Math.sign(d.value)===1? -5:15)
            .text(d=>data.length<=30?d.value:"")
          return group
        },
        function(update){
          update
            .transition()
            .duration(speed)
            .attr("transform",d=>`translate(${d.x},0)`)
          update
            .selectAll("polygon")
            .attr("points",d=>{
                let sign = Math.sign(d.value)
                let height = Math.sqrt(Math.abs(d.value))*scaleHeight
                if(sign===1){
                  return `0,0 ${elementWidth},0 ${elementWidth},${-height} 0,${-height}`
                }else{
                  return `0,0 ${elementWidth},0 ${elementWidth},${height} 0,${height}`
                }
              })
          update
            .selectAll("text")
            .attr("x",`${elementWidth/2}`)
          return update
        },
        function(exit){
          return exit.remove()
        }
      )
    }
  }

     
  
  function randGen(max,min){
    let rand=Math.floor(Math.random()*(max-min)+min)
    return rand
  }