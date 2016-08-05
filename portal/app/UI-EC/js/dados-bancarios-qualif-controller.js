appEC.controller('DadosBancariosQualificacaoFormController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
  $scope.feedbacks = null;

  constants.DADOS_BANCARIO_QUALIF_MESSAGES = {
    DEFAULT_ERROR_MESSAGE: 'Não possível realizar a operação. Tente novamente mais tarde.'
  };

  $scope.converteToDadosBancario = function (products) {
    var dadosBancarios = [];

    for (var i = 0; i < products.length; i++) {
      var o = {};
      o.numeroBanco = products[i].bank;
      o.numeroAgencia = products[i].agency;
      o.digitoAgencia = products[i].agencyDigit;
      o.numeroConta = products[i].bankAccount;
      o.digitoConta = products[i].bankAccountDigit;
      o.produto = {};
      o.produto.id = products[i].id;
      dadosBancarios.push(o);
    }
    return dadosBancarios;
  };

  $scope.enviarFormulario = function (callback) {

    for (var i = 0; i < $scope.products.length; i++) {
      $scope.products[i].error = null;
    }

    $scope.formDadosBancariosQualif.dadosBancarios = $scope.converteToDadosBancario($scope.products);
    $http({
      method: 'POST',
      url: '/api-web/ec/contrato/gravar-dados-banc-qualific',
      data: $scope.formDadosBancariosQualif,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        if (!data.validado) {
          for (key in data.validacoes) {
            for (var i = 0; i < $scope.products.length; i++) {
              if ($scope.products[i].id == key) {
                $scope.products[i].error = data.validacoes[key];
              }
            }
          }
        } else {
          if (callback) {
            callback();
          } else {
            if ($scope.formDadosBancariosQualif.qualificacao) {
              $scope.formDadosBancariosQualif.qualificacao.telefoneDelivery = $scope.formDadosBancariosQualif.qualificacao.dddDelivery + $scope.formDadosBancariosQualif.qualificacao.telefoneDelivery;
            }
            $scope.feedbacks = [{
              type: 'success', msg: "Dados gravados com sucesso"
            }];
          }
        }
      })
      .error(function (data, status, headers, config) {
        if (data) {
          $scope.feedbacks = [{
            type: 'danger', msg: data.message
          }];
        } else {
          $scope.feedbacks = [{
            type: 'danger', msg: constants.DADOS_BANCARIO_QUALIF_MESSAGES.DEFAULT_ERROR_MESSAGE
          }];
        }
      });
  };

  $rootScope.$on(constants.EVENTS.SEND_FORM_BANK_DATA_AND_QUALIF, function (event, form, callback) {
    $scope.formDadosBancariosQualif = form;
    if ($scope.formDadosBancariosQualif.qualificacao !== undefined) {
      if ($scope.formDadosBancariosQualif.qualificacao.possuiDelivery) {
        $scope.formDadosBancariosQualif.qualificacao.dddDelivery = $scope.formDadosBancariosQualif.qualificacao.telefoneDelivery.substring(0, 2);
        $scope.formDadosBancariosQualif.qualificacao.telefoneDelivery = $scope.formDadosBancariosQualif.qualificacao.telefoneDelivery.substring(2);
      }
    }
    $scope.enviarFormulario(callback);
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('DadosBancariosQualificacaoFormController', $scope);
  }

}]);

appEC.controller('DadosBancariosQualificacaoModalController', ['$rootScope', '$scope', '$http', '$uibModal', '$uibModalInstance', 'activeEstablishment', 'validacaoDadosBancoQualif', '$window', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, activeEstablishment, validacaoDadosBancoQualif, $window) {
  $scope.products = validacaoDadosBancoQualif.produtosDadosBancarios;

  $scope.finish = function () {
    $rootScope.$broadcast(constants.EVENTS.REQUEST_FORM_BANK_DATA_AND_QUALIF, function () {
      $uibModalInstance.dismiss("finish");
      $scope.formDadosBancariosQualif = {};
      $rootScope.$broadcast(constants.EVENTS.SHOW_VIDEO, {pageName: $window.location.pathname});
    });
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

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('DadosBancariosQualificacaoModalController', $scope);
  }

}]);


