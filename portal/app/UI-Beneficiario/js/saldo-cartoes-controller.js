/**
 * Area de dashboard - Meus cartões
 **/
appBeneficiario.controller('saldoCartoesController', ['$rootScope', '$scope', '$timeout', '$uibModal', '$http', 'shareDataService', function ($rootScope, $scope, $timeout, $uibModal, $http, shareDataService) {
  $scope.LOADING = true;

  $scope.cards = null;
  $scope.activeCard = null;
  $scope.tabs = null;
  $scope.tabIterator = 0;
  $scope.cardNumberStored = null;

  $scope.isTabsOversized = function () {
    var tabsList = document.querySelectorAll('.tabs-wrapper .tab');
    var updatedTabsListWidth = function (tabs) {
      var width = 0;
      for (var i = 0; i < tabs.length; i++) {
        width += tabs[i].offsetWidth;
      }
      return width;
    };
    if (!$scope.wrapperTabsWidth) {
      $scope.wrapperTabsWidth = document.querySelector('.tabs-wrapper').offsetWidth;
    }
    if (!$scope.tabsListWidth) {
      $scope.tabsListWidth = updatedTabsListWidth(tabsList);
    }
    return $scope.wrapperTabsWidth < $scope.tabsListWidth;
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

  $scope.isTabActive = function (index) {
    return $scope.tabs[index].active;
  };

  $scope.hasContent = function () {
    return ( $scope.activeCard !== null || ($scope.cards !== null && $scope.cards.length > 0)) && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return ($scope.cards === null || $scope.cards.length < 1) && $scope.LOADING === false;
  };

  $scope.setActiveCard = function (cardNumber) {
    $scope.activeCard = null;
    $scope.LOADING = true;
    $http.get('/api-web/beneficiario/cartao/detalhe/' + cardNumber)
      .success(function (response) {
        $scope.activeCard = response;
        shareDataService.addData(constants.SESSION.PRODUCT_CARD_SET, JSON.stringify({
          activeCard: $scope.activeCard.numeroCartao,
          activeProduct: $scope.activeTab.id
        }));
        $scope.LOADING = false;
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.cards = null;
      });
  };

  $scope.$watch('activeCard', function () {
    $rootScope.$broadcast(constants.EVENTS.CARD_SELECTED, {activeCard: $scope.activeCard});
  });

  $scope.cardClass = function (card) {
    var cardClass = '';
    if ($scope.activeCard !== null && $scope.activeCard.numeroCartao === card.numeroCartao) {
      cardClass += 'active';
    }
    return cardClass;
  };

  $scope.blockCardModal = function () {
    var modalInstance = $uibModal.open({
      templateUrl: '/portal/app/UI-Beneficiario/partials/modals/bloqueio-cartao.html',
      controller: 'bloquearCartaoController',
      size: 'lg',
      resolve: {
        activeCard: function () {
          return $scope.activeCard;
        }
      }
    });

    modalInstance.result.then(function (result) {
      if (result === 'blocked') {
        $scope.initView();
      }
    });
  };

  $scope.changeCardPasswordModal = function () {
    $uibModal.open({
      templateUrl: '/portal/app/UI-Beneficiario/partials/modals/senha-cartao.html',
      controller: 'alterarSenhaController',
      size: 'lg',
      resolve: {
        activeCard: function () {
          return $scope.activeCard;
        }
      }
    });
  };

  $scope.validarShareData = function (shareData) {
    var defaultTab = 0;
    if (shareData !== undefined && shareData !== null) {
      shareData = JSON.parse(shareData);
      var findTab = $scope.findActiveTab(shareData.activeProduct);
      if (findTab !== undefined) {
        var findCard = false;
        angular.forEach(findTab.cartoes, function (cardValue, cardKey) {
          if (cardValue.numeroCartao === shareData.activeCard) {
            $scope.cardNumberStored = cardValue.numeroCartao;
            findCard = true;
          }
        });
        return findCard ? findTab.key : defaultTab;
      }
    }
    return defaultTab;
  };

  $scope.initView = function () {
    $http.get('/api-web/beneficiario/cartao/listar')
      .success(function (response) {
        $scope.tabs = response.entidade;
        $scope.roles = response.roles;
        var shareData = shareDataService.getData(constants.SESSION.PRODUCT_CARD_SET);
        $scope.setActiveTab($scope.validarShareData(shareData));
        $scope.LOADING = false;
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.cards = null;
      });
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('saldoCartoesController', $scope);
  }

  $scope.initView();

}]);

