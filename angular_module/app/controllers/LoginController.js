'use strict';

angular.module('bingoApp')
.controller('loginCtrl', function ($scope, $window, chatSocket) {
  //console.log("client socket in another controller");
  $scope.modalShown = true;
  $scope.validName = false;
  $scope.player = {};

  $scope.save = function(){
    $scope.username = $scope.player.uname;
    $scope.modalShown = false;
    chatSocket.emit('user_name', {uname : $scope.player.uname});
    $window.alert("You have joined a game in progress. Please cancel out the called out numbers from the table on right");

  };
    
  $scope.change = function() {
      
     var uname = $scope.player.uname;
     if(uname && uname.length > 0)
       $scope.validName = true;
     else
       $scope.validName = false;
  };

  $scope.hitEnter = function(evt){
    if(angular.equals(evt.keyCode,13))
      $scope.save();
  }; 
  
  $scope.cancel = function() {

    $scope.modalShown = false;
  }
});
