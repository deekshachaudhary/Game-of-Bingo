'use strict';
angular.module('bingoApp')
.factory('chatSocket', function($rootScope){
    //Creating connection with server
    var chatSocket = io.connect('http://ec2-54-186-171-207.us-west-2.compute.amazonaws.com:8000');
    return chatSocket;
});