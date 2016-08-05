appBeneficiario.controller('desbloquearCartaoController', ['$rootScope', '$scope', '$timeout', '$http', '$uibModal', function ($rootScope, $scope, $timeout, $http, $uibModal) {
  $scope.LOADING = false;
  $scope.feedbacks = null;
  $scope.formDesbloqueio = {};

  constants.CONSULTA_RAPIDA_MESSAGES = {
    DEFAULT_ERROR_MESSAGE: 'Não possível realizar a operação. Tente novamente mais tarde.'
  };

  $scope.notificarWidgets = function (cartao) {
    $rootScope.$broadcast(constants.EVENTS.CARD_SELECTED, {activeCard: cartao, from: 'desbloquear'});
  };

  $scope.closeFeedback = function (index) {
    $scope.feedbacks.splice(index, 1);
  };

  $scope.showPersonalInfoInputs = function () {
    return $scope.formDesbloqueio.tipoDesbloqueio == 1 || $scope.formDesbloqueio.tipoDesbloqueio == 2;
  };

  $scope.showCodeInput = function () {
    return $scope.formDesbloqueio.tipoDesbloqueio == 0;
  };

  $scope.triggerAction = function () {
    if ($scope.formDesbloqueio.tipoDesbloqueio === undefined) {
      $scope.verificarDesbloqueio();
    } else {
      $scope.desbloquearCartao();
    }
  };

  $scope.verificarDesbloqueio = function () {

    $scope.LOADING = true;
    $http({
      method: 'GET',
      url: '/api-web/beneficiario/cartao/desbloquear/' + $scope.formDesbloqueio.cartao,
      headers: {'Content-Type': 'text/plain'}
    })
      .success(function (data, status, headers, config) {
        $scope.formDesbloqueio.tipoDesbloqueio = data.message;
        $scope.LOADING = false;
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        if (data) {
          $scope.feedbacks = [{
            type: 'danger', msg: data.message
          }];
        } else {
          $scope.feedbacks = [{
            type: 'danger', msg: constants.CONSULTA_RAPIDA_MESSAGES.DEFAULT_ERROR_MESSAGE
          }];
        }
      });

  };

  $scope.desbloquearCartao = function () {
    $scope.LOADING = true;

    $http({
      method: 'POST',
      url: '/api-web/beneficiario/cartao/desbloquear',
      data: $scope.formDesbloqueio,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.LOADING = false;

        var modal = $uibModal.open({
          templateUrl: '/portal/app/UI-Beneficiario/partials/modals/desbloqueio-cartao.html',
          controller: 'desbloqueioDeCartaoModalController',
          resolve: {
            cardNumber: function () {
              return $scope.formDesbloqueio.cartao;
            },
            tipoDesloqueio: function () {
              return $scope.formDesbloqueio.tipoDesbloqueio;
            }
          }
        });

        modal.result.then(function (result) {
          if (result == 0) {
            $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_VIEW, {view: 'fastsearch'});
          } else {
            $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_VIEW, {view: 'mycards'});
          }
        });

        $scope.formDesbloqueio = {};
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        if (data) {
          $scope.feedbacks = [{
            type: 'danger', msg: data.message
          }];
        } else {
          $scope.feedbacks = [{
            type: 'danger', msg: constants.CONSULTA_RAPIDA_MESSAGES.DEFAULT_ERROR_MESSAGE
          }];
        }
        $scope.formDesbloqueio = {};
      });

  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('desbloquearCartaoController', $scope);
  }

  $scope.notificarWidgets(null);

}]);

appBeneficiario.controller('desbloqueioDeCartaoModalController', ['$scope', '$uibModalInstance', 'cardNumber', 'tipoDesloqueio', function ($scope, $uibModalInstance, cardNumber, tipoDesloqueio) {
  $scope.cardNumber = cardNumber;
  $scope.tipoDesloqueio = tipoDesloqueio;

  $scope.close = function () {
    $uibModalInstance.dismiss();
  };

  $scope.checkCardAmount = function () {
    $uibModalInstance.close(tipoDesloqueio);
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('desbloqueioDeCartaoModalController', $scope);
  }

}]);
