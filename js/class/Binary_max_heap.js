export class BinaryMaxHeap {
  constructor(type="max"){
    this.values = [];
    this.levels = 1
    this.type = type            // "max" | "min"
  }
  setType(type){
    this.type = type
    return this
  }
  // Does `a` outrank `b` — i.e. belong ABOVE it in the tree? This is the only
  // place the heap's direction lives: a max-heap puts larger values on top, a
  // min-heap smaller ones. Everything else (siftUp/siftDown) is direction-free.
  outranks(a,b){
    return this.type==="min" ? a<b : a>b
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
        if(!this.outranks(element,parent)) break;
        swapList.push(parent)
        this.values[parentIdx] = element;
        this.values[idx] = parent;
        idx = parentIdx;
    }
    return swapList
  }
  // `start` defaults to the root, which is what insert/extract/replace need.
  // Floyd's build-heap sifts down from every parent, so it passes an index.
  siftDown(start=0){
    let idx = start
    const length = this.values.length;
    const element = this.values[start];
    let swapList=[]
    while(true){
        let leftChildIdx = 2* idx +1;
        let rightChildIdx = 2*idx +2;
        let leftChild,rightChild;
        let swap = null;
        if(leftChildIdx < length){
            leftChild = this.values[leftChildIdx];
            if(this.outranks(leftChild,element)){
                swap = leftChildIdx;
            }
        }
        if(rightChildIdx<length){
            rightChild = this.values[rightChildIdx];
            if(
                (swap=== null && this.outranks(rightChild,element)) ||
                (swap !== null && this.outranks(rightChild,leftChild))
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
  // Drop a new value straight onto the root and return the old one. The caller
  // sifts down, as with insert/siftUp. The heap keeps its size and levels, so
  // this is one sift rather than the two an extract-then-insert would cost.
  replace(element){
    let max = this.values[0];
    if(this.values.length) this.values[0] = element;
    return max
  }
  // Take an arbitrary array as-is. The heap property is NOT restored — that is
  // exactly what heapify() is for, and seeing the un-heaped tree first is the
  // point of the demo.
  load(values){
    this.values = [...values]
    this.levels = this.values.length ? Math.floor(Math.log2(this.values.length))+1 : 1
    return this
  }
  // The parents, last to first. Everything from values.length/2 onward is a
  // leaf, and a leaf is already a valid heap of one — which is why Floyd's
  // skips the entire back half of the array.
  parentIndexes(){
    const out = []
    for(let i = Math.floor(this.values.length/2)-1; i>=0; i--) out.push(i)
    return out
  }
  // Floyd's build-heap: sift down every parent, bottom-up. O(n), not O(n log n)
  // like inserting the values one at a time — most nodes sit near the bottom
  // and barely move, and the few that can travel far are near the top.
  // Returns one entry per pass so a caller can animate them.
  heapify(){
    return this.parentIndexes().map(i=>({index:i, swaps:this.siftDown(i)}))
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

