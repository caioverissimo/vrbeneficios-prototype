appBeneficiario.controller('extratoResumidoController', ['$scope', '$window', function ($scope, $window) {
  $scope.LOCKED = true;
  $scope.LOADING = false;
  $scope.activeCard = null;
  $scope.fromConsultaRapida = false;
  $scope.lockedMessage = "Desbloqueie seu cartão para visualizar o extrato.";
  $scope.isResume = true;

  $scope.hasContent = function () {
    return !$scope.LOADING && !$scope.LOCKED;
  };

  $scope.verExtratoCompleto = function () {
    $window.location.href = 'extrato.html';
  };

  $scope.hasTransactions = function () {
    return $scope.activeCard !== null && $scope.activeCard.transacoes !== null && $scope.activeCard.transacoes.length > 0
  };

  $scope.$on(constants.EVENTS.CARD_SELECTED, function (event, data) {
    $scope.LOADING = true;

    if (data.from == 'desbloquear') {
      $scope.lockedMessage = "Desbloqueie seu cartão para visualizar o extrato.";
    } else if (data.from == 'consultaRapida') {
      $scope.lockedMessage = "Não existem lançamentos para o período.";
      $scope.fromConsultaRapida = true;
    } else {
      $scope.lockedMessage = "Desbloqueie seu cartão para visualizar o extrato.";
      $scope.fromConsultaRapida = false;
    }

    if (data.activeCard !== undefined && data.activeCard !== null) {
      if (data.activeCard.transacoes === null || data.activeCard.transacoes.length === 0) {
        $scope.lockedMessage = "Não existem lançamentos para o período.";
      } else {
        $scope.activeCard = data.activeCard;
        $scope.extrato = data.activeCard.transacoes;
        $scope.LOCKED = false;
      }
    } else {
      $scope.activeCard = null;
      $scope.extrato = null;
      $scope.LOCKED = true;
    }
    $scope.LOADING = false;
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('extratoResumidoController', $scope);
  }
  
}]);
