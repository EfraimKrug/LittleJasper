//
// lisp: primitives
function car(list){
  if(isNull(list)) return undefined;
  if(isAtom(list)) return undefined;
  return list[0] || [];
}

function cdr(list){
  if(isNull(list)){
    return undefined;
  }
  if(isAtom(list)){
    return undefined;
  }
  return list.slice(1) || [];
}

function cons(list1, list2){
  if(list1.length < 1 && list2.length < 1) return [];
  if(isAtom(list1)){
    return cons([list1], list2);
  }
  return list1.concat(list2);
}

//
// some primitive testing...
//
function isNull(list){
  if(!list.length) return true;
  return false;
}

function isOp(op){
  return op == '*' || op == '^' || op == '+';
}

function isInt(atom1){
  if(Array.isArray(atom1)) return false;
  var er = /^[0-9]+$/;
  return er.test(atom1);
}

function isChar(atom1){
  if(Array.isArray(atom1)) return false;
  var er = /^[a-zA-Z]+$/;
  return er.test(atom1);
}

function isAtom(list){
  return isInt(list) || isChar(list) || isNull(list) || isOp(list);
}

//
// Equality
//
function isEq(atom1, atom2){
  if(!isAtom(atom1) || !isAtom(atom2)) return undefined;
  return atom1 == atom2;
}

function isEqualList(list1, list2){
  if(isNull(list1) && isNull(list2)) return true;
  if(isNull(list1)) return false;
  if(isNull(list2)) return false;
  if(isAtom(car(list1)) && isAtom(car(list2))){
    if(isEq(car(list1), car(list2)))
      return isEqualList(cdr(list1), cdr(list2));
    }
  else {
    return isEqualList(car(list1), car(list2)) &&
           isEqualList(cdr(list1), cdr(list2));
  }
  return false;
}


function isEqual(s1, s2){
  if(isAtom(s1) && isAtom(s2)){
    return isEq(s1, s2);
  }
  if(nonAtom(s1) && nonAtom(s2)){
    return isEqualList(s1,s2);
  }
  return false;
}


// returns true for a list - can have depth or null
function isLat(list){
    //console.log(list);
    if(isNull(list)){
      return true;
    }
    if(isAtom(list)){
      return false;
    }
    if(isAtom(car(list))){
      return isLat(cdr(list));
    }
    return isLat(car(list)) && isLat(cdr(list));
}

// sets - members/subsets

function isMember(a, list){
  if(!list){
    return false;
  }
  if(isNull(list)){
    return false;
  }

  return isEq(car(list), a) || isMember(a, cdr(list));

}


//
// removing memebers
//

//
// This rember function will remove highest level S-expressions
//

// remove first identification of member a from list
function rember (a, list){
  if(isNull(list)) return [];
    if(isEqual(car(list), a)){
        return cdr(list);
    }
    return cons(car(list), rember(a, cdr(list)));
}

// removes all occurrences of a in list - for flat list
function multirember (a, list){
  if(isNull(list)) return [];
  if(isEq(a, car(list))){
    return multirember(a, cdr(list));
  }
  return cons(car(list), multirember(a, cdr(list)));
}

//
// star functions: multi operates on all flat occurrences,
//                 Star operates all occurrences on all levels.
//
function remberStar(a, list){
  if(isNull(list)){
    return [];
  }
  if(nonAtom( car(list))){
    return cons(remberStar(a, car(list)), remberStar(a, cdr(list)) );
  }
  if(isEq(car(list), a)){
    return remberStar(a, cdr(list));
  }
  return cons( car(list), remberStar(a, cdr(list)) );
}

function insertRStar(old, nu, list){
  if(isNull(list)){
    return [];
  }
  if(nonAtom( car(list))){
    return cons(insertRStar(old, nu, car(list)), insertRStar(old, nu, cdr(list)) );
  }

  if(isEq(car(list), old)){
    return cons(old, cons(nu, insertRStar(old, nu, cdr(list))));
  }
  return cons( car(list), insertRStar(old, nu, cdr(list)) );
}


