appComum.controller('IncomeController', ['$scope', '$rootScope', '$http', '$window', function ($scope, $rootScope, $http, $window) {
  $scope.LOADING = false;
  $scope.data = null;

  $scope.hasContent = function () {
    return $scope.data !== null && $scope.data.length > 0 && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return ($scope.data === null || $scope.data.length < 1) && $scope.LOADING === false || !$scope.hasActiveEstablishment();
  };

  $scope.listarInformesRendimento = function () {
    if ($scope.hasActiveEstablishment()) {
      $scope.LOADING = true;
      var cnpjEC = $rootScope.getActiveEstablishment().cnpj;
      $http({
        url: '/api-web/comum/rendimentos',
        method: 'GET',
        headers: {'Content-Type': 'text/plain'},
        params: {cnpj: cnpjEC}
      }).success(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.data = data;
      }).error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.informesRendimento = {};
      });
      return false;
    }
  };

  $scope.downloadInformeRendimentos = function (filename) {
    $scope.LOADING = true;
    var cnpjEC = $rootScope.getActiveEstablishment().cnpj;
    $http({
      url: '/api-web/comum/rendimentos/download',
      method: 'GET',
      headers: {'Content-Type': 'text/plain'},
      params: {file: filename, cnpj: cnpjEC},
      responseType: 'arraybuffer'
    }).success(function (data, status, headers, config) {
      $scope.LOADING = false;
      var contentType = "application/pdf";
      downloadFile(data, contentType, "InformeRendimentos.pdf");
    }).error(function (data, status, headers, config) {
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
}]);

appComum.run(['$cookieStore', function ($cookieStore) {
  $cookieStore.put('accessToken', 'fake');
}]);

appComum.controller('NewContractController', ['$scope', '$uibModal', function ($scope, $uibModal) {

  $scope.partner = {
    imgUri: '/portal/img/avatar-dft.jpg',
    name: 'Nome do site parceiro'
  };

  $scope.qtdFuncionarios = 0;

  $scope.currentStep = 1;
  $scope.breadCrumbClass = function (index) {
    var breadCrumbClass = '';
    if (index <= $scope.currentStep) {
      breadCrumbClass += 'active';
    }
    return breadCrumbClass;
  };

  $scope.isSecondStepDisabled = function () {
    // TODO implementar regras de validação para habilitar segundo botão
    console.dir($scope.secondStep);
    return false;
  };

  $scope.validateSecondStep = function () {
    if ($scope.CNPJ === '00000000000000') {
      var pendingModal = $uibModal.open({
        templateUrl: '/portal/app/UI-Comum/partials/modals/pedidos-anteriores.html',
        controller: 'PendingNewContractModalController',
        size: 'lg'
      });

      pendingModal.result.then(function (result) {
        console.log('Resultado da modal:');
        console.dir(result);
      });

    } else {
      $scope.currentStep++;
    }
  };

  $scope.validateThirdStep = function () {

  };

  $scope.showContactSelectionOptions = function () {
    return $scope.qtdFuncionarios <= 300;
  };

  $scope.showEcommerceOption = function () {
    return $scope.qtdFuncionarios <= 30 && !$scope.produtostransporte;
  };

  $scope.showContractOption = function () {
    return $scope.qtdFuncionarios > 30 && $scope.qtdFuncionarios <= 100 && !$scope.produtostransporte;
  };

  $scope.isContactTypeSelected = function (type) {
    return $scope.contactType === type;
  };

}]);

appComum.controller('PendingNewContractModalController', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
  $scope.cancel = function () {
    $uibModalInstance.dismiss('close');
  };

  $scope.contratos = [{
    produto: 'VR Refeição',
    qteFuncionarios: 30,
    valor: 'R$ 1000,00',
    boletoUri: 'http://www.google.com'
  }];

  $scope.produtosDisponiveis = [{
    id: 'vralimentacao',
    nome: 'VR Alimentação',
    ativo: false,
    simulacao: true
  }, {
    id: 'vrauto',
    nome: 'VR Auto',
    ativo: false,
    simulacao: true
  }, {
    id: 'vrtransporte',
    nome: 'VR Transporte',
    ativo: false,
    simulacao: false
  }];

  $scope.continue = function () {
    $uibModalInstance.close($scope.produtosDisponiveis);
  };

  $scope.canContinue = function () {
    var activeProducts = [];

    // adiciona produtos ativos p/ validacao
    for (var i = 0; i < $scope.produtosDisponiveis.length; i++) {
      if ($scope.produtosDisponiveis[i].ativo) {
        activeProducts.push($scope.produtosDisponiveis[i]);
      }
    }

    // valida produtos ativos
    var canContinue = activeProducts.length > 0;
    for (var j = 0; j < activeProducts.length; j++) {
      if (activeProducts[j].simulacao) {
        if (activeProducts[j].qteCartoes && activeProducts[j].qteCartoes <= 0) {
          canContinue = false;
        }
        if (activeProducts[j].valor === null || activeProducts[j].valor === undefined) {
          canContinue = false;
        } else if (activeProducts[j].valor === 'R$0,00') {
          canContinue = false;
        }
      }
    }

    return canContinue;
  }

}]);

