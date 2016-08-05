appBeneficiario.controller('MapSearchController', ['$scope', '$timeout', '$window', function ($scope, $timeout, $window) {
  $scope.LOADING = false;

  $scope.doSearch = function () {
    $scope.LOADING = true;

    $timeout(function () {
      $scope.displayResults = true;
      $scope.LOADING = false;
    }, 3000);
  };

  $scope.isSearchDisabled = function () {
    return !($scope.referencePoint && $scope.referencePoint.length > 0) && !($scope.placeName && $scope.placeName.length > 0);
  };

  $scope.goToPlace = function () {
    $window.location = '/beneficiario/guia-vr.html#network';
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('MapSearchController', $scope);
  }

}]);
