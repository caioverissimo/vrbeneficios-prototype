appEC.controller('RefundController', ['$rootScope', '$scope', '$http', '$uibModal', '$window', '$timeout', function ($rootScope, $scope, $http, $uibModal, $window, $timeout) {
  $scope.LOADING = true;
  $scope.SEARCHING = false;
  $scope.searchResult = null;
  $scope.searchDrillDownLevelOne = null;
  $scope.searchDrillDownLevelTwo = null;
  $scope.produto = null;
  $scope.guiasPage = null;
  $scope.transacoesPage = null;
  $scope.status = null;
  $scope.periodo = '';
  $scope.from = null;
  $scope.until = null;
  $scope.hasTransactions = false;
  $scope.periodos = [
    {id: '', name: ''},
    {id: 30, name: 'Últimos 30 dias'},
    {id: 60, name: 'Últimos 60 dias'},
    {id: 90, name: 'Últimos 90 dias'},
    {id: 120, name: 'Últimos 120 dias'},
    {id: 150, name: 'Últimos 150 dias'},
    {id: 180, name: 'Últimos 180 dias'}
  ];

  if ($scope.hasActiveEstablishment()) {
    $scope.cnpjEC = $rootScope.getActiveEstablishment().cnpj;
  }

  $http({
    method: 'GET',
    url: '/api-web/ec/cadastro/consultar-credenciamento',
    headers: {'Content-Type': 'text/plain'}
  }).success(function (data) {
    $scope.LOADING = false;
    $scope.produtos = data;
  }).error(function () {
    $scope.LOADING = false;
  });

  // Paginação - início
  if ($scope.urlQueryValue('pagina')) {
    var currentPage = parseInt($scope.urlQueryValue('pagina'));
    $scope.guiasPage = currentPage;
    $scope.transacoesPage = currentPage;
  } else {
    $scope.guiasPage = 1;
    $scope.transacoesPage = 1;
  }
  $scope.pageLimit = constants.SETTINGS.MAX_PAGINATION;

  $scope.changeGuiasPage = function (pageNumber) {
    $scope.LOADING = true;
    $scope.guiasPage = pageNumber;
    $scope.consultarGuias();
  };

  $scope.changeTransacoesPage = function (pageNumber) {
    $scope.LOADING = true;
    $scope.transacoesPage = pageNumber;
    $scope.consultarTransacoes($scope.searchDrillDownLevelOne);
  };
  // Paginação - fim

  $scope.openConfirmationModal = function () {
    var modal = $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/confirmacao-reembolso.html',
      controller: 'RefundModalController'
    });

    modal.result.then(function (result) {
      $scope.successConfirmation = result.confirmation;
      $scope.extraRefundPurchased = result.anticipation;
    });
  };

  $scope.hasContent = function () {
    return $scope.searchResult !== null && $scope.SEARCHING === false;
  };

  $scope.hasNoContent = function () {
    return $scope.searchResult !== null && $scope.searchResult.length <= 0
      && $scope.SEARCHING === false || !$scope.hasActiveEstablishment();
  };

  $scope.hasTooltip = function (value) {
    return value.length > 20;
  };

  $scope.showSearchTable = function () {
    return $scope.searchResult !== null && $scope.searchResult.length > 0 &&
      $scope.searchDrillDownLevelOne === null && $scope.searchDrillDownLevelTwo === null;
  };

  $scope.showDrillDownLevelOne = function () {
    return $scope.searchDrillDownLevelOne !== null && $scope.searchDrillDownLevelTwo === null;
  };

  $scope.showDrillDownLevelTwo = function () {
    return $scope.searchDrillDownLevelTwo !== null;
  };

  $scope.zoomOut = function () {
    if ($scope.searchDrillDownLevelTwo !== null) {
      $scope.searchDrillDownLevelTwo = null;
    } else if ($scope.searchDrillDownLevelOne !== null) {
      $scope.searchDrillDownLevelOne = null;
    }
  };

  $scope.downloadArquivoLayout = function () {
    $scope.LOADING = true;
    $http.get('/api-web/ec/reembolso/layoutExtratoReembolso', {responseType: 'arraybuffer'})
      .success(function (data) {
        $scope.LOADING = false;
        downloadFile(data, "application/pdf", 'layoutExtratoReembolso.pdf');
      }).error(function (data) {
      $scope.LOADING = false;
    })
  };

  $scope.alterarProduto = function () {
    $scope.LOADING = true;
    $http({
      method: 'GET',
      url: '/api-web/ec/reembolso/resumo/' + $scope.produto,
      headers: {'Content-Type': 'text/plain'},
      params: {page: 1}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.extratosReembolso = data;
    }).error(function () {
      $scope.LOADING = false;
      $scope.extratosReembolso = {};
    });
    return false;
  };

  $scope.alterarPeriodo = function () {
    $scope.from = null;
    $scope.until = null;
  };

  $scope.consultarGuias = function () {
    $scope.SEARCHING = true;
    $scope.searchResult = null;
    $scope.searchDrillDownLevelOne = null;
    $scope.searchDrillDownLevelTwo = null;

    var selectedPeriod = $scope.periodo;
    if ($scope.periodo == '') {
      selectedPeriod = null;
    }
    if ($scope.produto == null || $scope.status == null
      || ($scope.status == 1 && selectedPeriod == null && $scope.from == null && $scope.until == null)) {
      $scope.SEARCHING = false;
      return false;
    }
    $http({
      url: '/api-web/ec/reembolso/consulta/' + $scope.produto + '/' + $scope.status,
      method: 'GET',
      headers: {'Content-Type': 'text/plain'},
      params: {page: $scope.guiasPage, period: selectedPeriod, dateFrom: $scope.from, untilDate: $scope.until}
    }).success(function (data) {
      $scope.SEARCHING = false;
      $scope.searchResult = data.guias;
      $scope.guiasPageQuantity = Math.ceil(data.rows / 10);
    }).error(function () {
      $scope.SEARCHING = false;
    });
    return false;
  };

  $scope.drillDownLevelOne = function (item) {
    $scope.consultarDetalheGuia(item);
    return $scope.searchDrillDownLevelOne = item;
  };

  $scope.consultarDetalheGuia = function (guia) {
    $scope.SEARCHING = true;
    $scope.searchResult.levelOneDetails = null;
    $http({
      url: '/api-web/ec/reembolso/extrato/detalhe/' + guia.numero,
      method: 'GET',
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.SEARCHING = false;
      $scope.searchDrillDownLevelOne.levelOneDetails = data;
    }).error(function () {
      $scope.SEARCHING = false;
    });
    return false;
  };

  $scope.drillDownLevelTwo = function (item) {
    $scope.transacoesPage = 1;
    $scope.consultarTransacoes(item);
    return $scope.searchDrillDownLevelTwo = item;
  };

  $scope.consultarTransacoes = function (guia) {
    $scope.SEARCHING = true;
    $http({
      url: '/api-web/ec/reembolso/extrato/detalhe/transacao/' + guia.numero,
      method: 'GET',
      headers: {'Content-Type': 'text/plain'},
      params: {page: $scope.transacoesPage, dataInicial: null, dataFinal: null}
    }).success(function (data) {
      $scope.SEARCHING = false;
      $scope.searchDrillDownLevelTwo.levelTwoDetails = data.transacoes;
      if (data.transacoes.length > 0) {
        $scope.hasTransactions = true;
      } else {
        $scope.hasTransactions = false;
      }
      $scope.transacoesPageQuantity = Math.ceil(data.rows / 10);
    }).error(function () {
      $scope.SEARCHING = false;
      $scope.searchDrillDownLevelTwo.levelTwoDetails = {};
    });
    return false;
  };

  $scope.downloadGuia = function (guia) {
    $scope.SEARCHING = true;
    $http.get('/api-web/ec/reembolso/downloadGuiaReembolso/' + guia.numero, {responseType: 'arraybuffer'}
    ).success(function (data) {
      $scope.SEARCHING = false;
      downloadFile(data, "plain/text", 'TXT_Extrato_Reembolso.txt');
    }).error(function () {
      $scope.SEARCHING = false;
    })
  };

  $scope.openPrintPage = function (param) {
    $window.localStorage.setItem(constants.SESSION.ESTABLISHMENT_REFUND_PRINT, JSON.stringify($scope.searchDrillDownLevelOne));
    $window.localStorage.setItem(constants.SESSION.ESTABLISHMENT_REFUND_GUIDE_PRINT, JSON.stringify($scope.searchDrillDownLevelOne.levelOneDetails));
    var url = '/portal/app/UI-EC/impressao/reembolso-impressao.html';
    if (param === 'transactions') {
      url += '?' + param + '=true';
    } 
    $window.open(url, '_blank');
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
    $scope.exposeScope('RefundController', $scope);
  }

}]);

