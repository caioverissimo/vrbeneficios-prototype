appComum.controller('BoasVindasController', ['$rootScope', '$scope', '$uibModal', function ($rootScope, $scope, $uibModal) {

  $scope.modalFirstLogin = $rootScope.isFirstLogin();

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('BoasVindasController', $scope);
  }

  // se nao tiver
  if ($scope.modalFirstLogin) {

    $uibModal.open({
      templateUrl: '/portal/app/UI-Comum/partials/modals/boas-vindas.html',
      controller: 'modalBoasVindasController',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        modalFirstLogin: function () {
          return $scope.modalFirstLogin;
        }
      }
    });
  }

}]);

appComum.controller('modalBoasVindasController', ['$rootScope', '$scope', '$uibModalInstance', '$window', 'modalFirstLogin', function ($rootScope, $scope, $uibModalInstance, $window, modalFirstLogin) {

  $scope.painelVReVC = function () {
    $window.location.reload();
  };

  $scope.painelVReEstabelecimento = function () {
    $window.location.href = $rootScope.modalFirstLogin.urlPainelEC;
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('modalBoasVindasController', $scope);
  }

}]);
