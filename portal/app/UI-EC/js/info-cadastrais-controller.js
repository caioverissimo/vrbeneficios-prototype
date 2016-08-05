appEC.controller('infoCadastraisController', function ($scope, $rootScope) {
  $scope.formInfoCadastrais = {};
  $scope.LOADING = false;
  $scope.dadosEC = null;
  $scope.products = [];

  $scope.hasContent = function () {
    return $scope.dadosEC !== null && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return $scope.dadosEC === null && $scope.LOADING === false
      || !$scope.hasActiveEstablishment();
  };

  $rootScope.$on(constants.EVENTS.ESTABLISHMENT_DATA_LOADED, function (event, dadosEC) {
    if (dadosEC) {
      $scope.dadosEC = dadosEC;
    }
  });

  $scope.saveProfile = function () {
    $rootScope.$broadcast(constants.EVENTS.REQUEST_FORM_BANK_DATA_AND_QUALIF);
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('infoCadastraisController', $scope);
  }

});




