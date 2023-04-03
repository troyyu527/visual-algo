class NodeS {
  constructor(value=undefined){
    this.value = value;
    this.next = null;
  }
}
// class NodeD{
//   constructor(value){
//       this.value = value;
//       this.next = null;
//       this.prev = null;
//   }
// }

class SinglyLinkedList {
  constructor(){
    this.head = null
    this.tail = null
    this.length = 0;
  }
  push(value){
    let newNode = new NodeS(value);
    if(!this.head){
        this.head = newNode;
        this.tail = this.head;
    } else {
        this.tail.next = newNode;
        this.tail = newNode;
    }
    this.length++;
    return this;
  }
  pop(){
    if(!this.head) return undefined;
    let current = this.head;
    let newTail = current;
    while(current.next){
      newTail = current;
      current = current.next;
  }
    this.tail = newTail;
    this.tail.next = null;
    this.length--;
    if(this.length === 0){
      this.head = null;
      this.tail = null;
    }
    return current;
  }
  shift(){
    if(!this.head) return undefined;
      let currentHead = this.head;
      this.head = currentHead.next;
      this.length--;
    if(this.length === 0){
      this.tail = null;
    }
    return currentHead;
  }
  unshift(value){
    let newNode = new NodeS(value);
    if(!this.head) {
      this.head = newNode;
      this.tail = this.head;
    }
    newNode.next = this.head;
    this.head = newNode;
    this.length++;
    return this;
  }
  get(index){
    if(index < 0 || index >= this.length) return null;
    let counter = 0;
    let current = this.head;
    while(counter !== index){
      current = current.next;
      counter++;
    }
    return current;
  }
  set(index, value){
    let foundNode = this.get(index);
    if(foundNode){
      foundNode.value = value;
      return true;
    }
    return false;
  }
  insert(index, value){
    if(index < 0 || index > this.length) return false;
    if(index === this.length) return !!this.push(value);
    if(index === 0) return !!this.unshift(value);
    
    let newNode = new NodeS(value);
    let prev = this.get(index - 1);
    let temp = prev.next;
    prev.next = newNode;
    newNode.next = temp;
    this.length++;
    return true;
  }
  remove(index){
    if(index < 0 || index >= this.length) return undefined;
    if(index === 0) return this.shift();
    if(index === this.length - 1) return this.pop();
    let previousNode = this.get(index - 1);
    let removed = previousNode.next;
    previousNode.next = removed.next;
    this.length--;
    return removed;
  }
  
  print(){
    let arr = [];
    let current = this.head
    while(current){
      arr.push(current.value)
      current = current.next
    }
    return arr
  }
  clearData(){
    this.head = null
    this.tail = null
    this.length = 0;
  }
}

// class DoublyLinkedList {
//   constructor(){
//       this.head = null;
//       this.tail = null;
//       this.length = 0;
//   }
//   push(value){
//       let newNode = new NodeD(value);
//       if(this.length === 0){
//           this.head = newNode;
//           this.tail = newNode;
//       } else {
//           this.tail.next = newNode;
//           newNode.prev = this.tail;
//           this.tail = newNode;
//       }
//       this.length++;
//       return this;
//   } 
//   pop(){
//       if(!this.head) return undefined;
//       let poppedNode = this.tail;
//       if(this.length === 1){
//           this.head = null;
//           this.tail = null;
//       } else {
//           this.tail = poppedNode.prev;
//           this.tail.next = null;
//           poppedNode.prev = null;
//       }
//       this.length--;
//       return poppedNode;
//   }
//   shift(){
//       if(this.length === 0) return undefined;
//       let oldHead = this.head;
//       if(this.length === 1){
//           this.head = null;
//           this.tail = null;
//       }else{
//           this.head = oldHead.next;
//           this.head.prev = null;
//           oldHead.next = null;
//       }
//       this.length--;
//       return oldHead;
//   }
//   unshift(value){
//       let newNode = new NodeD(value);
//       if(this.length === 0) {
//           this.head = newNode;
//           this.tail = newNode;
//       } else {
//           this.head.prev = newNode;
//           newNode.next = this.head;
//           this.head = newNode;
//       }
//       this.length++;
//       return this;
//   }
//   get(index){
//       if(index < 0 || index >= this.length) return null;
//       let count, current;
//       if(index <= this.length/2){
//           count = 0;
//           current = this.head;
//           while(count !== index){
//               current = current.next;
//               count++;
//           }
//       } else {
//           count = this.length - 1;
//           current = this.tail;
//           while(count !== index){
//               current = current.prev;
//               count--;
//           }
//       }
//       return current;
//   }
//   set(index, value){
//       let foundNode = this.get(index);
//       if(foundNode != null){
//           foundNode.value = value;
//           return true;
//       }
//       return false;
//   }
//   insert(index, value){
//       if(index < 0 || index > this.length) return false;
//       if(index === 0) return !!this.unshift(value);
//       if(index === this.length) return !!this.push(value);

//       let newNode = new NodeD(value);
//       let beforeNode = this.get(index-1);
//       let afterNode = beforeNode.next;
      
//       beforeNode.next = newNode, newNode.prev = beforeNode;
//       newNode.next = afterNode, afterNode.prev = newNode;
//       this.length++;
//       return true;
//   }
//   remove(index){
//     if(index < 0 || index >= this.length) return undefined;
//     if(index === 0) return this.shift();
//     if(index === this.length - 1) return this.pop();
//     let previousNode = this.get(index - 1);
//     let removed = previousNode.next;
//     previousNode.next = removed.next;
//     this.length--;
//     return removed;
//   }
  
//   print(){
//     let arr = [];
//     let current = this.head
//     while(current){
//       arr.push(current.value)
//       current = current.next
//     }
//     console.log(arr);
//   }
//   clearData(){
//     this.head = null
//     this.tail = null
//     this.length = 0;
//   }
// }