appComum.controller('solicitarContatoController', ['$rootScope', '$scope', '$http', '$uibModal', '$window', function ($rootScope, $scope, $http, $uibModal, $window) {
  $scope.formSolicitarContato = {};
  $scope.recaptchaKey = null;

  $scope.openConfirmationModal = function () {
    var modal = $uibModal.open({
      templateUrl: '/portal/app/UI-Comum/partials/modals/confirmacao-solicitar-contato.html',
      controller: 'ModalSolicitarContatoCtrl'
    });

    modal.result.then(function (result) {
      if (result === 'confirm') {
        $scope.sendRequest();
      }
    });

  };

  $scope.init = function () {

    if ($scope.recaptchaKey === null) {
      $http({
        method: 'GET',
        url: '/api-web/comum/recaptcha/chave',
        headers: {'Content-Type': 'text/plain'}
      }).success(function (data) {
        $scope.recaptchaKey = data.message;
      }).error(function (data, status, headers, config, statusText) {
        console.log("init Error captcha error");
      });
    }

    return $scope.recaptchaKey;

  };

  $scope.recapchaSize = function () {
    var size = '';
    if ($window.matchMedia(constants.MEDIA_QUERIES.MOBILE_SCREEN).matches) {
      size = 'compact';
    } else {
      size = 'normal';
    }
    return size;
  };


  $scope.sendRequest = function () {

    $http({
      method: 'POST',
      url: '/api-web/comum/cadastro/contato',
      data: $scope.formSolicitarContato,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.formSolicitarContato = {};
        $scope.ctrl.contato.$setPristine();
        $scope.ctrl.contato.$setUntouched();
        $scope.feedbacks = [{
          msg: "Sua solicitação foi enviada com sucesso!"
        }];
      })
      .error(function (data, status, headers, config) {
        $scope.formSolicitarContato = {};
        $scope.ctrl.contato.$setPristine();
        $scope.ctrl.contato.$setUntouched();
        $scope.feedbacks = [{
          type: 'danger', msg: "Não foi possível executar operação. Tente novamente mais tarde."
        }];
      });

  };

  if (!$rootScope.isInConfirmation()) {
    $scope.init();
  }

}]);

appComum.controller('ModalSolicitarContatoCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

  $scope.onstate = "awaiting";
  $scope.LOADING = false;

  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
  };

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  $scope.changeState = function (state) {
    $scope.onstate = state;
  };
}]);

