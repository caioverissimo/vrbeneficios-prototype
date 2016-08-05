appComum.controller('CabecalhoController', ['$rootScope', '$scope', '$window', '$uibModal', '$document', '$timeout', function ($rootScope, $scope, $window, $uibModal, $document, $timeout) {

  // comportamento especial para header da home
  $scope.homeLinkPrefix = '';
  if ($window.location.pathname.length > 1) {
    $scope.homeLinkPrefix += '/';
  }

  // efeitos na home
  if (
    $window.location.pathname === '/' || // heroku / dev
    $window.location.pathname.endsWith('/portal/portal-vr/') || // lumis opcao 1
    $window.location.pathname.endsWith('/portal/')) { // lumis opcao 2

    $scope.scrollOnTop = true;
    $scope.headerBackgroundClass = 'hidden';
    $scope.isNavbarClosed = true;

    var checkHeaderBackgroundClass = function () {
      if ($scope.headerBackgroundClass === 'hidden') {
        $scope.headerBackgroundClass = 'fade-in header-transparent-background';
      }

      var scrollOnTop = $document.scrollTop() === 0;
      if (!scrollOnTop && $scope.headerBackgroundClass.indexOf('header-transparent-background') > -1) {
        $scope.headerBackgroundClass = 'header-solid-background transition-500ms';
      }

      if (scrollOnTop && $scope.headerBackgroundClass.indexOf('header-solid-background') > -1) {
        $scope.headerBackgroundClass = 'header-transparent-background transition-500ms';
      }

      if (scrollOnTop && !$scope.isNavbarClosed) {
        $scope.headerBackgroundClass = 'header-solid-background transition-500ms';
      }

      $timeout(checkHeaderBackgroundClass, 500);
    };
    checkHeaderBackgroundClass();

    if ($window.location.hash.length > 1) {
      $document.scrollToElement(angular.element($window.location.hash));
    }
  }

  // comportamento comum
  $scope.setNavbarState = function () {
    $scope.isNavbarClosed = !$scope.isNavbarClosed;
  };

  $scope.logout = function () {
    $window.location = "/";
  };

  $scope.openEstablishmentModal = function () {
    $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/selecao-estabelecimentos.html',
      controller: 'EstablishmentModalController',
      backdrop: 'static',
      keyboard: false
    });
  };

  $scope.getCurrentPicture = function () {
    // se nao tiver imagem
    if ($scope.hasActiveEstablishment()) {
      if (!$scope.getActiveEstablishment().pathLogotipo) {
        return '/portal/img/icons-painel/icon_avatar_ec.png';
      } else {
        return '/portal/data/' + $scope.getActiveEstablishment().pathLogotipo;
      }
    }
  };

  $scope.getActiveEstablishmentName = function () {
    var activeEstablishmentName = '';
    if ($scope.hasActiveEstablishment()) {
      activeEstablishmentName = $scope.getActiveEstablishment().nome;
    }
    return activeEstablishmentName;
  };

  $scope.getActiveEstablishmentCNPJ = function () {
    var activeEstablishmentCNPJ = '';
    if ($scope.hasActiveEstablishment()) {
      activeEstablishmentCNPJ = $scope.getActiveEstablishment().cnpj;
    }
    return activeEstablishmentCNPJ;
  };

  $scope.setView = function (view) {
    $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_VIEW, {view: view});
  };

  $scope.isContextPath = function (path) {
    return $window.location.pathname.indexOf(path) > -1;
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('CabecalhoController', $scope);
  }

}]);
