var wholeRun = {
  //"title5","title6", "title7", "title8", "title9"
  //"Title5","Title6", "Title7", "Title8", "Title9"
    titleList: ["title0", "title1", "title2", "title3", "title4"],
    titleList2: ["Title0", "Title1", "Title2", "Title3", "Title4"],
    fillUpLeft : function (){
                 for(i=0;i<this.titleList.length; i++){
                  var str = "div" + i;
                  var elt = document.getElementById(str);
                  elt.style.color = "red";
                  elt.innerHTML = "{" + this.titleList[i] + "}";
                }
              },
    fillUpSep : function(){
                for(i=0;i<this.titleList.length; i++){
                  var str2 = "sep0" + i;
                  var sep = document.getElementById(str2);
                  sep.style.color = "green";
                  sep.innerHTML = "========>>>>>>>>>>>>";
                  }
                },
    fillUpRight : function(){
                for(i=0;i<this.titleList2.length; i++){
                  var str = "div00" + i;
                  var elt = document.getElementById(str);
                  elt.style.color = "blue";
                  elt.innerHTML = "{" + this.titleList2[i] + "}";
                }
            },
    clearLeft : function(){
                for(i=0;i<10; i++){
                  var str = "div" + i;
                  var elt = document.getElementById(str);
                  elt.style.color = "black";
                  elt.innerHTML = "";
                  }
                },
    clearSep : function(){
                for(i=0;i<10; i++){
                  var str2 = "sep0" + i;
                  var sep = document.getElementById(str2);
                  sep.style.color = "green";
                  sep.innerHTML = "";
                  }
                },
    clearRight : function(){
                for(i=0;i<10; i++){
                  var str = "div00" + i;
                  var elt = document.getElementById(str);
                  elt.style.color = "black";
                  elt.innerHTML = "";
                }
            }
    };

function rebuild(){
      wholeRun.clearLeft();
      wholeRun.clearRight();
      wholeRun.clearSep();
      console.log(wholeRun.titleList);
      wholeRun.fillUpLeft();
      wholeRun.fillUpSep();
      wholeRun.fillUpRight();
}

rebuild();
////////////////////////////////////////////////
// button manipulation
////////////////////////////////////////////////
var button1 = document.getElementById("button1");
var stateButton1 = 1;
var stateButton2 = 1;
function doButton1(){
  if(stateButton1){
    wholeRun.clearLeft();
    stateButton1 = 0;
  } else {
    wholeRun.fillUpLeft();
    stateButton1 = 1;
  }
}

function doButton2(){
  if(stateButton2){
    wholeRun.clearRight();
    stateButton2 = 0;
  } else {
    wholeRun.fillUpRight();
    stateButton2 = 1;
  }
}