function insertLStar(old, nu, list){
  if(isNull(list)){
    return [];
  }
  if(nonAtom( car(list))){
    return cons(insertLStar(old, nu, car(list)), insertLStar(old, nu, cdr(list)) );
  }

  if(isEq(car(list), old)){
    return cons(nu, cons(old, insertLStar(old, nu, cdr(list))));
  }
  return cons( car(list), insertLStar(old, nu, cdr(list)) );
}

function substStar(old, nu, list){
  if(isNull(list)){
    return [];
  }
  if(nonAtom( car(list))){
    return cons(substStar(old, nu, car(list)), substStar(old, nu, cdr(list)) );
  }

  if(isEq(car(list), old)){
    return cons(nu, substStar(old, nu, cdr(list)));
  }
  return cons( car(list), substStar(old, nu, cdr(list)) );
}

function memberStar(a, list){
  if(isNull(list)) return false;
  if(nonAtom(car(list))){
    return memberStar(a, car(list)) || memberStar(a, cdr(list));
  }
  if(isEq(a, car(list))){
    return true;
  }
  return memberStar(a, cdr(list));
}

//
// subst functions (mamash, multi, star)
//
function subst(nu,old,list){
    if(isNull(list)) return [];
    if(isEq(old, car(list))){
      return cons(nu, cdr(list));
    }
    return cons(car(list), subst(nu,old,cdr(list)));
}

function multisubst(nu,old,list){
    if(isNull(list)) return [];
    if(isEq(old, car(list))){
      return cons(nu, multisubst(nu,old,cdr(list)));
    }
    return cons(car(list), multisubst(nu,old,cdr(list)));
}


//
// List work: insert
//
function insertL(elt, cmp, list){
  if(isNull(list)) return [];
  if(isAtom(car(list))){
      if(isEq(cmp, car(list))){
        return cons(elt, cons(cmp, insertL(elt,cmp,cdr(list))));
      } else {
        x = cons(car(list), insertL(elt,cmp,cdr(list)));
        //console.log(x);
        return x;
      }
    }
  else {
      return cons(insertL(elt, cmp, car(list)), insertL(elt,cmp,cdr(list)), elt);
  }
}

function insertR(elt, cmp, list){
  if(isNull(list)) return [];
  if(isAtom(car(list))){
      if(isEq(cmp, car(list))){
        return cons(cmp, cons(elt, insertR(elt,cmp,cdr(list))));
      } else {
        x = cons(car(list), insertR(elt,cmp,cdr(list)));
        //console.log(x);
        return x;
      }
    }
  else {
      return cons(insertR(elt, cmp, car(list)), insertR(elt,cmp,cdr(list)), elt);
  }
}


function doRight(elt,cmp,list){
  return cons(cmp, cons(elt, insertG(elt,cmp,cdr(list))));
}

function doLeft(elt, cmp, list){
  return cons(elt, cons(cmp, insertG(elt,cmp,cdr(list))));
}

//
// notice - this will not work because i want to return f - a
// function that recurses on insertGR, but i want to define the
// recursive portion of the function in a function outside the
// scope of accessibility - i.e. i can't get to insertGR from
// outside of insertG!
//

// insert `elt` on the right side of `cmp`
function doRight2(elt,cmp,list){
  return cons(cmp, cons(elt, list));
}
// insert `elt` on the left side of `cmp`
function doLeft2(elt, cmp, list){
  return cons(elt, cons(cmp, list));
}
// insert `elt` in place of `cmp`
function doSubst(elt, cmp, list){
  return cons(elt, list);
}

function insertG2(func){
var f = func;
return function insertGR(elt, cmp, list){
      if(isNull(list)) return [];
      if(isAtom(car(list))){
          if(isEq(cmp, car(list))){
            //return cons(elt, cons(cmp, insertL(elt,cmp,cdr(list))));
            return f(elt,cmp, insertGR(elt, cmp, cdr(list)));
          } else {
            x = cons(car(list), insertGR(elt,cmp,cdr(list)));
            return x;
          }
        }
      else {
          return cons(insertGR(elt, cmp, car(list)), insertGR(elt,cmp,cdr(list)));
          //return f(elt,cmp,cdr(list));
      }
    }
}

