class NodeStack {
  constructor(value=undefined){
    this.value = value;
    this.next = null;
  }
}
class Stack {
  constructor(){
    this.first = null
    this.last = null
    this.size = 0;
  }
  push(value){
    if(this.searchData(value)){
      return null
    }
    let newNode = new NodeStack(value)
    
    if(!this.first){
      this.first = newNode
      this.last = newNode
    }else{
      let temp = this.first
      this.first = newNode
      this.first.next=temp;
    }
    this.size++
  }
  pop(){
    if(!this.first) return null;
    let temp = this.first
    if(this.first === this.last){
      this.last = null
    }
    this.first = this.first.next
    this.size--;
    return temp.value
  }
  searchData(value){
    let count=0;
    if(this.size==0){
      return null
    }else{
      let temp = this.first
      for(let i=1;i<=this.size;i++){
        
        if(value==temp.value){
          count = i
          return count
        }else{
          temp=temp.next
        }
      }
      return null
    }
  }
  print(){
    let list =[];
    let current = this.first
    
    while(current){
      list.push(current.value)
      current = current.next
    }
    return list
  }
  // deleteData(value){
  //   let order = this.searchData(value)
  //   for(let i=1;i<=order;i++){
  //     console.log(this.pop())
  //   }
  // }
  clearData(){
    this.first = null
    this.last = null
    this.size = 0;
    // let order = this.searchData(this.last)
    // for(let i=1;i<=order;i++){
    //   this.pop()
    // }
  }
}

