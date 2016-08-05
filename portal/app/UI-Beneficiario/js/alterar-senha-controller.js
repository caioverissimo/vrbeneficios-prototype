appBeneficiario.controller('alterarSenhaController', ['$scope', '$uibModalInstance', '$timeout', 'activeCard', '$http', function ($scope, $uibModalInstance, $timeout, activeCard, $http) {

  $scope.onstate = "awaiting";
  $scope.LOADING = false;
  $scope.activeCard = activeCard;
  $scope.option = null;
  $scope.formAlterarSenha = {};
  $scope.formAlterarSenha.novaSenha = null;
  $scope.formAlterarSenha.senhaAtual = null;
  $scope.formAlterarSenha.confirmarNovaSenha = null;
  $scope.formAlterarSenha.numeroCartao = null;
  $scope.formAlterarSenha.numeroCartaoInformado = null;
  $scope.formEsqueciSenha = {};
  $scope.formEsqueciSenha.cpf = null;
  $scope.formEsqueciSenha.dataNascimento = null;
  $scope.formEsqueciSenha.novaSenha = null;
  $scope.formEsqueciSenha.confirmarNovaSenha = null;
  $scope.formEsqueciSenha.numeroCartao = null;
  $scope.formEsqueciSenha.numeroCartaoInformado = null;
  $scope.erroMessage = null;

  $scope.alterarSenha = function () {
    $scope.LOADING = true;
    $scope.formAlterarSenha.numeroCartao = $scope.activeCard.numeroCartao;


    $http({
      method: 'POST',
      url: '/api-web/beneficiario/cartao/alterar-senha',
      data: $scope.formAlterarSenha,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.onstate = "success";
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        if (data.message != null) {
          $scope.erroMessage = data.message;
        } else {
          $scope.erroMessage = "";
        }
        $scope.onstate = "error";
      });

  };

  $scope.confirmarEsqueciSenha = function () {
    $scope.LOADING = true;
    $scope.formEsqueciSenha.numeroCartao = $scope.activeCard.numeroCartao;

    $http({
      method: 'POST',
      url: '/api-web/beneficiario/cartao/esqueci-senha',
      data: $scope.formEsqueciSenha,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.onstate = "success";
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        if (data.message != null) {
          $scope.erroMessage = data.message;
        } else {
          $scope.erroMessage = "";
        }
        $scope.onstate = "error";
      });

  };


  $scope.setOption = function (option) {
    $scope.option = option;
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
    $scope.exposeScope('alterarSenhaController', $scope);
  }

}]);
