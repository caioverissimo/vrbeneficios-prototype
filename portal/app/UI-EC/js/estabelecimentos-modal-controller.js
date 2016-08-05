appEC.controller('EstablishmentModalCallController', ['$rootScope', '$scope', '$uibModal', function ($rootScope, $scope, $uibModal) {
  var hasActiveEstablishment = $rootScope.hasActiveEstablishment();

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('EstablishmentModalCallController', $scope);
  }

  if (!hasActiveEstablishment) {
    $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/selecao-estabelecimentos.html',
      controller: 'EstablishmentModalController',
      backdrop: 'static',
      keyboard: false
    });
  }
}]);

appEC.controller('EstablishmentModalController', ['$rootScope', '$scope', '$window', '$uibModal', '$uibModalInstance', '$http', '$filter', function ($rootScope, $scope, $window, $uibModal, $uibModalInstance, $http, $filter) {

  $scope.LOADING = true;
  $scope.ERROR = null;
  $scope.establishments = [];
  $scope.orderBy = $filter('orderBy');
  $scope.reverse = true;

  $scope.query = {};
  $scope.query.cnpj = "";
  $scope.query.filteredCnpj = "";

  $scope.order = function (predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
    $scope.establishments = $scope.orderBy($scope.establishments, predicate, $scope.reverse);
  };
  $scope.order('nome', true);

  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
  };

  $scope.hasError = function () {
    return $scope.ERROR !== null;
  };

  $scope.hasActiveEstablishment = $rootScope.getActiveEstablishment;

  $scope.select = function (establishment) {
    $uibModalInstance.dismiss("close");
    $rootScope.$broadcast(constants.EVENTS.ESTABLISHMENT_SELECTED, {
      activeEstablishment: establishment,
      callback: function () {
        $window.location.reload();
      }
    });
  };

  $scope.highlight = function (index) {
    $scope.highlighted = index;
  };

  $scope.cleanHighlight = function () {
    $scope.highlighted = null;
  };

  $scope.highlightClass = function (index) {
    var cls = '';
    if ($scope.highlighted === index) {
      cls += 'table-link-active';
    } else {
      cls += 'table-link-inactive';
    }
    return cls;
  };

  $scope.createFilteredCnpj = function () {
    for (var i = 0; i < $scope.establishments.length; i++) {
      $scope.establishments[i].filteredCnpj = $filter('cnpjFilter')($scope.establishments[i].cnpj);
    }
  };

  $scope.updateCnpjQuery = function () {
    if ($scope.cnpjBase.indexOf('.') > -1 || $scope.cnpjBase.indexOf('/') > -1 || $scope.cnpjBase.indexOf('-') > -1) {
      $scope.query.filteredCnpj = $scope.cnpjBase;
      $scope.query.cnpj = "";
    } else {
      $scope.query.cnpj = $scope.cnpjBase;
      $scope.query.filteredCnpj = "";
    }
  };

  $scope.init = function () {
    $scope.LOADING = true;
    $http({
      method: 'GET',
      url: '/api-web/ec/empresas',
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.establishments = data;
      $scope.createFilteredCnpj();
      if (!data.length) {
        $scope.ERROR = "Nenhuma empresa encontrada.";
      }
      else if (data.length === 1) {
    	  $scope.select($scope.establishments[0]);
      }
    }).error(function (data) {
      $scope.LOADING = false;
      $scope.ERROR = data;
      $uibModalInstance.dismiss("close");
    });
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('EstablishmentModalController', $scope);
  }

  $scope.init();

}]);
