//
// lisp: primitives
function car(list){
  if(isNull(list)) return undefined;
  if(isAtom(list)) return undefined;
  return list[0] || [];
}

function cdr(list){
  if(isNull(list)) return undefined;
  if(isAtom(list)) return undefined;
  return list.slice(1) || [];
}

function cons(list1, list2){
  if(list1.length < 1 && list2.length < 1) return [];
  if(isAtom(list1)){
    return cons([list1], list2);
  }
  return [list1.concat(list2)];
}

//
// test atoms
//
function isNull(list){
  if(!list.length) return true;
  return false;
}

function isAtom(list){
  return isInt(list) || isChar(list) || isNull(list);
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

//
// Equality
//
function isEq(atom1, atom2){
  if(!isAtom(atom1) || !isAtom(atom2)) return undefined;
  return atom1 == atom2;
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


// not sure about isLat... need to revisit
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
  console.log(a + ' - ' + list)
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
function rember (a, list){
  //console.log('rember: {' + a + "}" + list );
  if(isNull(list)) return [];
  //if(nonAtom(car(list))){
    if(isEqual(car(list), a)){
        return cdr(list);
    }
    return cons(car(list), rember(a, cdr(list)));
  //}
  //if(isEqual(a, car(list))){
  //  return cdr(list);
  //}

  return cons(car(list), rember(a, cdr(list)));
}

function remberOld (a, list){
  //console.log('rember: {' + a + "}" + list );
  if(isNull(list)) return [];
  if(isEq(a, car(list))){
    return cdr(list);
  }

  return cons(car(list), rember(a, cdr(list)));
}

function multirember (a, list){
  //console.log('rember: {' + a + "}" + list );
  if(isNull(list)) return [];
  if(isEq(a, car(list))){
    return multirember(a, cdr(list));
  }
  //console.log(car(list) + " - " + cdr(list));
  return cons(car(list), multirember(a, cdr(list)));
}

// star functions
//
function remberStar(a, list){
  if(isNull(list)){
    return [];
  }
  //console.log(list);
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
// subst functions
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
//
// test lists
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

printList(listX2);
printList(rember(['a','b','c',[1,2,3,'b'],'d'], listX2));
printList(rember(['x','y',['b',['b',1]],['a','b','c']], listX2));
printList(rember('x', listX2));

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
