class NodeQueue {
  constructor(value=undefined){
    this.value = value;
    this.next = null;
  }
}
class Queue {
  constructor(){
    this.first = null
    this.last = null
    this.size = 0;
  }
  enqueue(value){
    let newNode =new NodeQueue(value);
    if(!this.first){
      this.first=newNode;
      this.last=newNode;
    }else{
      this.last.next = newNode;
      this.last = newNode;
    }
    this.size++;
  }
  dequeue(){
    if(!this.first) return undefined;
    let temp = this.first;
    if(this.first===this.last){
      this.last=null;
    }
    this.first = this.first.next;
    this.size--;
    return temp.value;
  }
  print(){
    let arr = [];
    let current = this.first
    while(current){
      arr.push(current.value)
      current = current.next
    }
    return arr
  }
  clearData(){
    this.first = null
    this.last = null
    this.size = 0;
  }
}

