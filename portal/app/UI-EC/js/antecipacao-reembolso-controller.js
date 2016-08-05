appEC.controller('RefundAnticipationController', ['$rootScope', '$scope', '$http', '$timeout', '$uibModal', function ($rootScope, $scope, $http, $timeout, $uibModal) {
  $scope.LOADING = $scope.hasActiveEstablishment();
  $scope.data = null;
  $scope.antecipacaoAutomatica = null;
  $scope.extraRefundPurchased = false;
  $scope.extraRefundPanelModal = false;
  $scope.isResume = true;

  $scope.confirmarReembolso = function () {
    $scope.LOADING = true;
    $scope.reembolso = {};
    $scope.reembolso.antecipacaoAutomatica = ($scope.antecipacaoAutomatica && $scope.data.status == 2);
    $scope.reembolso.guias = $scope.data.dadosGuiaReembolso;

    $http({
      method: 'POST',
      url: '/api-web/ec/reembolso/antecipacao-resumo/confirmar',
      data: $scope.reembolso,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.antecipacaoConfirmada = data;
      if ($scope.reembolso.antecipacaoAutomatica) {
        $scope.extraRefundPurchased = true;
      }
    }).error(function () {
      $scope.LOADING = false;
      $scope.antecipacaoConfirmada = null;
      $scope.extraRefundPurchased = false;
    });
  };

  $scope.openConfirmationModal = function () {
    var modal = $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/confirmacao-reembolso.html',
      scope: $scope,
      controller: 'RefundModalController'
    });

    modal.result.then(function (result) {
      $scope.successConfirmation = result.confirmation;
      $scope.antecipacaoAutomatica = result.anticipation;
      if ($scope.successConfirmation) {
        $scope.confirmarReembolso();
      }
    });
  };

  $scope.getExtraRefundDashboard = function (status) {
    switch (status) {
      case 'start':
        if ($scope.acordo == true) {
          $scope.extraRefundPanelModal = true;
        }
        break;
      case 'cancel':
        $scope.extraRefundPanelModal = false;
        $scope.extraRefundPurchased = false;
        break;
      case 'confirm':
        $scope.confirmarReembolso();
        $scope.extraRefundPanelModal = false;
        break;
    }
  };

  $scope.hasContent = function () {
    return $scope.data !== null && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return $scope.data === null && $scope.LOADING === false || !$scope.hasActiveEstablishment();
  };

  $scope.init = function () {
    if ($scope.hasActiveEstablishment()) {
      $http({
        url: '/api-web/ec/reembolso/antecipacao-resumo',
        method: 'GET',
        headers: {'Content-Type': 'text/plain'}
      }).success(function (data) {
        $scope.LOADING = false;
        $scope.data = data;
        $scope.antecipacaoAutomatica = data.status == 1 ? true : false;
      }).error(function () {
        $scope.LOADING = false;
        $scope.antecipacao = {};
      });
      return false;
    }
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('RefundAnticipationController', $scope);
  }

}]);

appEC.controller('RefundModalController', ['$rootScope', '$http', '$scope', '$uibModalInstance', function ($rootScope, $http, $scope, $uibModalInstance) {
  $scope.isInModal = true;

  $scope.cancel = function () {
    $uibModalInstance.close({confirmation: false, anticipation: $scope.antecipacaoAutomatica});
  };

  $scope.confirm = function () {
    $uibModalInstance.close({confirmation: true, anticipation: $scope.antecipacaoAutomatica});
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('RefundModalController', $scope);
  }

}]);


