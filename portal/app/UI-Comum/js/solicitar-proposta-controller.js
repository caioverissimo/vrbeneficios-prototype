appComum.controller('SolicitarPropostaController', ['$scope', '$http', '$uibModal', function ($scope, $http, $uibModal) {

  $scope.formSolicitarProposta = {};
  $scope.currentStep = 1;
  $scope.municipios = [{}];
  $scope.produtos = [{"produto": 31}, {"produto": 27}, {"produto": 28}, {"produto": 30}, {"produto": 99999}];


  $scope.nextStep = function () {
    $scope.currentStep++;
  };

  $scope.previousStep = function () {
    $scope.currentStep--;
  };


  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('SolicitarPropostaController', $scope);
  }

  $scope.changeUf = function (ufSelecionado, callback) {
    $http({
      method: 'GET',
      url: '/api-web/comum/cadastro/listar-municipios/' + ufSelecionado,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.municipios = data;
      })
      .error(function (data, status, headers, config) {
        $scope.municipios = [{}];
        if (data) {
          console.log(data.message);
        } else {
          console.log(data.message);
        }
      });
    return false;
  };


  $scope.salvar = function (passoTela) {
    $scope.formSolicitarProposta.passo = passoTela;
    if (passoTela == 2) {
      $scope.formSolicitarProposta.propostaProduto = $scope.produtos.filter(function (o) {
        return o.selecionado;
      });
    }

    $http({
      method: 'POST',
      url: '/api-web/comum/solicite-proposta/enviar',
      data: $scope.formSolicitarProposta,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        if (passoTela == 2) {
          $uibModal.open({
            templateUrl: '/portal/app/UI-Comum/partials/modals/solicitar-proposta-sucesso.html',
            controller: 'ModalAvisoSolicitarProposta',
            backdrop: 'static',
            size: 'lg',
            keyboard: false
          });
        } else {
          $scope.currentStep++;
        }
      })
      .error(function (data, status, headers, config) {
        $scope.feedbacks = [{
          type: 'danger', msg: "Não foi possível executar operação. Tente novamente mais tarde."
        }];
      });

  };


}]);

appComum.controller('ModalAvisoSolicitarProposta', ['$scope', '$uibModalInstance', '$window', function ($scope, $uibModalInstance, $window) {
  $scope.onstate = "awaiting";
  $scope.LOADING = false;
  $scope.messageSubject = "Aviso"
  $scope.messageDetail = "Recebemos a sua solicitação com sucesso.\nEm breve entraremos em contato."


  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
    $window.location.reload();
  };

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
    $window.location.reload();
  };

}]);