//
// for now - this is the best I am going to do
//
function insertG(elt, cmp, list, f){
  if(isNull(list)) return [];
  if(isAtom(car(list))){
      if(isEq(cmp, car(list))){
        //return cons(elt, cons(cmp, insertL(elt,cmp,cdr(list))));
        return f(elt,cmp,list);
      } else {
        x = cons(car(list), insertG(elt,cmp,cdr(list),f));
        //console.log(x);
        return x;
      }
    }
  else {
      return cons(insertG(elt, cmp, car(list), f), insertG(elt,cmp,cdr(list), f));
  }
}

//console.log(y = insertG('NEW', 'b', listX2, doRight));
// console.log(insertG('NEW', 'b', listX2,
//                 function(elt, cmp, list){
//                   //doLeft:
//                     return cons(elt, cons(cmp, insertG(elt,cmp,cdr(list))));
//                 }
// ));
//
// console.log(insertG('NEW', 'b', listX2,
//                 function(elt, cmp, list){
//                   //doRight:
//                     return cons(cmp, cons(elt, insertG(elt,cmp,cdr(list))));
//                   }
//                 ));

//
// utility: printing to console...
//
function printList(list){
  console.log("(" + printListR(list) + ")");
}

function printListR(list){
  if(isNull(list)){
      return "";
    }

  if(isAtom(list)){
    return list;
  }

  if(isAtom(car(list))){
    return car(list) + "-" +  printListR(cdr(list)) ;
  }

  return "{" + printListR(car(list)) + printListR(cdr(list)) + "}";
}

//
// returning counts and numbers
//
function occur(a, list){
  if(isNull(list)) return 0;
  if(isEq(a, car(list))){
    return 1 + occur(a,cdr(list));
  }
  return occur(a,cdr(list));
}

function occurStar(a, list){
    if(isNull(list)) return 0;
    if(nonAtom(car(list))){
      return occurStar(a, car(list)) + occurStar(a, cdr(list));
    }
    if(isEq(a, car(list))){
      return add1(occurStar(a, cdr(list)));
    }
    return occurStar(a, cdr(list));
}

function isOne(n){
  return n == 1;
}

function sub1(n){
  return n-1;
}

function add1(n){
  return n + 1;
}

function remPick(n, list){
  if(isNull(list)) return [];
  if(isOne(n)){
    return cdr(list);
  }
  return cons(car(list),(remPick(sub1(n), cdr(list))));
}

function nonAtom(elt){
  if(isAtom(elt)){
    return false;
  }
  return true;
}

function leftmost(list){
  if(isAtom(list)){
    return list;
  }
  if(isNull(list)){
    return [];
  }
  return leftmost(car(list));
}


function isNumbered(list){
  if(isAtom(list)){
    return isInt(list);
  }
  return isNumbered(car(list)) && isOp(car(cdr(list))) && isNumbered(car(cdr(cdr(list))));
}

function multiply(x,y){
  return x * y;
}

function add(x,y){
  return x + y;
}

function exp(x, y){
  if (y == 0){
    return 1;
  }
  return x * exp(x, sub1(y));
}

function val(aexp){
  if(isAtom(aexp) && isInt(aexp)){
    return aexp;
  }
  if(isEq(car(cdr(aexp)), "+")){
    return add(val(car(aexp)), val(car(cdr(cdr(aexp)))));
  }
  if(isEq(car(cdr(aexp)), "*")){
    return multiply(val(car(aexp)), val(car(cdr(cdr(aexp)))));
  }
  if(isEq(car(cdr(aexp)), "^")){
    return exp(val(car(aexp)), val(car(cdr(cdr(aexp)))));
  }
}

// shadows - chapter 7
// value with helper functions
var firstExp = function (aexp){
  return car(aexp);
}

var secondExp = function (aexp){
  return car(cdr(cdr(aexp)));
}

