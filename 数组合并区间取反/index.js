//https://segmentfault.com/q/1010000014945528/a-1020000014946289
const arr = [
  [500,1000],
  [2000,4000],
  [5000,8000],
  [8000,9000],
  [10000,12000],
  [14000,20000],
  [23000,30000],
];
let newArr = arr.reduce((a,v)=>{
if(typeof(a[0])=="number"){
  if(a[1] == v[0]) return [a[0],v[1]]
  //console.log([a,v])
  return [a,v]
}else{
  if(a[a.length-1][1]!=v[0]) { 
    a.push(v)
  }else{ 
    a[a.length-1][1] = v[1]
  }
  return a
}
})
console.log(newArr) 
let resArr = newArr.reduce((a,v)=>{
  if(typeof(a[0])=="number"){
    if(a[0]!=0) return [[0,a[0]],[a[1],v[0]],[v[1],v[1]]]
    return [[a[1],v[0]],[v[1],v[1]]] 
  }else{ 
    a[a.length-1][1]  = v[0];
    if(a.length!=newArr.length) a.push([v[1],v[1]])
  }
  return a 
})
console.log(resArr)