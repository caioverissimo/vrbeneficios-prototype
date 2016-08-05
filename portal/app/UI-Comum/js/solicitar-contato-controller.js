appComum.controller('solicitarContatoController', ['$rootScope', '$scope', '$http', '$uibModal', '$window', function ($rootScope, $scope, $http, $uibModal, $window) {
  $scope.formSolicitarContato = {};
  $scope.recaptchaKey = null;

  $scope.openConfirmationModal = function () {
    var modal = $uibModal.open({
      templateUrl: '/portal/app/UI-Comum/partials/modals/confirmacao-solicitar-contato.html',
      controller: 'ModalSolicitarContatoCtrl'
    });

    modal.result.then(function (result) {
      if (result === 'confirm') {
        $scope.sendRequest();
      }
    });

  };

  $scope.init = function () {

    if ($scope.recaptchaKey === null) {
      $http({
        method: 'GET',
        url: '/api-web/comum/recaptcha/chave',
        headers: {'Content-Type': 'text/plain'}
      }).success(function (data) {
        $scope.recaptchaKey = data.message;
      }).error(function (data, status, headers, config, statusText) {
        console.log("init Error captcha error");
      });
    }

    return $scope.recaptchaKey;

  };

  $scope.recapchaSize = function () {
    var size = '';
    if ($window.matchMedia(constants.MEDIA_QUERIES.MOBILE_SCREEN).matches) {
      size = 'compact';
    } else {
      size = 'normal';
    }
    return size;
  };


  $scope.sendRequest = function () {

    $http({
      method: 'POST',
      url: '/api-web/comum/cadastro/contato',
      data: $scope.formSolicitarContato,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.formSolicitarContato = {};
        $scope.ctrl.contato.$setPristine();
        $scope.ctrl.contato.$setUntouched();
        $scope.feedbacks = [{
          msg: "Sua solicitação foi enviada com sucesso!"
        }];
      })
      .error(function (data, status, headers, config) {
        $scope.formSolicitarContato = {};
        $scope.ctrl.contato.$setPristine();
        $scope.ctrl.contato.$setUntouched();
        $scope.feedbacks = [{
          type: 'danger', msg: "Não foi possível executar operação. Tente novamente mais tarde."
        }];
      });

  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('solicitarContatoController', $scope);
  }

  if (!$rootScope.isInConfirmation()) {
    $scope.init();
  }

}]);

appComum.controller('ModalSolicitarContatoCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

  $scope.onstate = "awaiting";
  $scope.LOADING = false;

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
    $scope.exposeScope('ModalSolicitarContatoCtrl', $scope);
  }

}]);
