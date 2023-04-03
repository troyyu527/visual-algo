class HashTable{
  constructor(size=10){
    this.keyMap = new Array(size);
    this.size=size
  }
  _hash(key){
    let totalCount = 0;
    const PRIME = 17;
    for(let i=0;i<Math.min(key.length,this.size);i++){
      let value = key.charCodeAt(i);
      totalCount = (totalCount*PRIME+value) % this.keyMap.length
    }
    return totalCount;
  }
  set(key,value){
    let index = this._hash(key)
    let isIncluded = false
    if(!this.keyMap[index]){
      this.keyMap[index]=[];
    }
    if(this.keyMap[index].length<6){
      this.keyMap[index].forEach(data => {
        data[0]===key? isIncluded=true:""; 
      });
      if(!isIncluded){
        this.keyMap[index].push([key,value]);
        return true
      }else{
        return false
      }
    }else{
      return false
    }
      
  }
  get(key){
    let index = this._hash(key)
    if(this.keyMap[index]){
      for(let i=0;i<this.keyMap[index].length;i++){
        if(this.keyMap[index][i][0]===key){
          return this.keyMap[index][i][1];
        }
      }
    }
    return undefined;
  }
  traversal(){
    let list = [];
    if(this.keyMap){
      this.keyMap.forEach((box)=>{
        if(box) box.forEach((ele)=>{
          list.push(ele)
        })
      })
    }
    return list
  }
  clearData(){
    this.keyMap=new Array(this.size);
  }
}