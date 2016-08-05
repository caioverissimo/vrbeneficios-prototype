appEC.controller('SellsCardController', ['$rootScope', '$scope', '$http', '$window', '$filter', function ($rootScope, $scope, $http, $window, $filter) {

  $scope.LOADING = $scope.hasActiveEstablishment();
  $scope.chartist = null;
  $scope.produto = null;
  $scope.data = null;
  $scope.produtos = null;

  $scope.hasProduct = function () {
    return $scope.produtos !== null && $scope.produtos.length > 0 && $scope.LOADING === false;
  };

  $scope.hasContent = function () {
    return $scope.chartist !== null && $scope.data !== null && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return $scope.chartist === null && $scope.data === null && $scope.LOADING === false || !$scope.hasActiveEstablishment();
  };

  $scope.init = function () {
    $scope.LOADING = true;
    $http({
      method: 'GET',
      url: '/api-web/ec/cadastro/consultar-credenciamento',
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.produtos = data;
      if ($scope.produtos != null) {
        $scope.produto = $scope.produtos[0].id;
        if ($scope.hasActiveEstablishment()) {
          $scope.consultar();
        }
      }
    }).error(function () {
      $scope.LOADING = false;
      $scope.produtos = [];
    });
  };

  $scope.consultar = function () {
    $scope.LOADING = true;
    $scope.chartist = null;
    $http({
      method: 'GET',
      url: '/api-web/ec/venda/resumo/' + $scope.produto,
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.resumoVendas = data;
      $scope.plotarGrafico();
    }).error(function () {
      $scope.LOADING = false;
      $scope.resumoVendas = null;
      $scope.data = null;
    });
    return false;
  };

  $scope.plotarGrafico = function () {
    if ($scope.hasActiveEstablishment()) {
      $scope.data = {
        value: $filter('currency')($scope.resumoVendas.valorTotalVendas, 'R$ '),
        weeklyMean: $filter('currency')($scope.resumoVendas.mediaSemanal, 'R$ ')
      };

      $scope.chartist = {
        data: {
          labels: [
            $filter('date')($scope.resumoVendas.rotuloSemana1, 'dd MMM'),
            $filter('date')($scope.resumoVendas.rotuloSemana2, 'dd MMM'),
            $filter('date')($scope.resumoVendas.rotuloSemana3, 'dd MMM'),
            $filter('date')($scope.resumoVendas.rotuloSemana4, 'dd MMM'),
          ],
          series: [
            [
              $scope.resumoVendas.valorSemana1,
              $scope.resumoVendas.valorSemana2,
              $scope.resumoVendas.valorSemana3,
              $scope.resumoVendas.valorSemana4
            ]
          ]
        },
        options: {
          low: 0,
          showArea: true,
          stretch: true,
          axisY: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          axisX: {
            showGrid: false
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          plugins: [
            Chartist.plugins.tooltip({
              tooltipFnc: function (meta, value) {
                return $filter('currency')(value);
              }
            })
          ]
        }
      };
    }
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('SellsCardController', $scope);
  }

  $scope.init();

}]);
