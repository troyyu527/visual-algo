console.log("load sort.js")
//Global Vars.
let dataModel,setBus,buttonList
const 
  RANDSIZE = 100;
const delay = ms => new Promise(res => setTimeout(res, ms));
let arr = []
let speed=500
let algo
let backupArr=[]
let reset=false
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
    console.log("size",size)
    for(let i=0;i<arr.length;i+=size*2){
      console.log("Two Group",i,i+size)
      await merge(i,i+size)
    }
  }
  arr.forEach((obj,i)=>markClass([i],arr,"sorted",true))
  console.log(arr)
  restart()
  return arr
  async function merge(leftIdx, rightIdx) {
    
    let startIdx=leftIdx
    let size=rightIdx-leftIdx
    let left=[],right=[]
    const result = [];
    
  
    console.log("leftindex",leftIdx,"rightindex",rightIdx)
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
   
    console.log("result",result,startIdx)
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
  for(let i of index){
    let elementID = array[i].id
    if(toggle){
      $(`.${elementID}`).addClass(`${className}`)
    }else{
      $(`.${elementID}`).removeClass(`${className}`)
    }
  } 
}