var _operator = function (aexp){
  return car(cdr(aexp));
}

function _value(aexp){
  if(isAtom(aexp) && isInt(aexp)){
    return aexp;
  }
  if(isEq(operator(aexp), "+")){
    return add(value(firstExp(aexp)), value(secondExp(aexp)));
  }
  if(isEq(operator(aexp), "*")){
    return multiply(value(firstExp(aexp)), value(secondExp(aexp)));
  }
  if(isEq(operator(aexp), "^")){
    return exp(value(firstExp(aexp)), value(secondExp(aexp)));
  }
}

//
// return function
var operator = function (aexp){
  var op = car(cdr(aexp));
  if(isEq(op, "+")){ return add; }
  if(isEq(op, "*")){ return multiply; }
  if(isEq(op, "^")){ return exp; }
}

function value(aexp){
  if(isAtom(aexp) && isInt(aexp)){
    return aexp;
  }
  var mFunc = operator(aexp);
  return mFunc(value(firstExp(aexp)), value(secondExp(aexp)));
}

//
// friends and relations
// chapter 8

function isSet(list){
  if(isNull(list)){
    return true;
  }

  if(isMember(car(list), cdr(list))){
    return false;
  }
  return isSet(cdr(list));
}

function isIntersect(set1, set2){
  if(isNull(set1)){
    return false;
  }
  return isMember(car(set1), set2) || isIntersect(cdr(set1), set2);
}

// combine isSet and isIntersect into general function
function logic(log){
  if(log == 'OR'){
    return function logic_or(val1, val2) { return val1 || val2; };
  }
  if(log == 'AND'){
    return function logic_and(val1, val2) { return val1 && val2; };
  }
}

function logRet(tf){
  if(tf) return true;
  return false;
}

function isSetGen(stmt, tf){
  var logi = logic(stmt);
  var ctf = tf;
  return function doit(set1, set2){
    if(isNull(set1)){ return ctf; }
    return logi(isMember(car(set1), set2), doit(cdr(set1), set2));
  };
}

function makeSet(list){
  if(isNull(list)){
    return [];
  }
  if(isMember(car(list), cdr(list))){
    return makeSet(cdr(list));
  }
  return cons(car(list), makeSet(cdr(list)));
}

function isSubset(set1, set2){
  if(isNull(set1)){
    return true;
  }

  return isMember(car(set1), set2) && isSubset(cdr(set1), set2);
}

function eqSet(set1, set2){
  return isSubset(set1,set2) && isSubset(set2, set1);
}

function makeIntersection(set1, set2){
  return makeIntersectionR(makeSet(set1), makeSet(set2));
}

function makeIntersectionR(set1,set2){
  if(isNull(set1)){
    return [];
  }
  if(isMember(car(set1), set2)){
    return(cons(car(set1), makeIntersectionR(cdr(set1), set2)));
  }
  return makeIntersectionR(cdr(set1),set2);
}

function makeUnion(set1, set2){
  return makeUnionR(makeSet(set1), makeSet(set2));
}

function makeUnionR(set1,set2){
  if(isNull(set1)){
    return set2;
  }
  if(isMember(car(set1), set2)){
    return makeUnionR(cdr(set1), set2);
  }
  return cons(car(set1), makeUnionR(cdr(set1),set2));
}

// pairs - moving on...
function first(pair){
  return car(pair);
}

function second(pair){
  return car(cdr(pair));
}

function buildPair(a,b){
  return cons(a, cons(b, []));
}

//
// lambda the ultimate
// passing functions and using closures
//

function remberFunc(testFunc){
  var cmpFunc = testFunc;
  return function remberInside(a,list){
    if(isNull(list)){return [];}
    if(cmpFunc(car(list), a)){
      return remberInside(a, cdr(list));
    }
    return cons(car(list), remberInside(a, cdr(list)));
  };
}
//
// modeling lambda
//
// pass function in
function equalf(func){
  var f = func;
  function feq(val1, val2){
    if(f(val1,val2)){
      return true;
    }
    return false;
  }
  return feq;
}

