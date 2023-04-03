class NodeTree {
  constructor(value=null) {
    this.value = value;
    //this.parent = null;
    this.children=["",""]
    //this.left = null;
    //this.right = null;
    //this.pos = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    let newNode = new NodeTree(value);
    if(this.root === null){
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while(true){
      if(value === current.value) return undefined;
      if(value < current.value){
        if(!current.children[0]){
          //newNode.parent = current.value;
          current.children[0]=newNode 
          return this;
        }
        current = current.children[0];
      } else {
        if(!current.children[1]){
          //newNode.parent = current.value;
          current.children[1]=newNode
          return this;
        } 
        current = current.children[1];
      }
    }
  }
  search(value){
    let current = this.root;
    if(!current){
      return undefined
    }
    let result=[];
    let count = 1;
    while(true){
      if(value === current.value){
        result.push(current);
        return result[0];
      }else if(value < current.value){
        if(current.children[0]){
          current = current.children[0];
          count++
        }else{
          return undefined;
        }
      } else if(value > current.value){
        if(current.children[1]){
          current = current.children[1];
          count++
        }else{
          return undefined;
        };
      };
    };
  }
  clearData(){
    this.root = null;
  }
  
  preOrder() {
    const temp = [];
    helper(this.root);
    return temp;
    function helper(node) {
      if (node) {
        temp.push(node.value);
        helper(node.children[0])
        helper(node.children[1])
      }
    }
  }
  // Original
  // insert(value) {
  //   let newNode = new NodeTree(value);
  //   if(this.root === null){
  //     this.root = newNode;
  //     return this;
  //   }
  //   let current = this.root;
  //   while(true){
  //     if(value === current.value) return undefined;
  //     if(value < current.value){
  //       if(current.left === null){
  //         newNode.parent = current.value;
  //         current.left = newNode;
  //         newNode.pos = 0;
  //         return this;
  //       }
  //       current = current.left;
  //     } else {
  //       if(current.right === null){
  //         newNode.parent = current.value;
  //         current.right = newNode;
  //         newNode.pos = 1;
  //         return this;
  //       } 
  //       current = current.right;
  //     }
  //   }
  // }

  // inOrder(n) {
  //   if (n != null) {
  //     this.inOrder(n.left);
  //     this.path += n.value + " ";
  //     this.inOrder(n.right);
  //   }
  // }

  // postOrder(n) {
  //   if (n != null) {
  //     this.postOrder(n.left);
  //     this.postOrder(n.right);
  //     this.path += n.value + " ";
  //   }
  // }

  // bftt(n) {
  //   if (n != null) {
  //     this.queue.push(n);
  //     for (let i = 0; i < this.queue.length; i++) {
  //       let currentNode = this.queue[i];
  //       if (currentNode != null) {
  //         if (currentNode.left != null) {
  //           this.queue.push(currentNode.left);
  //         }
  //         if (currentNode.right != null) {
  //           this.queue.push(currentNode.right);
  //         }
  //       }
  //     }
  //   }
  // }
}

// let dataModel = new BinarySearchTree()
// let arr= [12,23,2,15,-5,26]
// arr.forEach((ele)=>dataModel.insert(ele))


// let a = dataModel.preOrder()
// console.log(a)
