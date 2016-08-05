appComum.controller('LoginController', ['$scope', '$http', '$uibModal', '$window', function ($scope, $http, $uibModal, $window) {
  $scope.LOADING = false;

  $scope.doLogin = function () {
    $window.location.href = '/beneficiario/dashboard.html';
  };

  $scope.openTermsModal = function (modelName) {
    var uibModalInstance = $uibModal.open({
      templateUrl: '/portal/app/UI-Comum/partials/modals/termos-de-uso.html',
      controller: 'TermosDeUsoController',
      size: 'lg'
    });

    uibModalInstance.result.then(function (response) {
      if (response) {
        $scope[modelName] = response;
      }
    });
  };

  $scope.carregarDadosUsuario = function () {
    if ($scope.cpf) {
      $scope.LOADING = true;
      $http({
        method: 'POST',
        url: '/api-web/comum/legado/usercontrol/consultar-dados-por-pf',
        data: {
          siglaEmissor: "vrpat",
          cpf: $scope.cpf
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function (data, status) {
        $scope.LOADING = false;
        if (data) {
          if (constants.SETTINGS.DEBUG) {
            console.log('LoginController: resultado da requisição: ');
            console.dir(data);
          }

          if (data.code == 0) {

            if (!$scope.name) {
              $scope.name = data.dados.nome;
            }

            if (!$scope.login) {
              $scope.login = data.dados.email;
            }

            if (!$scope.cel) {

              if (data.dados.celular) {

                if (data.dados.celular.length > 9) {
                  $scope.cel = data.dados.celular;
                }
              }
            }

            if (!$scope.birth) {
              $scope.birth = data.dados.dataNascimento;
            }
          }
        }
      }).error(function (data, status) {
        $scope.LOADING = false;
      });
    }
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('LoginController', $scope);
  }

}]);
