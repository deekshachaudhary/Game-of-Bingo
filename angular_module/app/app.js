'use strict';

var bingoApp = angular
  .module('bingoApp', [
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.bootstrap',
    'ngModal'
  ]);