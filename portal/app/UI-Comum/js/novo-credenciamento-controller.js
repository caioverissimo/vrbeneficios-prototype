appComum.controller('NovoCredenciamentoController', ['$rootScope', '$scope', '$http', '$uibModal', '$timeout', '$window', function ($rootScope, $scope, $http, $uibModal, $timeout, $window) {
  $scope.currentStep = 1;
  $scope.formNovoCred = {};
  $scope.formValidarCred = {};
  $scope.feedbacks = [];
  $scope.municipios = [{}];
  $scope.products = [];
  $scope.currentPage = 1;
  $scope.totalPages = -1;
  $scope.pdf = null;
  $scope.filiacoes = [];
  $scope.recaptchaKey = null;

  constants.CREDENCIAMENTO_MESSAGES = {
    DEFAULT_ERROR_MESSAGE: 'Não possível realizar a operação. Tente novamente mais tarde.'
  };

  constants.CREDENCIAMENTO_EVENTS = {
    LOAD_PDF: 'credenciamento.events.loadpdf',
    SHOW_SUCCESS_MSG: 'credenciamento.events.showsuccessmsg',
    RESET_FORM: 'credenciamento.events.resetform'
  };

  // inicializa lista de produtos:
  $scope.productsAvailable = $scope.getDynamicData('PRODUCTS').filter(function (o) {
    return o.exibirRede;
  });

  $scope.breadCrumbClass = function (index) {
    var breadCrumbClass = '';
    if (index <= $scope.currentStep) {
      breadCrumbClass += 'active';
    }
    return breadCrumbClass;
  };

  $scope.getProdutosSelecionados = function (full) {
    var produtos = [];
    for (var i = 0; i < $scope.productsAvailable.length; i++) {
      if ($scope.productsAvailable[i].selected) {
        if (full) {
          produtos.push({
            'id': $scope.productsAvailable[i].id,
            'nome': $scope.productsAvailable[i].nome,
            'produtoRefeicao': $scope.productsAvailable[i].produtoRefeicao,
            'produtoAlimentacao': $scope.productsAvailable[i].produtoAlimentacao
          });
        } else {
          produtos.push($scope.productsAvailable[i].id);
        }
      }
    }
    return produtos;
  };

  $scope.salvarCredenciamento = function (status, callback) {
    $scope.LOADING = true;

    $scope.formNovoCred.passoAtual = $scope.currentStep;
    $scope.formNovoCred.status = status !== undefined ? status : 0;

    $scope.formNovoCred.filiacoes = [];
    for (var i = 0; i < $scope.filiacoes.length; i++) {
      if ($scope.filiacoes[i].numero) {
        $scope.formNovoCred.filiacoes.push($scope.filiacoes[i]);
      }
    }
    ;

    $scope.formNovoCred.dadosBancarios = [];
    for (var i = 0; i < $scope.products.length; i++) {
      if ($scope.products[i].bank !== undefined) {
        var db = {};
        db.numeroBanco = $scope.products[i].bank;
        db.numeroAgencia = $scope.products[i].agency;
        db.digitoAgencia = $scope.products[i].agencyDigit;
        db.numeroConta = $scope.products[i].bankAccount;
        db.digitoConta = $scope.products[i].bankAccountDigit;
        db.produto = {};
        db.produto.id = $scope.products[i].id;
        db.produto.nome = $scope.products[i].nome;
        $scope.formNovoCred.dadosBancarios.push(db);
      }
    }

    $scope.formNovoCred.qualificacao = {};
    if ($scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.tipoEstabelecimento != undefined) {
      $scope.formNovoCred.qualificacao.categoria = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.tipoEstabelecimento.split("|")[0];
      $scope.formNovoCred.qualificacao.subcategoria = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.tipoEstabelecimento.split("|")[1];
      $scope.formNovoCred.qualificacao.numeroMesas = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.numeroMesas;
      $scope.formNovoCred.qualificacao.numeroCadeiras = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.numeroCadeiras;
      $scope.formNovoCred.qualificacao.lugaresBalcao = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.lugaresBalcao;
      $scope.formNovoCred.qualificacao.numerosAtendentes = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.numerosAtendentes;
      $scope.formNovoCred.qualificacao.numeroMaximoRefeicaoDia = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.numeroMaximoRefeicaoDia;
      $scope.formNovoCred.qualificacao.areaEstabelecimento = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.areaEstabelecimento;
      $scope.formNovoCred.qualificacao.quantidadeCaixasLoja = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.quantidadeCaixasLoja;
      $scope.formNovoCred.qualificacao.diasFuncionamento = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.diasFuncionamento;
      $scope.formNovoCred.qualificacao.horaAbertura = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.horaAbertura;
      $scope.formNovoCred.qualificacao.horaFechamento = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.horaFechamento;
      $scope.formNovoCred.qualificacao.possuiDelivery = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.possuiDelivery;
      if ($scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.possuiDelivery) {
        $scope.formNovoCred.qualificacao.dddDelivery = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.telefoneDelivery.substring(0, 2);
        $scope.formNovoCred.qualificacao.telefoneDelivery = $scope.ctrlNovoCred.dadosBancariosQualif.dadosQualif.qualificacao.telefoneDelivery.substring(2);
      }
    }

    $http({
      method: 'POST',
      url: '/api-web/comum/cadastro/credenciar',
      data: $scope.formNovoCred,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.formNovoCred.id = data.idCredenciamento;
      if (data.pdfTermoAdesao) {
        $scope.$broadcast(constants.CREDENCIAMENTO_EVENTS.LOAD_PDF, 'data:application/pdf;base64,' + data.pdfTermoAdesao);
      }
      if ($scope.currentStep < 4) {
        $scope.currentStep++;
      }
      if (callback) {
        callback(data);
      }
    }).error(function (data, status, headers, config) {
      $scope.LOADING = false;
      $scope.feedbacks = [{
        type: 'danger',
        msg: "Não foi possível executar operação. Tente novamente mais tarde."
      }];
    });
  };

  $scope.goHome = function (navigation) {
    $scope.cleanForm();
    if ($rootScope.isInConfirmation()) {
      navigation.setView('confirmation');
    } else {
      $window.location = "/";
    }
  };

  $scope.goStep1 = function () {
    $scope.currentStep = 1;
    $scope.cleanForm();
  };

  $scope.cleanForm = function () {
    $scope.filiacoes.length = 0;
    for (var i = 0; i < $scope.productsAvailable.length; i++) {
      $scope.productsAvailable[i].selected = false;
    }
    $scope.formValidarCred = {};
    $scope.formNovoCred = {};
    $scope.feedbacks = [];
    $scope.products = [];
    $scope.totalPages = -1;
    $scope.pdf = null;
    $scope.ctrlNovoCred.dadosEC.$setPristine();
    $scope.ctrlNovoCred.dadosEC.$setUntouched();
    $scope.ctrlNovoCred.dadosBancariosQualif.$setPristine();
    $scope.ctrlNovoCred.dadosBancariosQualif.$setUntouched();
    $scope.ctrlNovoCred.termoadesao.$setPristine();
    $scope.ctrlNovoCred.termoadesao.$setUntouched();
    $rootScope.$broadcast(constants.CREDENCIAMENTO_EVENTS.RESET_FORM);
  };

  $scope.nextStep = function () {
    $scope.currentStep++;
  };

  $scope.previousStep = function () {
    $scope.currentStep--;
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('NovoCredenciamentoController', $scope);
  }

}]);