appEC.controller('DadosBancariosQualifCallController', ['$rootScope', '$scope', '$uibModal', '$http', '$window', function ($rootScope, $scope, $uibModal, $http, $window) {
  $scope.validacaoDadosBancoQualif = null;

  //Abrir modal contratos pendentes
  $scope.consultarValidacoesPendentes = function () {
    var hasActiveEstablishment = $rootScope.hasActiveEstablishment();
    if (hasActiveEstablishment) {
      $http({
        method: 'GET',
        url: '/api-web/ec/contrato/consultar-validacao-dados-banc-qualific',
        headers: {
          'Content-Type': 'text/plain'
        }
      }).success(function (data, status, headers, config) {
        $scope.validacaoDadosBancoQualif = data;


        if (!$scope.validacaoDadosBancoQualif.validado) {
          $uibModal.open({
            templateUrl: '/portal/app/UI-EC/partials/modals/dados-bancarios-qualificacao-estabelecimento.html',
            controller: 'DadosBancariosQualificacaoModalController',
            size: 'lg',
            keyboard: false,
            resolve: {
              activeEstablishment: function () {
                return $scope.getActiveEstablishment();
              },
              validacaoDadosBancoQualif: function () {
                return $scope.validacaoDadosBancoQualif;
              }
            }
          });
        } else {
          $rootScope.$broadcast(constants.EVENTS.SHOW_VIDEO, {pageName: $window.location.pathname});
        }
      }).error(function (data, status, headers, config) {
        $scope.pendingContracts = {};
        if (data) {
          console.log("Erro : " + data.message);
        } else {
          console.log("Erro interno");
        }
      });
    }
    return false;

  };

  $rootScope.$on(constants.EVENTS.BANK_AND_QUALIF_DATA_CHECK, function (event) {
    $scope.consultarValidacoesPendentes();
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('DadosBancariosQualifCallController', $scope);
  }

}]);

appEC.controller('DadosBancariosController', ['$rootScope', '$scope', function ($rootScope, $scope) {

  // funcionalidade de copia de dados bancarios entre produtos
  $scope.defaultBankAccount = null;
  $scope.fromDadosEstabelecimentos = false;

  $scope.carregarProdutos = function () {
    $scope.fromDadosEstabelecimentos = true;
    var dadosBancarios = $scope.dadosEC.dadosBancarios;
    for (var i = 0; i < dadosBancarios.length; i++) {
      $scope.products[i] = {};
      $scope.products[i].id = dadosBancarios[i].produto.id;
      $scope.products[i].nome = dadosBancarios[i].produto.nome;
      $scope.products[i].produtoRefeicao = dadosBancarios[i].produto.produtoRefeicao;
      $scope.products[i].produtoAlimentacao = dadosBancarios[i].produto.produtoAlimentacao;
      $scope.products[i].bank = dadosBancarios[i].numeroBanco;
      $scope.products[i].agency = dadosBancarios[i].numeroAgencia;
      $scope.products[i].agencyDigit = dadosBancarios[i].digitoAgencia;
      $scope.products[i].bankAccount = dadosBancarios[i].numeroConta;
      $scope.products[i].bankAccountDigit = dadosBancarios[i].digitoConta;
      $scope.products[i].selected = true;

    }

    $scope.configurarEventoDadosBancarios();

  };

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

  $scope.configurarEventoDadosBancarios = function () {
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
  };

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

  $scope.configurarEventoDadosBancarios();

  $scope.getDadoBancarioDoProduto = function (idProduto, data) {
    if (data.dadosEC === undefined || data.dadosEC === null
      || data.dadosEC.dadosBancarios === undefined || data.dadosEC.dadosBancarios === null) {
      return null;
    }
    for (var i = 0; i < data.dadosEC.dadosBancarios.length; i++) {
      if (data.dadosEC.dadosBancarios[i].produto.id == idProduto) {
        return data.dadosEC.dadosBancarios[i];
      }
    }
    return null;
  };

  $rootScope.$on(constants.EVENTS.ACCREDITATION_DATA_BANK_LOADED, function (event, data) {
    $scope.products.length = 0;
    if (data.produtos) {
      for (var i = 0; i < data.produtos.length; i++) {
        $scope.products[i] = {};
        $scope.products[i].id = data.produtos[i].id;
        $scope.products[i].nome = data.produtos[i].nome;
        $scope.products[i].produtoRefeicao = data.produtos[i].produtoRefeicao;
        $scope.products[i].produtoAlimentacao = data.produtos[i].produtoAlimentacao;
        $scope.products[i].selected = true;
        var dadoBancario = $scope.getDadoBancarioDoProduto(data.produtos[i].id, data);
        if (dadoBancario != null) {
          $scope.products[i].bank = dadoBancario.numeroBanco;
          $scope.products[i].agency = dadoBancario.numeroAgencia;
          $scope.products[i].agencyDigit = dadoBancario.digitoAgencia;
          $scope.products[i].bankAccount = dadoBancario.numeroConta;
          $scope.products[i].bankAccountDigit = dadoBancario.digitoConta;
        }
      }
      $scope.configurarEventoDadosBancarios();
    }
    $rootScope.$broadcast(constants.EVENTS.ACCREDITATION_DATA_QUALIFIC_LOADED, {dadosEC: data.dadosEC});
  });

  $rootScope.$on(constants.EVENTS.ESTABLISHMENT_DATA_LOADED, function (event, dadosEC) {
    if (dadosEC) {
      $scope.dadosEC = dadosEC;
      $scope.carregarProdutos();
    }
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('DadosBancariosController', $scope);
  }

}]);

appEC.controller('DadosQualificacaoController', ['$rootScope', '$scope', function ($rootScope, $scope) {
  $scope.formDadosBancariosQualif = {};

  $scope.verificarTipoProdutos = function () {
    $scope.hasProdutoRefeicao = false;
    $scope.hasProdutoAlimentacao = false;
    // inicializa array de produtos selecionados com base nos contratos aceitos
    for (var i = 0; i < $scope.products.length; i++) {
      $scope.products[i].selected = true;
      if ($scope.products[i].produtoRefeicao) {
        $scope.hasProdutoRefeicao = true;
      }
      if ($scope.products[i].produtoAlimentacao) {
        $scope.hasProdutoAlimentacao = true;
      }

    }
  };

  $scope.verificarTipoProdutos();

  $scope.init = function (dadosEC) {
    $scope.formDadosBancariosQualif = {};
    if (dadosEC) {
      if (dadosEC.dadosQualificacao !== "NAO_INFORM") {
        $scope.formDadosBancariosQualif.qualificacao = dadosEC.dadosQualificacao;
        $scope.formDadosBancariosQualif.tipoEstabelecimento = $scope.formDadosBancariosQualif.qualificacao.categoria + "|" + $scope.formDadosBancariosQualif.qualificacao.subcategoria;
        if ($scope.formDadosBancariosQualif.qualificacao.possuiDelivery) {
          $scope.formDadosBancariosQualif.qualificacao.telefoneDelivery = dadosEC.dadosQualificacao.dddDelivery + dadosEC.dadosQualificacao.telefoneDelivery;
        }
      }
    }
    $scope.verificarTipoProdutos();
  };

  $rootScope.$on(constants.EVENTS.REQUEST_FORM_BANK_DATA_AND_QUALIF, function (event, callback) {
    $rootScope.$broadcast(constants.EVENTS.SEND_FORM_BANK_DATA_AND_QUALIF, $scope.formDadosBancariosQualif, callback);
  });

  $rootScope.$on(constants.EVENTS.ACCREDITATION_DATA_QUALIFIC_LOADED, function (event, data) {
    $scope.init(data.dadosEC);
    $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif = $scope.formDadosBancariosQualif;
  });

  $rootScope.$on(constants.EVENTS.ESTABLISHMENT_DATA_LOADED, function (event, dadosEC) {
    $scope.init(dadosEC);
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('DadosQualificacaoController', $scope);
  }

}]);
