appEC.controller('IncomeController', ['$scope', '$rootScope', '$http', '$window', function ($scope, $rootScope, $http, $window) {
  $scope.LOADING = false;
  $scope.data = null;

  $scope.hasContent = function () {
    return $scope.data !== null && $scope.data.length > 0 && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return ($scope.data === null || $scope.data.length < 1) && $scope.LOADING === false || !$scope.hasActiveEstablishment();
  };

  $scope.listar = function () {
    if ($scope.hasActiveEstablishment()) {
      $scope.LOADING = true;
      $http({
        url: '/api-web/comum/rendimentos',
        method: 'GET',
        headers: {'Content-Type': 'text/plain'}
      }).success(function (data) {
        $scope.LOADING = false;
        $scope.data = data;
      }).error(function () {
        $scope.LOADING = false;
        $scope.informesRendimento = {};
      });
      return false;
    }
  };

  $scope.download = function (filename) {
    $scope.LOADING = true;
    $http({
      url: '/api-web/comum/rendimentos/download',
      method: 'GET',
      headers: {'Content-Type': 'text/plain'},
      params: {file: filename},
      responseType: 'arraybuffer'
    }).success(function (data) {
      $scope.LOADING = false;
      var contentType = "application/pdf";
      downloadFile(data, contentType, "InformeRendimentos.pdf");
    }).error(function () {
      $scope.LOADING = false;
    });
    return false;
  };

  function downloadFile(data, contentType, fileName) {
    if ($window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([data], {type: contentType});
      navigator.msSaveBlob(blob, fileName);
    } else {
      var file = new Blob([data], {type: contentType});
      var url = $window.URL || $window.webkitURL;
      var fileURL = url.createObjectURL(file);
      var anchor = angular.element('<a/>');
      anchor.css({display: 'none'}); // Make sure it's not visible
      angular.element(document.body).append(anchor); // Attach to document
      anchor.attr({
        href: fileURL,
        target: '_self',
        download: fileName
      })[0].click();
      anchor.remove();
    }
  }

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('IncomeController', $scope);
  }

}]);
