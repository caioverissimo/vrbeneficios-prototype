appEC.controller('NewCredentialController', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.currentStep = 1;

  // inicializa lista de produtos:
  $scope.products = $scope.getDynamicData('PRODUCTS');

  $scope.breadCrumbClass = function (index) {
    var breadCrumbClass = '';
    if (index <= $scope.currentStep) {
      breadCrumbClass += 'active';
    }
    return breadCrumbClass;
  };

}]);

/**
 *  Controle de estabeleciomentos para adiconar campos
 **/
appEC.controller('EstablishmentConfirmationController', ['$scope', function ($scope) {
  $scope.establishments = [{CNPJ: "", filiacao: ""}];
  $scope.addFields = function () {
    $scope.establishments.push({CNPJ: "", filiacao: ""});
  };
  $scope.removeFields = function (index) {
    $scope.establishments.splice(index, 1);
  };
}]);

appEC.controller('EstablishmentProfileController', ['$scope', '$window', '$timeout', function ($scope, $window, $timeout) {
  $scope.LOADING = true;

  $scope.data = null;

  $scope.placeImageUpload = null;

  $scope.currentPicture = null;

  $scope.products = [];

  $scope.hasContent = function () {
    return $scope.data !== null && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return $scope.data === null && $scope.LOADING === false || !$scope.hasActiveEstablishment();
  };

  $scope.isInProfile = function () {
    return $window.location.pathname.indexOf('estabelecimento.html') > -1;
  };

  $scope.getCurrentPicture = function () {
    return $scope.currentPicture;
  };

  $scope.$on('placeImageUploadEvent', function (event, data) {
    $scope.placeImageUpload = data;
  });

  $scope.$watch('placeImageUpload', function () {
    if ($scope.placeImageUpload) {
      // TODO: isso pode ajudar: http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
      console.log('implementar upload real de arquivo e na função de callback redefinir $scope.currentPicture');
      $timeout(function () {
        $scope.currentPicture = $scope.placeImageUpload.resized.dataURL;
        $scope.placeImageUpload = null;
      }, 1000);
    }
  });

  $scope.openImageUpload = function () {
    angular.element('#imageUploadInput').click();
  };

  $scope.saveProfile = function () {
    // TODO salvar
    console.log('TODO salvar');
  };

  $timeout(function () {
    $scope.LOADING = false;
    if ($scope.hasActiveEstablishment()) {
      // popula dados
      $scope.data = $scope.getActiveEstablishment().dadosDeNegocio;

      // popula lista de produtos para ser utilizado pelo controller de dados bancarios (como include)
      for (var i = 0; i < $scope.data.dadosBancarios.length; i++) {
        var product = $scope.data.dadosBancarios[i].produto;
        product.selected = true;
        product.bank = $scope.data.dadosBancarios[i].numeroBanco;
        product.agency = $scope.data.dadosBancarios[i].numeroAgencia;
        product.agencyDigit = $scope.data.dadosBancarios[i].digitoAgencia;
        product.bankAccount = $scope.data.dadosBancarios[i].numeroConta;
        product.bankAccountDigit = $scope.data.dadosBancarios[i].digitoConta;
        $scope.products.push(product);
      }
    }
  }, 3000);

}]);

appEC.controller('ContractPendingModalController', ['$scope', '$uibModal', '$uibModalInstance', '$http', 'activeEstablishment', 'pendingContracts', 'acceptedContracts', function ($scope, $uibModal, $uibModalInstance, $http, activeEstablishment, pendingContracts, acceptedContracts) {
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
      controller: 'ContractAcceptModalController',
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
        },
        acceptedContracts: function () {
          return acceptedContracts;
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

}]);

appEC.controller('ContractAcceptModalController', ['$rootScope', '$scope', '$uibModal', '$uibModalInstance', '$http', '$window', 'activeEstablishment', 'pendingContracts', 'acceptedContracts', 'contract', function ($rootScope, $scope, $uibModal, $uibModalInstance, $http, $window, activeEstablishment, pendingContracts, acceptedContracts, contract) {

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
      controller: 'ContractPendingModalController',
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

    // adiciona o contrato recem aceito para array de contratos aceitos
    var contractIndex = pendingContracts.indexOf(contract);
    acceptedContracts.push(pendingContracts.splice(contractIndex, 1)[0]);

    // só vai para proxima tela se todos os contratos forem aceitos...
    if (pendingContracts.length > 0) {
      $scope.return();
    } else {
      // abre modal de dados bancarios e qualificação
      $uibModal.open({
        templateUrl: '/portal/app/UI-EC/partials/modals/dados-bancarios-qualificacao-estabelecimento.html',
        controller: 'BankDataQualificationModalController',
        size: 'lg',
        keyboard: false,
        resolve: {
          activeEstablishment: function () {
            return activeEstablishment;
          },
          acceptedContracts: function () {
            return acceptedContracts;
          }
        }
      });
    }
  };

  $scope.$watch('currentPage', function (value) {
    $scope.renderPage(value);
  });

  // inicia plugin pdf js
  PDFJS.getDocument($scope.convertDataURIToBinary(contract.pdf)).then($scope.renderPdf);
}]);

