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

export class BinarySearchTree {
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

  size(){
    return this.levelOrder().length;
  }

  // ---- Traversals -------------------------------------------------
  // Each returns the node values in visit order, which is exactly what the
  // Travel animation steps through. An empty child slot is "" (see NodeTree),
  // so the falsy check covers both "" and null.

  // Depth-first. The three orders differ only in WHEN the node is visited
  // relative to its subtrees, so they share one walk.
  preOrder(){
    return this.#depthFirst("pre");
  }
  inOrder(){
    return this.#depthFirst("in");
  }
  postOrder(){
    return this.#depthFirst("post");
  }

  #depthFirst(order){
    const out = [];
    (function visit(node){
      if(!node) return;
      if(order === "pre") out.push(node.value);
      visit(node.children[0]);
      if(order === "in") out.push(node.value);
      visit(node.children[1]);
      if(order === "post") out.push(node.value);
    })(this.root);
    return out;
  }

  // Breadth-first: visit every node at one depth before descending.
  levelOrder(){
    const out = [];
    const queue = this.root ? [this.root] : [];
    while(queue.length){
      const node = queue.shift();
      out.push(node.value);
      for(const child of node.children){
        if(child) queue.push(child);
      }
    }
    return out;
  }
}
