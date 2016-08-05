appEC.controller('ContratosModalCallController', ['$rootScope', '$scope', '$uibModal', '$http', function ($rootScope, $scope, $uibModal, $http) {
  $scope.contratosPendentes = {};
  //Abrir modal
  var hasActiveEstablishment = $rootScope.hasActiveEstablishment();
  if (hasActiveEstablishment) {
    //Abrir modal contratos pendentes
    $scope.consultarContratosPendentes = function () {
      $http({
        method: 'GET',
        url: '/api-web/ec/contrato/visualizar',
        headers: {
          'Content-Type': 'text/plain'
        }
      }).success(function (data, status, headers, config) {
        $scope.contratosPendentes = data;
        if ($scope.contratosPendentes !== undefined && $scope.contratosPendentes !== null && $scope.contratosPendentes.length > 0) {
          $uibModal.open({
            templateUrl: '/portal/app/UI-EC/partials/modals/contratos-pendentes.html',
            controller: 'ContratosPendentesModalController',
            backdrop: 'static',
            keyboard: false,
            resolve: {
              activeEstablishment: function () {
                return $rootScope.getActiveEstablishment();
              },
              pendingContracts: function () {
                return $scope.contratosPendentes;
              }
            }
          });
        } else {
          $rootScope.$broadcast(constants.EVENTS.BANK_AND_QUALIF_DATA_CHECK);
        }
      }).error(function (data, status, headers, config) {
        $scope.pendingContracts = {};
        if (data) {
          console.log("Erro : " + data.message);
        } else {
          console.log("Erro interno");
        }
      });
      return false;
    };
    $scope.consultarContratosPendentes();

  }

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ContratosModalCallController', $scope);
  }

}]);


appEC.controller('ContratosPendentesModalController', ['$scope', '$uibModal', '$uibModalInstance', 'activeEstablishment', 'pendingContracts', '$http', 'vrModalCustomize', function ($scope, $uibModal, $uibModalInstance, activeEstablishment, pendingContracts, $http, vrModalCustomize) {
  $scope.LOADING = false;
  $scope.pendingContracts = pendingContracts;
  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
  };

  $scope.openAcceptModal = function (contract) {
    $uibModalInstance.dismiss("close");

    //Abrir modal aceite do contrato
    $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/aceite-contrato.html',
      controller: 'AceitarContratoModalController',
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        activeEstablishment: function () {
          return activeEstablishment;
        },
        contract: function () {
          return contract;
        },
        pendingContracts: function () {
          return pendingContracts;
        }
        , acceptedContracts: function () {
          return [];
        }
      }
    });
  };

  $scope.select = function (contract) {
    if (!contract.pdf) {
      $scope.LOADING = true;
      $http.get('/api-web/ec/contrato/visualizar-pdf/' + contract.id).then(function (result) {
        contract.pdf = 'data:application/pdf;base64,' + result.data.contrato;
        $scope.LOADING = false;
        $scope.openAcceptModal(contract);
      });
    } else {
      $scope.openAcceptModal(contract);
    }
  };

  vrModalCustomize.toCenter($uibModalInstance);

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ContratosPendentesModalController', $scope);
  }

}]);

appEC.controller('AceitarContratoModalController', ['$rootScope', '$scope', '$uibModal', '$uibModalInstance', '$http', '$window', 'activeEstablishment', 'pendingContracts', 'acceptedContracts', 'contract', function ($rootScope, $scope, $uibModal, $uibModalInstance, $http, $window, activeEstablishment, pendingContracts, acceptedContracts, contract) {

  $scope.contract = contract;
  $scope.currentPage = 1;
  $scope.totalPages = -1;
  $scope.pdf = null;

  $scope.convertDataURIToBinary = function (dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = $window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  };

  $scope.renderPage = function (num) {
    if ($scope.pdf) {
      $scope.pdf.getPage(num).then(function (page) {
        var scale = 1.4;
        var viewport = page.getViewport(scale);
        var canvas = document.getElementById('contractCanvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var context = canvas.getContext('2d');
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    }
  };

  $scope.renderPdf = function (pdf) {
    $scope.pdf = pdf;
    $scope.totalPages = pdf.numPages;
    $scope.renderPage($scope.currentPage);
  };

  $scope.dontAccept = function () {
    $uibModalInstance.dismiss("dontAccept");
    $scope.return();
  };

  $scope.return = function () {
    // Abre modal de  contratos pendentes
    $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/contratos-pendentes.html',
      controller: 'ContratosPendentesModalController',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        activeEstablishment: function () {
          return activeEstablishment;
        },
        pendingContracts: function () {
          return pendingContracts;
        },
        acceptedContracts: function () {
          return acceptedContracts;
        }
      }
    });
  };

  $scope.accept = function () {
    $uibModalInstance.dismiss("accept");
    var contractIndex = pendingContracts.indexOf(contract);

    $http({
      method: 'POST',
      url: '/api-web/ec/contrato/aceitar',
      data: "{\"codigoProduto\":" + contract.id + "}",
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        acceptedContracts.push(pendingContracts.splice(contractIndex, 1)[0]);
        // só vai para proxima tela se todos os contratos forem aceitos...
        if (pendingContracts.length > 0) {
          $scope.return();
        } else {
          $rootScope.$broadcast(constants.EVENTS.BANK_AND_QUALIF_DATA_CHECK);
        }
      })
      .error(function (data, status, headers, config) {
        if (data) {
          console.log("Erro : " + data.message);
        } else {
          console.log("Erro interno");
        }
      });
  };

  $scope.$watch('currentPage', function (value) {
    $scope.renderPage(value);
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('AceitarContratoModalController', $scope);
  }

  // inicia plugin pdf js
  PDFJS.getDocument($scope.convertDataURIToBinary(contract.pdf)).then($scope.renderPdf);

}]);