appEC.controller('BankDataQualificationModalController', ['$rootScope', '$scope', '$uibModal', '$uibModalInstance', 'activeEstablishment', 'acceptedContracts', function ($rootScope, $scope, $uibModal, $uibModalInstance, activeEstablishment, acceptedContracts) {

  $scope.products = acceptedContracts;

  // inicializa array de produtos selecionados com base nos contratos aceitos
  for (var i = 0; i < $scope.products.length; i++) {
    $scope.products[i].selected = true;
  }

  $scope.finish = function () {
    $uibModalInstance.dismiss("finish");
    $rootScope.$broadcast(constants.EVENTS.ESTABLISHMENT_SELECTED, {activeEstablishment: activeEstablishment});
  };

  $scope.return = function () {
    $uibModalInstance.dismiss("return");
    $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/selecao-estabelecimentos.html',
      controller: 'EstablishmentModalController',
      backdrop: 'static',
      keyboard: false
    });
  };

}]);


appEC.controller('BankDataController', ['$rootScope', '$scope', function ($rootScope, $scope) {

  // funcionalidade de copia de dados bancarios entre produtos
  $scope.defaultBankAccount = null;

  $scope.evaluateDefaultBankAccount = function (values) {
    var hasNull = false;
    for (var i = 0; i < values.length && !hasNull; i++) {
      hasNull = values[i] === null || values[i] === undefined;
    }

    if (!hasNull) {
      $scope.defaultBankAccount = [];
      for (var j = 0; j < values.length; j++) {
        $scope.defaultBankAccount.push(values[j]);
      }
    }
  };

  $scope.showCopyBankDataCheckbox = function (product) {
    var selectedProducts = [];

    for (var i = 0; i < $scope.products.length; i++) {
      if ($scope.products[i].selected) {
        selectedProducts.push($scope.products[i]);
      }
    }

    return selectedProducts.indexOf(product) > 0;
  };

  // registra eventos nos produtos (controller pai deve ter recuperado a lista de produtos anteriormente)
  for (var i = 0; i < $scope.products.length; i++) {
    $scope.$watchGroup([
      'products[' + i + '].bank',
      'products[' + i + '].agency',
      'products[' + i + '].agencyDigit',
      'products[' + i + '].bankAccount',
      'products[' + i + '].bankAccountDigit'
    ], $scope.evaluateDefaultBankAccount);
  }

  $scope.copyBankData = function (index) {
    if ($scope.products[index].copyBankData) {
      $scope.products[index].bank = $scope.defaultBankAccount[0];
      $scope.products[index].agency = $scope.defaultBankAccount[1];
      $scope.products[index].agencyDigit = $scope.defaultBankAccount[2];
      $scope.products[index].bankAccount = $scope.defaultBankAccount[3];
      $scope.products[index].bankAccountDigit = $scope.defaultBankAccount[4];
    } else {
      $scope.products[index].bank = $scope.products[index].agency = $scope.products[index].agencyDigit = $scope.products[index].bankAccount = $scope.products[index].bankAccountDigit = null;
    }
  };

}]);

appEC.filter('cardMask', function () {
  return function (card) {
    var result = '!cardMask: ' + card;
    card = card.toString();
    if (card) {
      var prefix = card.substring(0, 6);
      var middle = card.substring(6, card.length - 4);
      var suffix = card.substring(card.length - 4, card.length);

      result = prefix;
      for (var i = 0; i < middle.length; i++) {
        result += 'X';
      }
      result += suffix;
    }

    return result;
  }
});

appEC.controller('RefundModalController', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
  $scope.isInModal = true;
  $scope.antecipacaoautomatica = false;

  $scope.data = {
    refundAnticipation: {
      sells: 'R$ 300,00',
      discounts: '- R$ 50,00',
      tax: '- R$ 15,00',
      total: 'R$ 235,00'
    }
  };

  $scope.cancel = function () {
    $uibModalInstance.close({confirmation: false, anticipation: false});
  };

  $scope.confirm = function () {
    $uibModalInstance.close({confirmation: true, anticipation: $scope.antecipacaoautomatica});
  };

}]);

appEC.controller('RequireSinalController', ['$scope', '$uibModal', function ($scope, $uibModal) {
  $scope.feedbacks = [{
    type: 'danger',
    msg: 'Mensagem de erro de exemplo'
  }];

  $scope.sendRequest = function () {
    $uibModal.open({
      templateUrl: '/portal/app/UI-EC/partials/modals/sinal-sucesso.html',
      controller: 'ModalCtrl',
      backdrop: 'static',
      size: 'lg',
      keyboard: false
    });
  };

}]);

appEC.controller('IncomeController', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.LOADING = true;

  $scope.data = null;

  $scope.hasContent = function () {
    return $scope.data !== null && $scope.data.length > 0 && $scope.LOADING === false;
  };

  $scope.hasNoContent = function () {
    return ($scope.data === null || $scope.data.length < 1) && $scope.LOADING === false || !$scope.hasActiveEstablishment();
  };

  // Popular lista de links para abrir arquivos de informe de rendimentos
  $timeout(function () {
    $scope.LOADING = false;

    if ($scope.hasActiveEstablishment()) {
      $scope.data = [{
        fileName: 'IR_2015_1111111111.pdf',
        fileUri: '/path/to/IR_2015_1111111111.pdf'
      }, {
        fileName: 'IR_2015_1111111112.pdf',
        fileUri: '/path/to/IR_2015_1111111112.pdf'
      }, {
        fileName: 'IR_2015_1111111113.pdf',
        fileUri: '/path/to/IR_2015_1111111113.pdf'
      }];
    }

  }, 3000);

}]);

