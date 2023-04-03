const delayP = ms => new Promise(res => setTimeout(res, ms));
async function swapArr(source,targetArr,initDelay=0,duration=1000){
  await delayP(initDelay)
  for(target of targetArr){
    swap(source,"._"+target)
    await delayP(duration)
  }
}
function moveToE(ele1,ele2,delay=0,time=1000){
  let pos1 = getPos(ele1)
  let pos2 = getPos(ele2)
  let x1 = pos1[0]
  let y1 = pos1[1]
  let x2 = pos2[0]
  let y2 = pos2[1]
  let moveX=x2-x1;
  let moveY=y2-y1;
  move(ele1,moveX,moveY,delay,time)
}
function moveToEFlat(ele1,ele2,delay=0,time=1000){
  let pos1 = getPos(ele1)
  let pos2 = getPos(ele2)
  let x1 = pos1[0]
  //let y1 = pos1[1]
  let x2 = pos2[0]
  //let y2 = pos2[1]
  let moveX=x2-x1;
  //let moveY=y2-y1;
  move(ele1,moveX,0,delay,time)
}
function moveTo(ele1,pos,delay=0,time=1000){
  let pos1 = getPos(ele1)
  let x1 = pos1[0]
  let y1 = pos1[1]
  let x2 = pos[0]
  let y2 = pos[1]
  let moveX=x2-x1;
  let moveY=y2-y1;
  move(ele1,moveX,moveY,delay,time)
}
function move(ele,x, y,delay=0,time=1000) {
  let element = document.querySelector(`${ele}`)
  if (!element.currentDeltaX) {
    element.currentDeltaX = 0;
  }
  if (!element.currentDeltaY) {
    element.currentDeltaY = 0;
  }
  if (x) {
    element.currentDeltaX = element.currentDeltaX + x;
  }
  if (y) {
    element.currentDeltaY = element.currentDeltaY + y;
  }
  element.style.transition= `all ${time/1000}s`
  element.style.transitionDelay = (delay/1000)+"s"
  element.style.transform="translate(" + element.currentDeltaX + "px, " + element.currentDeltaY + "px)";
}

function swap(e1,e2,delay=0,time=1000){
  moveToE(e1,e2,delay,time)
  moveToE(e2,e1,delay,time)
}
function swapFlat(e1,e2,delay=0,time=1000){
  moveToEFlat(e1,e2,delay,time)
  moveToEFlat(e2,e1,delay,time)
}
function getPos(ele){
  let div = document.querySelector(`${ele}`);
  let Obj= div.getBoundingClientRect();
  let eX = Obj.x+(Obj.width/2);
  let eY = Obj.y+(Obj.height/2);
  return [eX,eY]
}