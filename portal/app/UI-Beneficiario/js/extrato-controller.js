appBeneficiario.controller('ExtractController', ['$scope', '$rootScope', '$http', '$timeout', '$window', 'shareDataService', function ($scope, $rootScope, $http, $timeout, $window, shareDataService) {
  $scope.LOADING = true;
  $scope.ERROR = null;
  $scope.cards = null;
  $scope.activeCard = null;
  $scope.finalCartao = "";
  $scope.page = null;
  $scope.periodo = 1;
  $scope.tabs = null;
  $scope.tabIterator = 0;
  $scope.requestDate = null;
  $scope.cardNumberStored = null;

  // paginacao
  if ($scope.urlQueryValue('pagina')) {
    $scope.page = parseInt($scope.urlQueryValue('pagina'));
  } else {
    $scope.page = 1;
  }
  $scope.pageLimit = constants.SETTINGS.MAX_PAGINATION;

  $scope.pageChangeRequest = function (pageNumber) {
    $scope.LOADING = true;
    $scope.page = pageNumber;
    $scope.consultarExtrato($scope.activeCard.numeroCartao);
  };

  $http.get('/api-web/beneficiario/cartao/listar')
    .success(function (response) {
      $scope.tabs = response.entidade;
      $scope.roles = response.roles;
      var shareData = shareDataService.getData(constants.SESSION.PRODUCT_CARD_SET);
      $scope.setActiveTab($scope.validarShareData(shareData));
      $scope.LOADING = false;
    }).error(function () {
      $scope.LOADING = false;
      $scope.ERROR = "Não foi possível consultar o extrato.";
      $scope.tabs = null;
    }
  );

  $scope.validarShareData = function (shareData) {
    var defaultTab = 0;
    if (shareData !== undefined && shareData !== null) {
      shareData = JSON.parse(shareData);
      var findTab = $scope.findActiveTab(shareData.activeProduct);
      if (findTab !== undefined) {
        var findCard = false;
        angular.forEach(findTab.cartoes, function (card) {
          if (card.numeroCartao === shareData.activeCard) {
            $scope.cardNumberStored = card.numeroCartao;
            findCard = true;
          }
        });
        return findCard ? findTab.key : defaultTab;
      }
    }
    return defaultTab;
  };

  $scope.findActiveTab = function (idProduct) {
    var tabActive = undefined;
    angular.forEach($scope.tabs, function (tabValue, tabKey) {
      if (tabValue.id === idProduct) {
        tabActive = tabValue;
        tabActive["key"] = tabKey;
      }
    });
    return tabActive;
  };

  $scope.selecionarCartao = function (numeroCartao) {
    var cartaoTemp = null;
    var produtoSelected = null;
    var produtos = $scope.tabs;
    var keepGoing = true;
    // iterar nos produtos.
    angular.forEach(produtos, function (produtoValue, produtoKey) {
      if (keepGoing) {
        // iterar nos cartoes.
        angular.forEach(produtoValue.cartoes, function (cartaoValue, cartaoKey) {
          if (keepGoing) {
            if (cartaoValue.numeroCartao == numeroCartao) {
              cartaoTemp = cartaoValue;
              produtoSelected = produtoKey;
              keepGoing = false;
            }
          }
        });
      }
    });
    $scope.tab = produtoSelected;
    $scope.finalCartao = cartaoTemp.finalCartao;
    $scope.numeroCartao = cartaoTemp.numeroCartao;
    $scope.consultarExtrato(cartaoTemp.numeroCartao);
    return false;
  };

  $scope.consultarExtrato = function (numeroCartao) {
    $scope.ERROR = null;
    $http({
      method: 'GET',
      url: '/api-web/beneficiario/cartao/extrato/' + numeroCartao + '/' + $scope.periodo,
      headers: 'text/plain; charset=UTF-8;',
      params: {page: $scope.page}
    }).success(function (data) {
      $scope.requestDate = new Date();
      $scope.activeCard.saldo = data.saldoDisponivel;
      $scope.activeCard.gastoMedio = parseFloat(data.gastoMedio);
      $scope.activeCard.proximoBeneficio = data.proximoBeneficio;
      $scope.activeCard.transacoes = data.itensExtrato;

      // paginacao
      $scope.page = data.paginaAtual;
      $scope.pageQuantity = data.qtdPaginas;

      $scope.LOADING = false;
    }).error(function () {
      $scope.ERROR = "Não foi possível consultar o extrato.";
      $scope.extrato = null;
      $scope.activeCard.transacoes = null;
      $scope.LOADING = false;
    });
    return false;
  };

  $scope.showNextTab = function () {
    if ($scope.tabIterator < $scope.tabs.length) {
      $scope.tabIterator++;
    }
  };

  $scope.showPreviousTab = function () {
    if ($scope.tabIterator > 0) {
      $scope.tabIterator--;
    }
  };

  $scope.comboPeriodo = [
    {value: 1, displayName: '30 dias'},
    {value: 3, displayName: '3 meses'},
    {value: 12, displayName: '1 ano'}
  ];

  $scope.changeRange = function (periodo) {
    $scope.LOADING = true;
    $scope.page = 1;
    $scope.periodo = periodo;
    $scope.consultarExtrato($scope.activeCard.numeroCartao);
  };

  $scope.hasContent = function () {
    return $scope.tabs !== null && $scope.tabs.length >= 1 && $scope.LOADING === false && $scope.ERROR === null;
  };

  $scope.hasNoContent = function () {
    return ($scope.tabs === null || $scope.tabs.length < 1) && $scope.LOADING === false && $scope.ERROR === null;
  };

  $scope.hasError = function () {
    return $scope.ERROR !== null;
  };

  $scope.hasTransactions = function () {
    return $scope.activeCard !== null && $scope.activeCard.transacoes !== null && $scope.activeCard.transacoes.length > 0
  };

  $scope.setActiveCard = function (cardNumber) {
    $scope.activeCard = null;
    $scope.LOADING = true;
    $scope.cardData = {};
    $scope.cardData.cardNumber = cardNumber;

    $http.get('/api-web/beneficiario/cartao/detalhe/' + cardNumber)
      .success(function (response) {
        $scope.activeCard = response;
        $scope.page = 1;
        shareDataService.addData(constants.SESSION.PRODUCT_CARD_SET, JSON.stringify({
          activeCard: $scope.activeCard.numeroCartao,
          activeProduct: $scope.activeTab.id
        }));
        $scope.consultarExtrato(cardNumber);
        $scope.LOADING = false;
      }).error(function () {
        $scope.LOADING = false;
        $scope.ERROR = "Não foi possível consultar detalhes cartoes";
      }
    );
  };

  $scope.print = function () {
    $window.print();
  };

  $scope.openPrintPage = function () {
    angular.forEach($scope.comboPeriodo, function (obj) {
      if ($scope.periodo === obj.value) {
        $scope.periodoId = $scope.periodo;
        $scope.periodoText = obj.displayName;
      }
    });
    $scope.cardData.period = $scope.periodoText;
    $scope.cardData.periodId = $scope.periodoId;
    $window.localStorage.setItem(constants.SESSION.BENEFICIARIO_EXTRACT_CARDNUMBER_PRINT, JSON.stringify($scope.cardData));
    var url = '/portal/app/UI-Beneficiario/impressao/extrato-impressao.html';
    $window.open(url, '_blank');
  };

  $scope.isTabActive = function (index) {
    return $scope.tabs[index].active;
  };

  $scope.cardClass = function (card) {
    var cardClass = '';
    if ($scope.activeCard && $scope.activeCard.numeroCartao === card.numeroCartao) {
      cardClass += 'active';
    }
    return cardClass;
  };

  $scope.setActiveTab = function (index) {
    $scope.activeTab = $scope.tabs[index];
  };

  $scope.$watch('activeTab', function () {
    if ($scope.activeTab) {
      for (var i = 0; i < $scope.tabs.length; i++) {
        $scope.tabs[i].active = $scope.tabs[i] === $scope.activeTab;
      }
      $scope.cards = $scope.activeTab.cartoes;

      if ($scope.cardNumberStored !== undefined && $scope.cardNumberStored !== null) {
        $scope.setActiveCard($scope.cardNumberStored);
        $scope.cardNumberStored = null;
      } else {
        $scope.setActiveCard($scope.cards[0].numeroCartao);
      }
    }
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ExtractController', $scope);
  }

}]);

appBeneficiario.controller('ExtratoImpressaoController', ['$scope', '$rootScope', '$http', '$timeout', '$window', 'shareDataService', function ($scope, $rootScope, $http, $timeout, $window, shareDataService) {
  $scope.activeCard = null;
  var cardData = JSON.parse($window.localStorage.getItem(constants.SESSION.BENEFICIARIO_EXTRACT_CARDNUMBER_PRINT));
  if (cardData) {
    $scope.cardNumber = cardData.cardNumber;
    $scope.periodId = cardData.periodId;
    $scope.periodText = cardData.period;
  }

  $scope.hasTransactions = function () {
    return $scope.activeCard !== null && $scope.activeCard.transacoes !== null && $scope.activeCard.transacoes.length > 0
  };

  $scope.setActiveCard = function (cardNumber) {
    $scope.activeCard = null;
    $scope.LOADING = true;
    $http.get('/api-web/beneficiario/cartao/detalhe/' + cardNumber)
      .success(function (response) {
        $scope.activeCard = response;
        $scope.page = 1;
        $scope.consultarExtrato(cardNumber);
        $scope.LOADING = false;
      }).error(function () {
        $scope.LOADING = false;
        $scope.ERROR = "Não foi possível consultar detalhes cartoes";
      }
    );
  };

  $scope.consultarExtrato = function (numeroCartao) {
    $scope.ERROR = null;
    $http({
      method: 'GET',
      url: '/api-web/beneficiario/cartao/extrato/' + numeroCartao + '/' + $scope.periodId,
      headers: 'text/plain; charset=UTF-8;'
    }).success(function (data) {
      $scope.requestDate = new Date();
      $scope.activeCard.saldo = data.saldoDisponivel;
      $scope.activeCard.gastoMedio = parseFloat(data.gastoMedio);
      $scope.activeCard.proximoBeneficio = data.proximoBeneficio;
      $scope.activeCard.transacoes = data.itensExtrato;
      $scope.activeCard.period = cardData.period;
      $scope.LOADING = false;
      if (constants.SETTINGS.DEBUG) {
        console.log('gasto medio: ');
        console.log(data.gastoMedio);
        console.log('$scope.activeCard.gastoMedio: ');
        console.log($scope.activeCard.gastoMedio);
      }
    }).error(function () {
      $scope.ERROR = "Não foi possível consultar o extrato.";
      $scope.extrato = null;
      $scope.activeCard.transacoes = null;
      $scope.LOADING = false;
    });
    return false;
  };

  if (cardData) {
    $scope.setActiveCard(cardData.cardNumber);
  }

  $timeout(function () {
    $window.print();
  }, 3000);

  $window.onbeforeunload = function () {
    $window.localStorage.removeItem(constants.SESSION.BENEFICIARIO_EXTRACT_CARDNUMBER_PRINT);
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ExtratoImpressaoController', $scope);
  }

}]);
