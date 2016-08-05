appEC.controller('SellsController', ['$rootScope', '$scope', '$http', '$window', function ($rootScope, $scope, $http, $window) {
  $scope.LOADING = true;
  $scope.produto = null;
  $scope.produtos = null;
  $scope.data = null;
  $scope.dateStartLabel = "Data início";
  $scope.dateStart = null;
  $scope.dateEnd = null;
  $scope.dateEndLabel = "Data fim";
  $scope.pagina = 1;
  $scope.total = 0;

  // Paginação - início
  if ($scope.urlQueryValue('pagina')) {
    $scope.pagina = parseInt($scope.urlQueryValue('pagina'));
  }
  $scope.pageLimit = constants.SETTINGS.MAX_PAGINATION;

  $scope.changePage = function (pageNumber) {
    $scope.LOADING = true;
    $scope.pagina = pageNumber;
    $scope.doSearch();
  };

  $scope.setStartDate = function () {
    // modulo pickadate funciona com this...
    if (this.dateStart) {
      $scope.dateStartLabel = this.dateStart;
    }
  };

  $scope.setEndDate = function () {
    // modulo pickadate funciona com this...
    if (this.dateEnd) {
      $scope.dateEndLabel = this.dateEnd;
    }
  };

  $scope.doSearch = function () {
    $scope.LOADING = true;
    var dateStartLabel, dateEndLabel;
    if ($scope.dateStartLabel != null) {
      dateStartLabel = $scope.dateStartLabel.replace(/\//g, '-');
    }
    if ($scope.dateEndLabel != null) {
      dateEndLabel = $scope.dateEndLabel.replace(/\//g, '-');
    }
    $http({
      method: 'GET',
      url: '/api-web/ec/venda/detalhe/' + $scope.produto.id + '/' + dateStartLabel + '/' + dateEndLabel,
      headers: {'Content-Type': 'text/plain'},
      params: {page: $scope.pagina, maxRows: $scope.pageLimit}
    }).success(function (data) {
      $scope.LOADING = false;
      if (data) {
        $scope.data = data.vendas;
        $scope.valorTotal = data.valorTotal;
        if (data.paginacao && data.paginacao.qtdPaginas) {
          $scope.pageQuantity = Math.ceil(data.paginacao.qtdPaginas / 10);
        }
      }
    }).error(function (data) {
      $scope.LOADING = false;
      $scope.data = [];
    });
  };

  $scope.hasContent = function () {
    return $scope.data !== null && $scope.data.length > 0 && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return ($scope.data === null || $scope.data.length < 1) && $scope.LOADING === false;
  };

  $scope.downloadLayoytArquivoTXT = function () {
    $scope.LOADING = true;
    $http.get('/api-web/ec/venda/layoutArquivoVendas', {responseType: 'arraybuffer'})
      .success(function (data) {
        $scope.LOADING = false;
        downloadFile(data, "application/vnd.ms-excel", 'Layout_VRRH_TXT.xls');
      }).error(function (data) {
      $scope.LOADING = false;
    })
  };

  $scope.downloadTxtDasTransacacoes = function () {
    if ($scope.dateStartLabel == null || $scope.dateEndLabel == null) {
      return false;
    }
    var dateStartLabel, dateEndLabel;
    if ($scope.dateStartLabel != null) {
      dateStartLabel = $scope.dateStartLabel.replace(/\//g, '-');
    }
    if ($scope.dateEndLabel != null) {
      dateEndLabel = $scope.dateEndLabel.replace(/\//g, '-');
    }
    $scope.LOADING = true;
    $http.get('/api-web/ec/venda/txtTransacoesVendas/' +
      $scope.produto.id + '/' + dateStartLabel + '/' + dateEndLabel, {
      responseType: 'arraybuffer'
    }).success(function (data) {
      $scope.LOADING = false;
      downloadFile(data, "plain/text", 'TXT_Transacoes_Vendas.txt');
    }).error(function () {
      $scope.LOADING = false;
    })
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

  $scope.getTotal = function () {
    return $scope.valorTotal;
  };

  $scope.$on(constants.EVENTS.NAVIGATION_SET_VIEW_PRODUCT, function (event, data) {
    $scope.data = null;
    $scope.produto = data.product;
  });

  $scope.init = function () {
    $scope.LOADING = true;
    $http({
      method: 'GET',
      url: '/api-web/ec/cadastro/consultar-credenciamento',
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.produtos = data;
      var products = [];
      angular.forEach($scope.produtos, function (produto) {
        products.push({
          id: produto.id,
          label: produto.nome
        });
      });
      $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_PRODUCTS, {
        products: products
      });
    }).error(function () {
      $scope.LOADING = false;
      $scope.produtos = [];
    });
  };

  $scope.openPrintPage = function () {
    var salesSearchData = {};
    salesSearchData.productId = $scope.produto.id;
    salesSearchData.dateStartLabel = $scope.dateStartLabel;
    salesSearchData.dateEndLabel = $scope.dateEndLabel;
    $window.localStorage.setItem(constants.SESSION.ESTABLISHMENT_SALES_PRINT, JSON.stringify(salesSearchData));
    var url = '/portal/app/UI-EC/impressao/vendas-impressao.html';
    $window.open(url, '_blank');
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('SellsController', $scope);
  }

  $scope.init();

}]);

appEC.controller('VendasImpressaoController', ['$rootScope', '$scope', '$http', '$window', '$timeout', function ($rootScope, $scope, $http, $window, $timeout) {

  $scope.data = null;
  $scope.dateStartLabel = null;
  $scope.dateEndLabel = null;
  var salesSearchData = JSON.parse($window.localStorage.getItem(constants.SESSION.ESTABLISHMENT_SALES_PRINT));
  $scope.dateStartLabel = salesSearchData.dateStartLabel.replace(/\-/g, '/');
  $scope.dateEndLabel = salesSearchData.dateEndLabel.replace(/\-/g, '/');
  $scope.total = 0;

  $scope.doSearch = function () {

    $scope.LOADING = true;
    var dateStartLabel, dateEndLabel;
    if ($scope.dateStartLabel !== null) {
      dateStartLabel = $scope.dateStartLabel.replace(/\//g, '-');
    }
    if ($scope.dateEndLabel !== null) {
      dateEndLabel = $scope.dateEndLabel.replace(/\//g, '-');
    }
    $http({
      method: 'GET',
      url: '/api-web/ec/venda/detalhe/' + salesSearchData.productId + '/' + dateStartLabel + '/' + dateEndLabel,
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      if (constants.SETTINGS.DEBUG) {
        console.log(data);
      }
      if (data) {
        $scope.data = data.vendas;
        $scope.valorTotal = data.valorTotal;
      }
    }).error(function () {
      $scope.LOADING = false;
      $scope.data = [];
    });

  };

  $scope.hasContent = function () {
    return $scope.data !== null && $scope.data.length > 0;
  };

  $scope.getTotal = function () {
    return $scope.valorTotal;
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('VendasImpressaoController', $scope);
  }

  $timeout(function () {
    $window.print();
  }, 3000);

  $window.onbeforeunload = function () {
    $window.localStorage.removeItem(constants.SESSION.ESTABLISHMENT_SALES_PRINT);
  };

  $scope.doSearch();

}]);
