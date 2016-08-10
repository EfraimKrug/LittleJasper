
// closure exploration
// with little lisper (littleJesper) in mindset
//
// and scope....

///////////////////////////////////////////////////
// notice - each time the anonymous function is called,
// it assigns j = i; and j is in the local scope so it
// keeps its value until printed to log
//
// function doCounter(){
//     for(var i = 0; i < 5; i++){
//       (function(){
//         var j = i;
//         setTimeout(function timer(){
//           console.log(j);
//       }, j*1000);
//     })();
//   }
// }
//
// doCounter();
//////////////////////////////////////////////
// function outside(){
//   var a = "this is outside";
//   function inside(){
//     console.log(a);
//   }
//   return inside;
// }
//
// var i = outside();
// i();
// console.log("YUP");
// i();
// console.log("NO")
// i();
//   f : function(){
//     console.log(this.x,this.y);
//   }
// }
//
// library.f();

///////////////////////////////////////////////////
// var a = "This is Global Scope";
//
// function outside(x){
//   var a = "This is scoped inside 'outside'";
//   function inside(y){
//     console.log(a, x, y);
//   }
//
// {
//   let x = "x from outside";
//   let y = "y from outside";
//   inside(x);
//   inside(y);
// }
//
// }
//
// outside('x');
// console.log(a);
