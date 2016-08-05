appBeneficiario.controller('estatisticasCartaoController', ['$scope', '$timeout', '$rootScope', '$http', function ($scope, $timeout, $rootScope, $http) {

  $scope.chartist = null;
  $scope.LOADING = false;
  $scope.LOCKED = true;
  $scope.activeCard = null;
  $scope.errorMessage = null;
  $scope.fromConsultaRapida = false;
  $scope.lockedMessage = "Desbloqueie seu cartão para visualizar as estatísticas.";
  $scope.filter = 'forvalue';
  $scope.periodos = [{value: '1', label: '30 dias'}, {value: '3', label: '3 meses'}, {value: '12', label: '1 ano'}]


  $scope.hasNoContent = function () {
    return $scope.errorMessage === null && $scope.chartist === null && !$scope.LOADING && !$scope.LOCKED;
  };

  $scope.hasContent = function () {
    return $scope.chartist !== null && !$scope.LOADING && !$scope.LOCKED;
  };

  $scope.hasError = function () {
    return $scope.errorMessage !== null && !$scope.LOADING && !$scope.LOCKED;
  };

  $scope.retrieveMiddleChartData = function (part) {
    var result = $scope.periodos.filter(
      function (item) {
        return (item.value == $scope.daysold);
      }
    );
    return result[0].label.split(" ")[part];
  };

  $scope.changeFilter = function (value) {
    $scope.filter = value;
    $scope.triggerAction();
  };


  $scope.triggerAction = function () {
    $scope.LOADING = true;
    $scope.errorMessage = null;
    $scope.chartist = null;

    $http.get('/api-web/beneficiario/cartao/estatisticas/' + $scope.activeCard.numeroCartao + '?periodo=' + $scope.daysold + '&exibicao=' + ($scope.filter == 'morevisited' ? 1 : 2))
      .success(function (response) {
        $scope.LOADING = false;
        $scope.data = response;

        if ($scope.data.length === 0) {
          $scope.lockedMessage = "Não existem lançamentos para o período.";
          $scope.activeCard = null;
          $scope.LOCKED = true;
        } else {
          seriesList = [];
          angular.forEach($scope.data, function (value, key) {
            seriesList.push(value.porcetagem);
          });

          $scope.chartist = {
            data: {
              series: seriesList
            },
            options: {
              donut: true,
              strokeWidth: 10,
              labelInterpolationFnc: function (value) {
                return value + '%';
              }
            }
          };

        }
      }).error(function (data, status, headers, config) {
      $scope.LOADING = false;
      if (data) {
        $scope.errorMessage = data.message;
      } else {
        $scope.errorMessage = "Conteúdo indisponível no momento.";
      }
    });


    return false;
  };

  $scope.$on(constants.EVENTS.CARD_SELECTED, function (event, data) {

    $scope.daysold = 1;
    $scope.filter = 'forvalue';

    if (data.from == 'desbloquear') {
      $scope.lockedMessage = "Desbloqueie seu cartão para visualizar as estatísticas.";
    } else if (data.from == 'consultaRapida') {
      $scope.lockedMessage = "Não existem lançamentos para o período.";
      $scope.fromConsultaRapida = true;
    } else {
      $scope.lockedMessage = "Desbloqueie seu cartão para visualizar as estatísticas.";
      $scope.fromConsultaRapida = false;
    }

    if (data.activeCard !== undefined && data.activeCard !== null) {
      $scope.LOCKED = false;
      $scope.activeCard = data.activeCard;
      $scope.triggerAction();
    } else {
      $scope.activeCard = null;
      $scope.LOCKED = true;
    }
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('estatisticasCartaoController', $scope);
  }

}]);
