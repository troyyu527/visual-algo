class BinaryMaxHeap {
  constructor(){
    this.values = [];
    this.levels = 1
  }
  isInclud(value){
    let result = false
    this.values.forEach(ele=>{
      if(value===ele) result=true
    })
    return result
  }
  //For any index n, the left child is stored at 2n+1, the right child is at 2n+2
  insert(element){
    this.values.push(element);
    //this.siftUp();
    if(this.values.length>=Math.pow(2,this.levels)){
      this.levels++
    }
  }
  siftUp(){
    let idx = this.values.length - 1;
    const element = this.values[idx];
    let swapList=[]
    while(idx > 0){
        let parentIdx = Math.floor((idx - 1)/2);
        let parent = this.values[parentIdx];
        if(element <= parent) break;
        swapList.push(parent)
        this.values[parentIdx] = element;
        this.values[idx] = parent;
        idx = parentIdx;
    }
    return swapList
  }
  siftDown(){
    let idx = 0
    const length = this.values.length;
    const element = this.values[0];
    let swapList=[]
    while(true){
        let leftChildIdx = 2* idx +1;
        let rightChildIdx = 2*idx +2;
        let leftChild,rightChild;
        let swap = null;
        if(leftChildIdx < length){
            leftChild = this.values[leftChildIdx];
            if(leftChild>element){
                swap = leftChildIdx;
            }
        }
        if(rightChildIdx<length){
            rightChild = this.values[rightChildIdx];
            if(
                (swap=== null && rightChild> element) || 
                (swap !== null && rightChild>leftChild)
            ){
                swap = rightChildIdx;
            }
        }
        if(swap === null) break;
        swapList.push(this.values[swap])
        this.values[idx] = this.values[swap];
        this.values[swap] = element;
        idx=swap;
    }
    return swapList
  }
  extractMax(){
    let max = this.values[0];
    let end = this.values.pop();
    if(this.values.length<Math.pow(2,this.levels-1)){
      this.levels--
    }
    if(this.values.length>0){
        this.values[0]=end;
        //this.siftDown();
    }
    return max
  }
  getTreePositions(width,nodeSize) {
    let nodeList = []
    let w = Math.pow(2, this.levels-1)*nodeSize*5;
    let offsetLength,parentIdx
    for(let lev = 0; lev < this.levels; lev++){
      let interval = w / Math.pow(2, lev);
      let x = width/2 + (interval - w) / 2;
      let y = 1.5*nodeSize + 8*nodeSize * lev;
      lev!==this.levels-1 ? offsetLength=Math.pow(2, lev):offsetLength=this.values.length-Math.pow(2,this.levels-1)+1
      for(let offset = 0; offset < offsetLength; offset++) {
        let idx = Math.pow(2, lev)-1+offset
        idx!==0 ? parentIdx=Math.floor((idx-1)/2):parentIdx=0
        let node = {value:this.values[idx],x: x + offset * interval, y: y,parent:parentIdx}
        nodeList.push(node)  
      }
    }
    return nodeList;
  }
  clearData(){
    this.values=[]
    this.levels = 1
  }
}

// let heap = new BinaryMaxHeap();
// heap.insert(41);
// heap.insert(39);
// heap.insert(33);
// heap.insert(18);
// heap.insert(27);
// heap.insert(12);
// heap.insert(55);
// let re = heap.getTreePositions(3,{x:400/2, y: 1.5 * 20},{x:1.5 * 20, y:20})
// let arr=[]
// for(let i=0;i<10;i++){
//   let node = {x:400/2- 50*(i+3),y:20/2}
//   node.value=Math.ceil((99 * Math.random()));
//   node.inHeap = false
//   //console.log(node)
//   arr.push(node)
// }
// for (let i=0;i<re.length;i++){
//   re[i].value=0;
//   re[i].inHeap = true;
//   arr.push(re[i]);
// }
// console.log(heap)
// heap.extractMax()
// console.log(heap)
// console.log(arr)