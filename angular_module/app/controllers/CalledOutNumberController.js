'use strict';

angular.module('bingoApp')
.controller('calledOutNumberCtrl', function ($scope, chatSocket) {

    $scope.calledOutNum = 5;
    $scope.bingo =
    [
    	{
      		num: 0,
    	}
    ];
}