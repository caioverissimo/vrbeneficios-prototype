$(function(){
  'use strict';

  var redeCredenciada = (function() {

    var toggleButton  = $('#btn-map-toggle');
    var leftController = $('#leftController');
    var topController = $('#topController');
    var infoController = $('#leftController');

    var toggleMapMenu = function() {
      toggleButton.on('click', function(){
        leftController.toggleClass('active');
        topController.toggleClass('active');
      });
    };

    var selectMapAreaRadius = function () {
      // TODO: create method for change state for buttons from topController and store the current value
    };

    var toggleFavorite = function () {
      //TODO: update the state for the favorite button and store his value
    };

    var init = function() {
      toggleMapMenu();
    };

    return {
      init: function() {
        init();
      }
    };

  }());

  redeCredenciada.init();
}());