// set target
function equalTarget(target){
  var trg = target;
  function cmpTarget(chkVal){
    if(isEq(trg, chkVal)){
      return true;
    }
    return false;
  }
  return cmpTarget;
}

// set up - pass function in
//var runEq = equalf(isEq);
//console.log(runEq('this','this'));

// set up with predefined target
//var cmpThis = equalTarget("this");
//console.log(cmpThis("that"));
//console.log(cmpThis("this"));

//
// test data
//

var list = ['and', 'thisX', 'and', 'that', 'the', 'other', 'thisX', 'and'];
var list1 = ['1','2','3','4','5','6'];
var list2 = [['x','y',['a','b','c']],['a','b','c',[1,2,3],'d'], 'this', 'that'];
var list3 = [];
var list4 = ['thisX'];
var list5 = 'thisX';
var list6 = [1,2,3,4,5,6,7];

var listX = ['thisX', 'that', 'the', 'other'];
var listX1 = ['1','2','3','4','5','6'];
var listX2 = [['x','y',['b',['b',1]],['a','b','c']],['a','b','c',[1,2,3,'b'],'d'], 'b', 'this', 'that'];
var listX2a = [['x','y',['b','b',1],['a','b','c']],['a','b','c',[1,2,3,'b'],'d'], 'b', 'this', 'that'];
var listX3 = [];
var listX4 = ['thisX'];
var listX5 = 'thisX';
var listX6 = [1,2,3,4,5,6,7];

var numexp1 = [5, '^', 3];
var numexp2 = [3, '*', [5, '^', 3]];
var numexp3 = [[5, '+', 3], '*', 2];
var numexp4 = [2, '*', [5, '^', [2, '+', 1]]];

var set1 = [7,6,6,5,7,2,1,6,5,'this', 'this', 'that', 43,2,1, 'this', 'that'];
var set2 = [7,7,7,7,7,7,6,5,43,2,1, 'this', 'that'];
var set3 = [1,1,1,1,1,1,6,5,43,2,1, 'this', 'that'];
var set4 = [6,7,6,5,43,2,1, 'this', 'that'];
var set5 = [7,6,5,43,2,1, 'this', 'that',1,1,1,1,4,3];
var set6 = [7,6,5,43,2,1, 'this', 'that',7,6,5,4,3,2,1];
var sub1 = [7,6,'this', 'ouch'];
var seta = ['yikes','help','what', 'happy'];
var setb = ['yikesX', 'helpX', 'what', 'happyX'];

var a = 'this';
var b = 'that';
var c = 1;
var d = 2;

//
// using closures to generalize functionality!
//
// var insertLeft = insertG2(doLeft2);
// var insertRight = insertG2(doRight2);
// var effectSubst = insertG2(doSubst);
//
// printList(insertLeft('INSERT', 'help', seta));
// printList(insertRight('INSERT', 'help', seta));
// printList(effectSubst('INSERT', 'help', seta));

//printList(insertG('INSERT', 'help', seta, doLeft));
//printList(insertG('INSERT','help', seta, doRight));

//var rem = remberFunc(isEq);
//console.log(rem("this", set2));

//console.log(remberFunc(isEq, 6, sub1));

// var p = buildPair(a,b);
// console.log(first(p));
// console.log(second(p));
// var p = buildPair(c,d);
// console.log(first(p));
// console.log(second(p));
//
console.log(isIntersect(seta, setb));
var genIntersect = isSetGen("OR", false);
console.log(genIntersect(seta, setb));
console.log(isSubset(seta,makeSet(setb)));
var genSubset = isSetGen("AND", true);
console.log(genSubset(seta, makeSet(setb)));

//console.log(makeSet(seta));
//console.log(makeSet(setb));
//console.log(makeUnion(seta,setb));
//console.log(makeIntersection(seta, setb));

//console.log("STARTING");
// x = cons(cdr(set1), sub1);
// console.log(x);
// console.log(isNull(x));
// console.log(isAtom(x));
// console.log(Array.isArray(x));
// console.log(x.length);
// console.log(x.slice(1));
// console.log(cdr(x));
//console.log(isMember('7', x));
//console.log(isMember('ouch', set1));
//console.log(isMember('this', set1));