appComum.controller('CabecalhoController', ['$rootScope', '$scope', '$window', '$uibModal', '$document', '$timeout', function ($rootScope, $scope, $window, $uibModal, $document, $timeout) {

  // comportamento especial para header da home
  $scope.homeLinkPrefix = '';
  if ($window.location.pathname.length > 1) {
    $scope.homeLinkPrefix += '/';
  } else {

    $scope.scrollOnTop = true;
    $scope.headerBackgroundClass = 'hidden';
    $scope.isNavbarClosed = true;

    var checkHeaderBackgroundClass = function () {
      if ($scope.headerBackgroundClass === 'hidden') {
        $scope.headerBackgroundClass = 'fade-in header-transparent-background';
      }

      var scrollOnTop = $document.scrollTop() === 0;
      if (!scrollOnTop && $scope.headerBackgroundClass.indexOf('header-transparent-background') > -1) {
        $scope.headerBackgroundClass = 'header-solid-background transition-500ms';
      }

      if (scrollOnTop && $scope.headerBackgroundClass.indexOf('header-solid-background') > -1) {
        $scope.headerBackgroundClass = 'header-transparent-background transition-500ms';
      }

      if (scrollOnTop && !$scope.isNavbarClosed) {
        $scope.headerBackgroundClass = 'header-solid-background transition-500ms';
      }
      
      $timeout(checkHeaderBackgroundClass, 500);
    };
    checkHeaderBackgroundClass();

    if ($window.location.hash.length > 1) {
      var hash = '#' + $window.location.hash.substring(2);
      var element = angular.element(hash);
      $document.scrollToElement(element);
    }
  }

  // comportamento comum

  $scope.setNavbarState = function() {
    $scope.isNavbarClosed = !$scope.isNavbarClosed;
  };

  $scope.logout = function () {
    $window.location = "/";
  };

  $scope.openEstablishmentModal = function () {
    //Abrir modal
    $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/selecao-estabelecimentos.html',
      controller: 'EstablishmentModalController',
      backdrop: 'static',
      keyboard: false
    });
  };

  $scope.getActiveEstablishmentName = function () {
    var activeEstablishmentName = '';
    if ($scope.hasActiveEstablishment()) {
      activeEstablishmentName = $scope.getActiveEstablishment().nome;
    }
    return activeEstablishmentName;
  };

  $scope.getActiveEstablishmentCNPJ = function () {
    var activeEstablishmentCNPJ = '';
    if ($scope.hasActiveEstablishment()) {
      activeEstablishmentCNPJ = $scope.getActiveEstablishment().cnpj;
    }
    return activeEstablishmentCNPJ;
  };

  $scope.setView = function (view) {
    $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_VIEW, {view: view});
  };

  // $scope.notifications = [{
  //   unread: true,
  //   text: 'Seu Saldo está próximo a R$400,00',
  //   time: '2 horas atrás'
  // }, {
  //   unread: true,
  //   text: 'Novo Saldo R$ 550,00',
  //   time: '2 horas atrás'
  // }, {
  //   unread: false,
  //   text: 'Você excedeu sua meta em 10%',
  //   time: '2 horas atrás'
  // }];

  $scope.notifications = [];

  $scope.user = {
    imgUri: '/portal/img/avatar-dft.jpg',
    name: 'Gustavo Ziller'
  };

  $scope.isContextPath = function (path) {
    return $window.location.pathname.indexOf(path) > -1;
  };

  $scope.menuOn = $scope.profileOn = $scope.menu1On = $scope.menu2On = $scope.menu3On = false;
  $scope.showMenu = function () {
    $scope.menuOn = $scope.menuOn == false;
    if ($scope.menuOn)
      $scope.menuContent = {
        'transform': 'translate(-100%, 0)',
        '-webkit-transform': 'translate(-100%, 0)',
        '-moz-transform': 'translate(-100%, 0)',
        '-o-transform:': 'translate(-100%, 0)'
      };
    else
      $scope.menuContent = '';
  };
  $scope.showProfile = function () {
    $scope.profileOn = $scope.profileOn == false;
    if ($scope.profileOn)
      $scope._sprofile = {'display': 'block'};
    else
      $scope._sprofile = '';
  };
  $scope.showMenu1 = function () {
    $scope.menu1On = $scope.menu1On == false;
    if ($scope.menu1On)
      $scope._menu1 = {'display': 'block'};
    else
      $scope._menu1 = '';
  };
  $scope.showMenu2 = function () {
    $scope.menu2On = $scope.menu2On == false;
    if ($scope.menu2On)
      $scope._menu2 = {'display': 'block'};
    else
      $scope._menu2 = '';
  };
  $scope.showMenu3 = function () {
    $scope.menu3On = $scope.menu3On == false;
    if ($scope.menu3On)
      $scope._menu3 = {'display': 'block'};
    else
      $scope._menu3 = '';
  };
}]);

appComum.controller('FooterController', ['$scope', '$window', function ($scope, $window) {
  $scope.homeLinkPrefix = '';
  if ($window.location.pathname.length > 1) {
    $scope.homeLinkPrefix += '/';
  }
}]);


appComum.controller('ExemploTutorialController', ['$scope', function ($scope) {
  $scope.stepContent = [{
    title: 'Título 1',
    items: ['Item 1.1', 'Item 1.2', 'Item 1.3']
  }, {
    title: 'Título 2',
    items: ['Item 2']
  }, {
    title: 'Título 3'
  }];

  $scope.iniciarTutorial = function () {
    $scope.currentStep = 1;
  };

  $scope.markElement = function (selector) {
    var elements = angular.element('.tour-element-active');
    for (var i = 0; i < elements.length; i++) {
      angular.element(elements[i]).removeClass('tour-element-active');
    }
    angular.element(selector).addClass('tour-element-active');
  };

}]);