appComum.controller('CredenciamentoPasso_1_Controller', ['$rootScope', '$scope', function ($rootScope, $scope) {

  $scope.initFiliacoes = function () {
    var qtdRedesFiliacao = 4;
    var qtdsequenciaisFiliacao = 1;
    $scope.filiacoes.length = 0;
    for (var i = 1; i <= qtdRedesFiliacao; i++) {
      for (var j = 1; j <= qtdsequenciaisFiliacao; j++) {
        $scope.filiacoes.push({'codigoRede': i, 'sequencialRede': j});
      }
    }
  };

  $scope.isFiliacaoPreenchida = function () {
    var filiacaoPreenchida = false;
    for (var i = 0; i < $scope.filiacoes.length; i++) {
      if ($scope.filiacoes[i].numero) {
        filiacaoPreenchida = true;
        return filiacaoPreenchida;
      }
    }

    return filiacaoPreenchida;
  };

  $scope.stepFiliacaoIsInvalid = function () {
    var produtosSelecioando = $scope.getProdutosSelecionados();
    return !$scope.isFiliacaoPreenchida() || produtosSelecioando.length <= 0;
  };

  $rootScope.$on(constants.CREDENCIAMENTO_EVENTS.RESET_FORM, function (event) {
    if (event) {
      $scope.initFiliacoes();
    }
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('CredenciamentoPasso_1_Controller', $scope);
  }

  $scope.initFiliacoes();

}]);

appComum.controller('CredenciamentoPasso_2_Controller', ['$rootScope', '$scope', '$http', '$uibModal', '$window', function ($rootScope, $scope, $http, $uibModal, $window) {
  $scope.produtosSelecionados = [];


  $scope.consultarCNPJ = function ($event, callback) {
    $scope.produtosSelecionados.length = 0;


    $scope.LOADING = true;
    $scope.formValidarCred.cnpj = $scope.formNovoCred.cnpj;
    $scope.formValidarCred.produtos = $scope.getProdutosSelecionados();
    $scope.produtosSelecionados = $scope.getProdutosSelecionados();
    var atualizarDados = $event !== null;

    if ($scope.formValidarCred.cnpj === undefined) {
      return;
    }

    $http({
      method: 'POST',
      url: '/api-web/comum/cadastro/validar-credenciamentos',
      data: $scope.formValidarCred,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data) {
        $scope.LOADING = false;
        if (data.retorno.code === 1) {
          $rootScope.$broadcast(constants.EVENTS.ACCREDITATION_DATA_BANK_LOADED, {produtos: $scope.getProdutosSelecionados(true)});
          if (callback) {
            callback();
          }
        }
        if (data.retorno.code === 2) {
          if (atualizarDados) {
            $scope.formNovoCred.razaoSocial = data.dadosEC.razaoSocial;
            $scope.formNovoCred.nomeFantasia = data.dadosEC.nomeFantasia;
            $scope.formNovoCred.contato = {};
            if (data.dadosEC.contato !== undefined && data.dadosEC.contato !== null) {
              $scope.formNovoCred.contato.nome = data.dadosEC.contato.nome;
              $scope.formNovoCred.contato.cargo = data.dadosEC.contato.cargo;
              $scope.formNovoCred.contato.telefone = data.dadosEC.contato.ddd + data.dadosEC.contato.telefone;
              $scope.formNovoCred.contato.ramal = data.dadosEC.contato.ramal;
              $scope.formNovoCred.contato.emailPrincipal = data.dadosEC.contato.emailPrincipal;
            }
            $scope.formNovoCred.endereco = {};
            if (data.dadosEC.endereco !== undefined && data.dadosEC.endereco !== null) {
              $scope.formNovoCred.endereco.cep = data.dadosEC.endereco.cep.replace("-", "");
              $scope.formNovoCred.endereco.logradouro = data.dadosEC.endereco.tipoLogradouro + ' ' + data.dadosEC.endereco.logradouro;
              $scope.formNovoCred.endereco.numero = data.dadosEC.endereco.numero;
              $scope.formNovoCred.endereco.complemento = data.dadosEC.endereco.complemento;
              $scope.changeUf(data.dadosEC.endereco.uf, function () {
                $scope.formNovoCred.endereco.cidade = $scope.replaceSpecialChars(data.dadosEC.endereco.cidade).toUpperCase();
              });
            }
            $scope.formNovoCred.representante = {};
            if (data.dadosEC.representante !== undefined && data.dadosEC.representante !== null) {
              $scope.formNovoCred.representante.nome = data.dadosEC.representante.nome;
              $scope.formNovoCred.representante.rg = data.dadosEC.representante.rg;
              $scope.formNovoCred.representante.cpf = data.dadosEC.representante.cpf;
            }
            angular.forEach($scope.ctrlNovoCred.dadosEC.$error.required, function (field) {
              field.$setDirty();
            });
          }
          $rootScope.$broadcast(constants.EVENTS.ACCREDITATION_DATA_BANK_LOADED, {
            produtos: $scope.getProdutosSelecionados(true),
            dadosEC: data.dadosEC
          });
          if (callback) {
            callback();
          }

        }
        if (data.retorno.code === 3) {
          $window.document.getElementById("cnpj").focus();
          $scope.limparForm();
          $uibModal.open({
            templateUrl: '/portal/app/UI-Comum/partials/modals/aviso-novo-credenciamento.html',
            controller: 'ModalAvisoNovoCredenciamentoCtrl'
          });
        }

      })
      .error(function (data, status, headers, config) {
        if (data !== undefined && data !== null && data.code < 0) {
          $scope.feedbacks = [{
            type: 'danger',
            msg: data.message
          }];
        } else {
          $scope.feedbacks = [{
            type: 'danger',
            msg: "Não foi possível executar operação. Tente novamente mais tarde."
          }];
        }
        $scope.LOADING = false;
      });
  };

  $scope.changeUf = function (ufSelecionado, callback) {
    $http({
      method: 'GET',
      url: '/api-web/comum/cadastro/listar-municipios/' + ufSelecionado,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.municipios = data;
        if ($scope.formNovoCred != undefined && $scope.formNovoCred.endereco != undefined) {
          $scope.formNovoCred.endereco.uf = ufSelecionado;
        }
        if (callback) {
          callback();
        }
      })
      .error(function (data, status, headers, config) {
        $scope.municipios = [{}];
        if (data) {
          console.log(data.message);
        } else {
          console.log(data.message);
        }
      });

    return false;
  };

  $scope.replaceSpecialChars = function (str) {
    str = str.replace(/[ÀÁÂÃÄÅ]/, "A");
    str = str.replace(/[àáâãäå]/, "a");
    str = str.replace(/[ÈÉÊË]/, "E");
    str = str.replace(/[Ç]/, "C");
    str = str.replace(/[ç]/, "c");
    return str;
  };

  $scope.objectEquals = function (obj1, obj2) {
    for (var i in obj1) {
      if (obj1.hasOwnProperty(i)) {
        if (!obj2.hasOwnProperty(i)) return false;
        if (obj1[i] != obj2[i]) return false;
      }
    }
    for (var i in obj2) {
      if (obj2.hasOwnProperty(i)) {
        if (!obj1.hasOwnProperty(i)) return false;
        if (obj1[i] != obj2[i]) return false;
      }
    }
    return true;
  };

  $scope.limparForm = function () {
    $scope.formNovoCred.cnpj = "";
    $scope.formNovoCred.razaoSocial = "";
    $scope.formNovoCred.nomeFantasia = "";
    $scope.formNovoCred.contato = {};
    $scope.formNovoCred.endereco = {};
    $scope.formNovoCred.representante = {};
    $scope.formValidarCred = {};
    $scope.ctrlNovoCred.dadosEC.$setPristine();
    $scope.ctrlNovoCred.dadosEC.$setUntouched();
  };

  $scope.nextStep = function () {
    if (!$scope.objectEquals($scope.produtosSelecionados, $scope.getProdutosSelecionados())) {
      $scope.consultarCNPJ(null, function () {
        $scope.salvarCredenciamento();
      });

    } else {
      $scope.salvarCredenciamento();
    }
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('CredenciamentoPasso_2_Controller', $scope);
  }

}]);

appComum.controller('CredenciamentoPasso_3_Controller', ['$scope', '$http', function ($scope, $http) {

  $scope.validarDadosBancarios = function () {
    var formValidacaoDB = {};
    formValidacaoDB.dadosBancarios = [];
    for (var i = 0; i < $scope.products.length; i++) {
      var db = {};
      db.numeroBanco = $scope.products[i].bank;
      db.numeroAgencia = $scope.products[i].agency;
      db.digitoAgencia = $scope.products[i].agencyDigit;
      db.produto = {};
      db.produto.id = $scope.products[i].id;
      formValidacaoDB.dadosBancarios.push(db);
    }

    $http({
      method: 'POST',
      url: '/api-web/comum/cadastro/validar-dados-bancarios',
      data: formValidacaoDB,
      headers: {'Content-Type': 'application/json'},
    })
      .success(function (data) {
        $scope.LOADING = false;
        if (!data.validado) {
          for (key in data.validacoes) {
            for (var i = 0; i < $scope.products.length; i++) {
              if ($scope.products[i].id == key) {
                $scope.products[i].error = data.validacoes[key];
              }
            }
          }
        } else {
          $scope.salvarCredenciamento();
        }
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.feedbacks = [{
          type: 'danger', msg: constants.CREDENCIAMENTO_MESSAGES.DEFAULT_ERROR_MESSAGE
        }];
      });

  };

  $scope.nextStep = function () {
    $scope.validarDadosBancarios();
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('CredenciamentoPasso_3_Controller', $scope);
  }

}]);

appComum.controller('CredenciamentoPasso_4_Controller', ['$rootScope', '$scope', '$http', '$uibModal', '$window', function ($rootScope, $scope, $http, $uibModal, $window) {

  $scope.bufferPDF = null;

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
    $scope.bufferPDF = array;
    return array;
  };

  $scope.renderPdf = function (pdf) {
    $scope.pdf = pdf;
    $scope.totalPages = pdf.numPages;
    $scope.renderPage($scope.currentPage);
  };

  $scope.renderPage = function (num) {
    if ($scope.pdf) {
      $scope.pdf.getPage(num).then(function (page) {
        var scale = 1.0;
        var viewport = page.getViewport(scale);
        var canvas = document.getElementById('termoAdesaoCanvas');
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

  $scope.downloadFile = function () {

    if ($window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([$scope.bufferPDF], {type: "application/pdf"});
      navigator.msSaveBlob(blob, "termo_adesao.pdf");
    } else {
      var file = new Blob([$scope.bufferPDF], {type: "application/pdf"});
      var url = $window.URL || $window.webkitURL;
      var fileURL = url.createObjectURL(file);
      var anchor = angular.element('<a/>');
      anchor.css({display: 'none'}); // Make sure it's not visible
      angular.element(document.body).append(anchor); // Attach to document
      anchor.attr({
        href: fileURL,
        target: '_self',
        download: "termo_adesao.pdf"
      })[0].click();
      anchor.remove();
    }
  };

  $scope.$watch('currentPage', function (value) {
    $scope.renderPage(value);
  });


  $scope.$on(constants.CREDENCIAMENTO_EVENTS.LOAD_PDF, function (event, pdf) {
    if (pdf) {
      PDFJS.getDocument($scope.convertDataURIToBinary(pdf)).then($scope.renderPdf);
    }
  });

  $scope.enviarCredenciamento = function () {
    var statusCredenciamentoConcluido = 1;
    $scope.salvarCredenciamento(statusCredenciamentoConcluido, function (data) {
      $scope.nextStep();
      $rootScope.$broadcast(constants.CREDENCIAMENTO_EVENTS.SHOW_SUCCESS_MSG, data);
    });
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('CredenciamentoPasso_4_Controller', $scope);
  }

  if (!$rootScope.isInConfirmation()) {
    $scope.init();
  }

  $rootScope.$on(constants.CREDENCIAMENTO_EVENTS.RESET_FORM, function (event) {
    if (event) {
      $scope.init();
      $scope.accepted = false;
    }
  });

}]);

appComum.controller('CredenciamentoPasso_5_Controller', ['$rootScope', '$scope', '$http', '$uibModal', '$window', function ($rootScope, $scope, $http, $uibModal, $window) {
  $scope.message = null;

  $scope.novoCredenciamento = function () {
    $scope.goStep1();
  };

  $rootScope.$on(constants.CREDENCIAMENTO_EVENTS.SHOW_SUCCESS_MSG, function (event, data) {
    if (data) {
      $scope.message = data.message;
    }
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('CredenciamentoPasso_5_Controller', $scope);
  }

}]);

appComum.controller('ModalAvisoNovoCredenciamentoCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
  $scope.messageSubject = "Aviso";
  $scope.messageDetail = "Agradecemos o seu contato.\nEstabelecimento já credenciado ao(s) produto(s) selecionado(s).";

  $scope.onstate = "awaiting";
  $scope.LOADING = false;

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ModalAvisoNovoCredenciamentoCtrl', $scope);
  }

}]);