//printList(makeSet(set1));
//printList(makeSet(set2));
//printList(makeSet(set3));
//printList(makeSet(set4));
//printList(makeSet(set5));
//printList(makeSet(set6));

//console.log(isSet(set1));


//console.log(car(cdr(cdr(numexp4))));
//console.log('125:' + value(numexp1));
//console.log('375:' + value(numexp2));
//console.log('16:' + value(numexp3));
//console.log('250:' + value(numexp4));

//console.log(exp(3,0));
//console.log(isNumbered([5, '*', 4]))
//printList(listX2);
//printList(rember(['a','b','c',[1,2,3,'b'],'d'], listX2));
//printList(rember(['x','y',['b',['b',1]],['a','b','c']], listX2));
//printList(rember('x', listX2));

//console.log(memberStar(3, listX6));
//console.log(isEqualList(listX2, listX2a));
//console.log(isEqualList(listX3, listX3));
//printList(listX2);
//printList(substStar('b', 'Stuff', listX2));

//console.log(occurStar(1, listX2));

//printList(remberStar('z', list2));
//printList(remberStar('that', list2));
//printList(insertLStar('x', "Stuff", listX2));

// testing...
// dconsole.log(leftmost([[[['a']],'b'],'c']));
// console.log(leftmost(list1));
// console.log(leftmost(list2));
// console.log(leftmost(list3));
// console.log(leftmost(list4));
// console.log(leftmost(list5));
// console.log(leftmost(list6));
//
//console.log(nonAtom(list3));
//console.log(nonAtom(list1));
//console.log(nonAtom(list2));
//console.log(nonAtom(list3));
//console.log(nonAtom(list4));
//console.log(nonAtom(list5));
//console.log(nonAtom(list6));



// old testing...

//printList(remPick(9, list));

//console.log(isOne(1));
//printList(multirember('and', list));
//printList(multisubst('stuff','and',list));
//console.log(occur(3, list6));
//printList(list2);
//printList(list2);
//printList(list3);
//printList(list4);
//printList(list5);
//printList(list6);

// console.log(isMember('the', listX));
// console.log(isMember('other', listX));
// console.log(isMember('thisX', listX));
// console.log(isMember('this', list3));
// console.log(isMember('x', list2));
// console.log(isMember(2, list2));
// console.log(isMember('that', list2));
// console.log(isMember(['x','y',['a','b','c']], list2));
// console.log(isMember(3, list2));
// console.log(isMember('y', list2));
// console.log(isMember('thatX', list2));

//console.log("THIS: " + y);
//console.log(car(list));
//console.log(isChar(car(list)));));));));));
//console.log(isEqualList(list2, listX2));
//console.log(isEqualList(list3, listX3));
//console.log(isEqualList(list4, listX4));
//console.log(isEqualList(list5, listX5));
//console.log(isEqualList(list6, listX6));

//console.log(isLat(car(list4)));
//console.log(isLat(car(list4)));
//console.log(isLat(car(list4)));
//console.log(isLat(car(list4)));
//console.log(isLat(car(list4)));
//console.log(isLat(car(list4)));
//console.log(isLat(car(list4)));
//console.log(isLat(car(list2)));
//console.log(isLat('a', 'b'));

//console.log(isChar(list));

//console.log(isEq(car(list), car(list4)));
//console.log(isEq(car(list2), car(list3)));
//console.log(isEq('a', 'b'));
//console.log(isEq('a', 'a'));

//console.log(cdr(cdr(list4)));

//console.log(isAtom('this'));
//console.log(isAtom([]));
//console.log(isAtom(['this']));
//console.log(cons(list,list1));
//console.log(cons(list1,list2));
//console.log(cons(list2,list3));
//console.log(cons(list3,list4));
//console.log(cons(list4,list));

//var x = cons(list1,list2);
//console.log(x);
//printList(x);
