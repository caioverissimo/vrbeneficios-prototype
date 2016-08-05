appBeneficiario.controller('confirmarCartaoController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
  $scope.LOADING = false;
  $scope.feedbacks = null;
  $scope.confirmarForm = {};

  constants.CONFIRMAR_CARTAO_MESSAGES = {
    DEFAULT_ERROR_MESSAGE: 'Não possível realizar a operação. Tente novamente mais tarde.',
    CARTAO_INVALIDO_ERROR_MESSAGE: 'Cartão inválido.'
  };

  $scope.closeFeedback = function (index) {
    $scope.feedbacks.splice(index, 1);
  };

  $scope.notificarNavigation = function (viewName) {
    $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_VIEW, {view: viewName});
  };

  $scope.init = function () {
    $scope.LOADING = true;
    $http.get('/api-web/beneficiario/cartao/exibir')
      .success(function (response) {
        $scope.LOADING = false;
        if (response.message == "true") {
          $rootScope.$broadcast(constants.EVENTS.NAVIGATION_CHECK_CARD);
          $scope.notificarNavigation('mycards');
        }
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        console.log("Erro ao verificar cartões confirmados");
      });
  };

  $scope.triggerAction = function () {
    $scope.LOADING = true;
    $http({
      method: 'POST',
      url: '/api-web/beneficiario/cartao/confirmar-cartao',
      data: $scope.confirmarForm,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.LOADING = false;
        if (data.code == 0) {
          $rootScope.$broadcast(constants.EVENTS.NAVIGATION_CHECK_CARD);
          $scope.notificarNavigation('mycards');
        } else {
          $scope.feedbacks = [{
            type: 'danger', msg: data.message
          }];
        }
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.feedbacks = [{
          type: 'danger', msg: constants.CONFIRMAR_CARTAO_MESSAGES.CARTAO_INVALIDO_ERROR_MESSAGE
        }];
      });
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('confirmarCartaoController', $scope);
  }

}]);




