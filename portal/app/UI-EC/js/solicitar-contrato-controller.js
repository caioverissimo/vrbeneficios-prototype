appEC.controller('solicitarContratoController', function ($scope, $rootScope, $http) {
  $scope.showModalInfo = false;
  $scope.modalInfo = {};
  $scope.formSolicitarContrato = {};

  $scope.confirmar = function () {
    if ($scope.formSolicitarContrato.estabelecimento == null) {
      alert("Favor preencher o nome do estabelecimento.");
      return;
    }
    if ($scope.formSolicitarContrato.contato == null) {
      alert("Favor preencher o nome do contato.");
      return;
    }
    if ($scope.ddd == null) {
      alert("Favor preencher o ddd.");
      return;
    }
    if ($scope.telefone == null) {
      alert("Favor preencher o telefone.");
      return;
    }

    $scope.formSolicitarContrato.telefone = $scope.ddd + $scope.telefone;

    $http({
      method: 'POST',
      url: '/api-web/ec/cadastro/contato',
      data: $scope.formSolicitarContrato,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.modalInfo.message = data.message;
        $scope.toggleModalInfo();
      })
      .error(function (data, status, headers, config) {
        if (data) {
          $scope.modalInfo.message = data.message;
        } else {
          $scope.modalInfo.message = "Erro interno";
        }
        $scope.toggleModalInfo();
      });

  };

  $scope.toggleModalInfo = function () {
    $scope.showModalInfo = !$scope.showModalInfo;
    if (!$scope.showModalInfo) {
      $scope.modalInfo = {};
    }
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('solicitarContratoController', $scope);
  }

});