appEC.controller('RefundCardController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
  $scope.LOADING = $scope.hasActiveEstablishment();
  $scope.searchResult = null;
  $scope.status = 2;
  $scope.produtos = null;
  $scope.produto = 31;
  $scope.statusList = [
    {value: 1, name: 'Pagos'},
    {value: 2, name: 'Próximos'}
  ];

  if ($scope.hasActiveEstablishment()) {
    $scope.LOADING = true;
    $http({
      method: 'GET',
      url: '/api-web/ec/cadastro/consultar-credenciamento',
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.produtos = data;
      if ($scope.produtos[0] != null) {
        $scope.produto = $scope.produtos[0].id;
        $scope.consultar();
      }
    }).error(function () {
      $scope.LOADING = false;
    });
  }

  $scope.consultar = function () {
    $scope.LOADING = true;
    $scope.searchResult = [];
    $http({
      url: '/api-web/ec/reembolso/resumo/' + $scope.produto + '/' + $scope.status,
      method: 'GET',
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.searchResult = data.guias;
    }).error(function () {
      $scope.LOADING = false;
      $scope.searchResult = null;
    });
    return false;
  };

  $scope.hasProduct = function () {
    return $scope.produtos !== null && $scope.produtos.length > 0 && $scope.LOADING === false;
  };

  $scope.hasContent = function () {
    return $scope.searchResult !== null && $scope.searchResult.length > 0 && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return ($scope.searchResult === null || $scope.searchResult.length <= 0) && $scope.LOADING === false || !$scope.hasActiveEstablishment();
  };

  $scope.verReembolsoCompleto = function () {
    $window.location.href = 'reembolso.html';
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('RefundCardController', $scope);
  }

}]);

