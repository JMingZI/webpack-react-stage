// export default 只能用一次
// export default a 后，也可以直接 import a
// 否则 就只能 export { a }，然后 import { a }

function C (){
    console.log("c");
}

var a = 1;
// export default a;

export { C, a };