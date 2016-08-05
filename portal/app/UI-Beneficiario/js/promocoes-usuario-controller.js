appBeneficiario.controller('NetworkSearcherController', ['$scope', function ($scope) {

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('NetworkSearcherController', $scope);
  }

}]);
