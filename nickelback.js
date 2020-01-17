const NOMINALS = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
  } // object holding nominals of coins and bills
  
  
  
  function checkCashRegister(price, cash, cid) {
    let change = cash - price; 
    let quantityArr = [], nominalArr = []; // quantityArr = how many coins and bills are there, and nominalArr are their nominals respectivly
    let workCID = cid; // making func non-mutational
    workCID.reverse(); 
    for(let cash of workCID){ // forming arrays
      quantityArr.push(Math.round(cash[1]/NOMINALS[cash[0]])); 
      nominalArr.push(NOMINALS[cash[0]]);
    }
   
    const epsilonEqual = (x,y) => { // little func meant to overcome JS float type problems (0.01 => 0.009999999993 !== 0.01)
      return (Math.abs(x - y) < 0.01);
    }
  
    let differenceArr = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // difference array is to detect how many is spent to give the change

    for(let i = 0; i < quantityArr.length; i++){

      if(change/nominalArr[i] >= 1){
        let pack = Math.floor(change/nominalArr[i]); // how many of the processing currency is "contained" in change

        if(pack <= quantityArr[i]){ // if there are enough
          change = change - nominalArr[i]*pack; // give them
          let remember = quantityArr[i];
          quantityArr[i] = quantityArr[i] - pack; // change the status
          differenceArr[i] = remember - quantityArr[i]; // and remember the difference
        }
        else{ // if there are not enough we still can give some and then fulfill through other nominals
          change = change - nominalArr[i]*quantityArr[i];
          let remember = quantityArr[i];
          quantityArr[i] = 0; 
          differenceArr[i] = remember - quantityArr[i];
        }
      }
    }
  
    // there can be a situation when change = 0.009999993 although it should be equal 0.01 (due to float format)
    // and last penny does not subtract, so we can use epsilon comparison to avoid this situation 
    if(quantityArr[quantityArr.length-1] !== 0 && epsilonEqual(change, nominalArr[nominalArr.length-1])){
      change = 0;
      quantityArr[quantityArr.length-1] = 0;
      differenceArr[differenceArr.length-1]++;
    } 
  
  
    
    if(change !== 0){ // if we could not give the change
      return {status: "INSUFFICIENT_FUNDS", change: []};
    }
    
    if(Math.round(quantityArr.reduce((summ, x) => summ+x, 0)) === 0){ // if the drawer is empty
      change = workCID.reverse();
      return {status: "CLOSED", change};
    }
  
    
    let counter = differenceArr.length-1; // surrogate for "let i" in ordinary loop
    workCID.reverse();
    change = []; // don't need the value anymore, but we can use the variable to form the return value
    for(let cash of workCID){
      if(differenceArr[counter] !== 0){
        change.push([cash[0], differenceArr[counter]*nominalArr[counter]]); // forming how much was spent
      }
      counter--;
    }
    
    // Here is your change, ma'am.
    change.reverse();
    return {status: "OPEN", change};
  }
  
 
  
  