appEC.controller('ReembolsoImpressaoController', ['$rootScope', '$scope', '$http', '$uibModal', '$window', function ($scope, $rootScope, $http, $filter, $window) {

  $scope.searchDrillDownLevelTwo = null;
  $scope.hasLevelTwo = false;
  $scope.searchDrillDownLevelOne = JSON.parse($window.localStorage.getItem(constants.SESSION.ESTABLISHMENT_REFUND_PRINT));
  $scope.searchDrillDownLevelOne.levelOneDetails = JSON.parse($window.localStorage.getItem(constants.SESSION.ESTABLISHMENT_REFUND_GUIDE_PRINT));

  $scope.consultarTransacoes = function (guia) {
    $scope.SEARCHING = true;
    $http({
      url: '/api-web/ec/reembolso/extrato/detalhe/transacao/' + guia.numero,
      method: 'GET',
      headers: {'Content-Type': 'text/plain'},
      params: {page: null, dataInicial: null, dataFinal: null}
    }).success(function (data) {
      $scope.SEARCHING = false;
      $scope.searchDrillDownLevelTwo.levelTwoDetails = data.transacoes;
      $scope.hasLevelTwo = true;
      $scope.transacoesPageQuantity = Math.ceil(data.rows / 10);
    }).error(function () {
      $scope.SEARCHING = false;
      $scope.searchDrillDownLevelTwo.levelTwoDetails = {};
    });
    return false;
  };

  $scope.drillDownLevelTwo = function (item) {
    $scope.transacoesPage = 1;
    $scope.consultarTransacoes(item);
    return $scope.searchDrillDownLevelTwo = item;
  };

  if ($window.location.search.indexOf('transactions=true') !== -1) {
    $scope.drillDownLevelTwo($scope.searchDrillDownLevelOne);
  }

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ReembolsoImpressaoController', $scope);
  }

  $timeout(function () {
    $window.print();
  }, 3000);

  $window.onbeforeunload = function () {
    $window.localStorage.removeItem(constants.SESSION.ESTABLISHMENT_REFUND_GUIDE_PRINT);
    $window.localStorage.removeItem(constants.SESSION.ESTABLISHMENT_REFUND_PRINT);
  };

}]);
