appComum.controller('TermosDeUsoController', ['$scope', '$uibModalInstance', 'vrModalCustomize', function ($scope, $uibModalInstance, vrModalCustomize) {

  vrModalCustomize.toCenter($uibModalInstance);

  $scope.close = function () {
    $uibModalInstance.dismiss('close');
  };

  $scope.acceptance = function () {
    $uibModalInstance.close(true);
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('TermosDeUsoController', $scope);
  }

}]);
