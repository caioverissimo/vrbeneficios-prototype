$(function(){
  'use strict';

  var redeCredenciada = (function() {

    var toggleButton  = $('#btn-map-toggle');
    var leftController = $('#leftController');
    var topController = $('#topController');
    var infoController = $('.vr-location-info');
    var listButtonAreaRadius = $('.vr-searchmap-top-body');
    var btnFavorite = $('#btnFavorite');
    var resultItemList = $('.results-list');
    var totalPages = 0;
    var currentPage = 1;

    var toggleMapMenu = function () {
      toggleButton.on('click', function(){
        leftController.toggleClass('active');
        topController.toggleClass('active');
        if(infoController.css('right') === '450px') {
          infoController.css('right', '10px' );
          centerAreaCircle();
        } else {
          centerAreaCircle();
          infoController.css('right', '450px' );
        }
      });
    };

    var populateLocationInfo = function () {
      var locationInfoItems = [
        {
          id: 0,
          name: 'Vr Refeição 0',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 1,
          name: 'Vr Refeição 1',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 2,
          name: 'Vr Refeição 2',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 3,
          name: 'Vr Refeição 3',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 4,
          name: 'Vr Refeição 4',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 5,
          name: 'Vr Refeição 5',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 6,
          name: 'Vr Refeição 6',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 7,
          name: 'Vr Refeição 7',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 8,
          name: 'Vr Refeição 8',
          img: 'http://placehold.it/42x42'
        },
        {
          id: 9,
          name: 'Vr Refeição 9',
          img: 'http://placehold.it/42x42'
        }
      ];
      resultItemList.html('');
      var countPerPage = 0;
      var pageContainer = '';
      for(var i = 0; i < locationInfoItems.length; i++) {
        var resultItemTemplate = $('<div>').addClass('results-item');
        var image = $('<img>').attr('src', locationInfoItems[i].img);
        var title = $('<span>').text(locationInfoItems[i].name);
        resultItemTemplate.append(image);
        resultItemTemplate.append(title);
        if(countPerPage<4) {
          if(countPerPage === 0) {
            pageContainer = $('<div>');
          }
          pageContainer.append(resultItemTemplate);
          if(i === locationInfoItems.length-1) {
            resultItemList.append('<div class="page-container">'+pageContainer.html()+'</div>');
            totalPages++;
          }
        } else {
          resultItemList.append('<div class="page-container">'+pageContainer.html()+'</div>');
          totalPages++;
          pageContainer = $('<div>');
          countPerPage = 0;
          pageContainer.append(resultItemTemplate);
        }
        countPerPage++;
      }
    };

    var selectMapAreaRadius = function () {
      // TODO: create method for change state for buttons from topController and store the current value
      listButtonAreaRadius.find('.btn-map').on('click', function(){
        listButtonAreaRadius.find('.btn-map').removeClass('active');
        var self = $(this);
        self.addClass('active');
        $('.circle').css('width', self.find('small').attr('radius')+'px');
        $('.circle').css('height', self.find('small').attr('radius')+'px');
        centerAreaCircle();
      });
    };

    var toggleFavorite = function () {
      btnFavorite.on('click', function(){
        btnFavorite.toggleClass('icon-icon_favoritos_off');
        btnFavorite.toggleClass('icon-icon_favoritos_on');
      });
    };

    var setPagination = function () {
        var pages = resultItemList.find('.page-container');
        $('#totalPages').text(totalPages);
        for (var i = 0; i < pages.length; i++) {
          $(pages[i]).removeClass('hidden');
          if( (i+1) !== currentPage) {
            $(pages[i]).addClass('hidden');
          }
        }
        $('#prevPage').on('click', function(){
          if(currentPage > 1) {
            currentPage = currentPage -1;
            $('#currentPage').text(currentPage);
            for (var i = 0; i < pages.length; i++) {
              $(pages[i]).removeClass('hidden');
              if( (i+1) !== currentPage) {
                $(pages[i]).addClass('hidden');
              }
            }
          }
        });
        $('#nextPage').on('click', function(){
          if(currentPage < totalPages){
            currentPage = currentPage + 1;
            $('#currentPage').text(currentPage);
            for (var i = 0; i < pages.length; i++) {
              $(pages[i]).removeClass('hidden');
              if( (i+1) !== currentPage) {
                $(pages[i]).addClass('hidden');
              }
            }
          }
        });
    };

    var searchResults = function () {
      $('#btnSearch').on('click', function(){
        $('#btnSearch').attr('disabled', 'true');
        $('#displayResults').addClass('hidden');
        $('.map-overlay').removeClass('hidden');
        setTimeout(function () {
          $('#displayResults').removeClass('hidden');
          $('#btnSearch').removeAttr('disabled');
          $('.map-overlay').addClass('hidden');
        }, 1500);
      });
    };

    var centerAreaCircle = function() {
      console.log('centerAreaCircle()');
      var circleWidth = parseInt($('.circle').css('width').split('px')[0]);
      var areaWidth = 0;
      if (leftController.hasClass('active')) {
        areaWidth =  parseInt($('.wrap-map').css('width').split('px')[0]) - 450;
      } else {
        areaWidth =  parseInt($('.wrap-map').css('width').split('px')[0]);
      }
      var position = (areaWidth - circleWidth)/2;
      $('.circle').css('right', position+'px' );
    };

    var init = function() {
      toggleMapMenu();
      toggleFavorite();
      selectMapAreaRadius();
      populateLocationInfo();
      setPagination();
      searchResults();
    };

    return {
      init: function() {
        init();
      }
    };

  }());

  redeCredenciada.init();
}());