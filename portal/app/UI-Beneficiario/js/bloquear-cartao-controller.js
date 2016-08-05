appBeneficiario.controller('bloquearCartaoController', ['$scope', '$uibModalInstance', '$timeout', 'activeCard', '$http', function ($scope, $uibModalInstance, $timeout, activeCard, $http) {
  $scope.motivosBloqueio = null;
  $scope.formBloqueio = {};
  $scope.formBloqueio.motivoBloqueio = null;
  $scope.onstate = "awaiting";
  $scope.LOADING = false;
  $scope.activeCard = activeCard;
  $scope.erroMessage = "";

  $scope.blockCard = function () {
    $scope.LOADING = true;
    $scope.formBloqueio.numeroCartao = $scope.activeCard.numeroCartao;

    $http({
      method: 'POST',
      url: '/api-web/beneficiario/cartao/bloquear',
      data: $scope.formBloqueio,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.onstate = "success";
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.onstate = "error";
        if (data.message != null) {
          $scope.erroMessage = data.message;
        } else {
          $scope.erroMessage = "Não foi possível bloquear cartão.";
        }
      });
  };

  $scope.setOption = function (option) {
    $scope.formBloqueio.motivoBloqueio = option;
  };

  $scope.isBlockDisabled = function () {
    return $scope.formBloqueio.motivoBloqueio === null;
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
  };

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  $scope.changeState = function (state) {
    $scope.onstate = state;
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('bloquearCartaoController', $scope);
  }

  if ($scope.motivosBloqueio == null) {
    $http.get('/api-web/beneficiario/cartao/bloquear/listar-motivos')
      .success(function (response) {
        $scope.motivosBloqueio = response;
      })
      .error(function (data, status, headers, config) {
        $scope.onstate = "error";
        $scope.erroMessage = "Não possível realizar a operação. Tente novamente mais tarde.";
      });
  }


}]);
