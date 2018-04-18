function randomAccess(arr,n) { 
    let res_arr = new Array(),
        cp_arr = new Array().concat(arr);
    while(res_arr.length<n&&n>0){
        res_arr.push(cp_arr.sort(() => Math.random() - 0.5)[0])
        res_arr = [...new Set(res_arr)];
    }
    return res_arr;
}