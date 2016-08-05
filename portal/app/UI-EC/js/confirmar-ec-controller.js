appEC.controller('confirmarECController', ['$scope', '$http', function ($scope, $http) {
  $scope.establishments = [];
  $scope.feedbacks = [];
  $scope.formConfirmarEC = {};
  $scope.showButtonGoToDashboard = false;

  $scope.addFields = function () {
    $scope.LOADING = true;
    $scope.error = {};
    if ($scope.confirmacaoestabelecimentos.$valid) {

      $scope.formConfirmarEC.cnpj = $scope.currentCNPJ;
      $scope.formConfirmarEC.numeroFiliacao = $scope.currentFiliacao;

      $http({
        method: 'POST',
        url: '/api-web/ec/cadastro/confirmar',
        data: $scope.formConfirmarEC,
        headers: {'Content-Type': 'application/json'}
      }).success(function () {
        $scope.establishments.push({CNPJ: $scope.currentCNPJ, filiacao: $scope.currentFiliacao, message: true});
        if ($scope.establishments.length > 1) {
          $scope.establishments[$scope.establishments.length - 2].message = false;
        }

        $scope.currentCNPJ = "";
        $scope.currentFiliacao = "";
        $scope.confirmacaoestabelecimentos.$setPristine();
        $scope.LOADING = false;

      }).error(function (data) {
        if (data !== undefined && data !== null && data.code < 0) {
          $scope.error.message = data.message;
        } else {
          $scope.error.message = "Não foi possível executar operação. Tente novamente mais tarde.";
        }
        $scope.LOADING = false;
      });
    }
  };

  $scope.isNewCNPJEntry = function (currentCNPJ) {
    var isNewEntry = true;
    for (var i = 0; i < $scope.establishments.length; i++) {
      if ($scope.establishments[i].CNPJ === currentCNPJ) {
        isNewEntry = false;
      }
    }
    return isNewEntry;
  };

  $scope.hasEstablishment = function () {
    return $scope.establishments.length > 0;
  };

  $scope.init = function () {
    $scope.LOADING = true;
    $http({
      method: 'GET',
      url: '/api-web/ec/empresas',
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      if (!data.length) {
        $scope.showButtonGoToDashboard = false;
      } else {
        $scope.showButtonGoToDashboard = true;
      }
    }).error(function (data) {
      $scope.showButtonGoToDashboard = true;
    });
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('confirmarECController', $scope);
  }

  $scope.init();


}]);
