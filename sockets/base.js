module.exports = function(io) {
  'use strict';
  var timer;
  var gameStarted = false;
  var gamePaused = false;
  var timerStarted = false;
  var calledOutNumbers = [];
  var winnersCount = 0;
  //function to call every 3 seconds
  function generateRandomNumber() {
    
    var unique = false;
    if((!gameStarted) || (gameStarted && gamePaused)) {
      
      stopRandonNumberGenerator();
    } else {
      unique = false;
      do {
        var randomNum = Math.floor(((Math.random() * 100) + 1));	
        if((calledOutNumbers.indexOf(randomNum) == -1)) {
          calledOutNumbers.push(randomNum);
          unique = true;
          io.sockets.emit('callout_number', randomNum);
          console.log(randomNum);
        }		
      } while(!unique);
    }
  }
  
  function stopRandonNumberGenerator() {
    
    console.log("clear timer");
    clearTimeout(timer);
    timerStarted = false;
  }
      
  function generateCallOutNumber() {

    if(!timerStarted) {
      console.log("callEvery5Sec");
      timer = setInterval(function() {
        generateRandomNumber();
        timerStarted = true;
      }, 5000);
    }
  }
  
  function checkCancelledInCalled(bingoTable) {
    for(var i = 0; i < bingoTable.length; i++) {
      for(var j = 0; j < bingoTable[i].rows.length; j++) {
          
        if(bingoTable[i].rows[j].isCalledOut) {
           
          if(calledOutNumbers.indexOf(bingoTable[i].rows[j].value) == -1) {
              
            console.log(bingoTable[i].rows[j].value + " not called out");
            return false;
          }
        }
      }
    }
    return true;
  }
  
  function checkRowPattern(bingoTable) {
    
    var patternFound = true;
    for(var i = 0; i < bingoTable.length; i++) {
      
      for(var j = 0; j < bingoTable[i].rows.length; j++) {
        
        if(!bingoTable[i].rows[j].isCalledOut) {
          patternFound = false;
          break;
        }
      }
      if(patternFound) {
        console.log("pattern found row " + i);
        return true;
      }
    }
    return false;
  }
  
  function checkColumnPattern(bingoTable) {
    var patternFound = true;
    for(var i = 0; i < bingoTable.length; i++) {
      
      patternFound = true;
      for(var j = 0; j < bingoTable[i].rows.length; j++) {
        
        if(!bingoTable[j].rows[i].isCalledOut) {
          
          patternFound = false;
          break;
        }
      }
      if(patternFound) {
        console.log("pattern found column " + i);
        return true;
      }
    }
    return false;
  }
  
  function checkCornerPattern(bingoTable) {
    var length = bingoTable.length;
    if(bingoTable[0].rows[0].isCalledOut && bingoTable[0].rows[length - 1].isCalledOut &&
        bingoTable[length - 1].rows[0].isCalledOut && bingoTable[length - 1].rows[length - 1].isCalledOut) {
          
      console.log("pattern found corner ");
      return true;   
    }
    return false;
  }
  
  
  //[0,0] [0,1] [0,2] [0,3] [0,4]
  
  //[1,0] [1,1] [1,2] [1,3] [1,4]
  
  //[2,0] [2,1] [2,2] [2,3] [2,4]
  
  //[3,0] [3,1] [3,2] [3,3] [3,4]
  
  //[4,0] [4,1] [4,2] [4,3] [4,4]
  
  
  function checkDiagonalPattern(bingoTable) {
    var patternFound = true;
    for(var i = 0; i < bingoTable.length; i++) {
              
      if((!bingoTable[i].rows[i].isCalledOut) || (!bingoTable[bingoTable.length - 1 - i].rows[i].isCalledOut)) {
          patternFound = false;
          break;
      }
      if(patternFound) {
        console.log("pattern found diagonal ");
        return true;
      }
    }
    return false;
  }
  
  function checkBingoPattern(bingoTable) {
  
    if(checkRowPattern(bingoTable))  {
      return true;
    } else if(checkColumnPattern(bingoTable))
      return true;
    else if(checkCornerPattern(bingoTable))
      return true;
    else if(checkDiagonalPattern(bingoTable))
      return true;
    return false;
  }
  
  function wrongClaim() {
    io.sockets.emit('wrong_claim', "");
    gamePaused = false;
    generateCallOutNumber();
  }
  
  function alreadyThreeWinners() {
    io.sockets.emit('already_three_winners', "");
    stopRandonNumberGenerator();
  }
  
  io.on('connection', function (socket) {  

    socket.on('user_name', function(data){
      if(gameStarted === true) {
        socket.emit('all_calledout_num', calledOutNumbers);
      }
      else {
        gameStarted = true;
        generateCallOutNumber();        
      }
    });
    
    socket.on('claim_bingo', function(data) {
      
      gamePaused = true;
      stopRandonNumberGenerator();
      io.sockets.emit('user_claimed_bingo_message', "");
      
      var correctClaim = true;
      if(checkCancelledInCalled(data)) {
        
        if(!checkBingoPattern(data))
          correctClaim = false;
      } else {
        correctClaim = false;
      }
      if(correctClaim) {
        winnersCount++;
        io.sockets.emit('correct_claim', "");
        if(winnersCount == 3) {
          alreadyThreeWinners();
        }
      }
      else {
        wrongClaim();
      }
    });
    
    if(calledOutNumbers.length == 100) {
      io.sockets.on('all_num_calledout_no_winner', "");      
    }
  });
};