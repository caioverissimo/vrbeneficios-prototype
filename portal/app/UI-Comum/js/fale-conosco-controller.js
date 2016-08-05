appComum.controller('FaleConoscoController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

  // Inicializa model dos campos
  $scope.contact = {};
  $scope.contact.name = "";
  $scope.contact.email = "";
  $scope.contact.celular = "";
  $scope.contact.cnpj = "";
  $scope.contact.companyName = "";
  $scope.contact.numberOfEmployees = "";
  $scope.contact.subject = "";
  $scope.contact.message = "";
  $scope.contact.availableProducts = [
    {
      'name': 'VR Refeição',
      'selected': false
    },
    {
      'name': 'VR Alimentação',
      'selected': false
    },
    {
      'name': 'VR Auto',
      'selected': false
    },
    {
      'name': 'VR Transporte',
      'selected': false
    }];
  $scope.subjectOptions = [
    {
      'id': 1,
      'name': 'Tenho interesse em contratar a VR Benefícios'
    },
    {
      'id': 2,
      'name': 'Desejo aceitar os cartões VR Benefícios no meu estabelecimento'
    },
    {
      'id': 3,
      'name': 'Sou cliente e preciso de ajuda para acessar o novo site'
    },
    {
      'id': 4,
      'name': 'Estou com problemas na utilização do cartão'
    }, {
      'id': 5,
      'name': 'Outros assuntos'
    }];

  $scope.feedbacks = [];

  $scope.isMainSubjectSelected = false;

  constants.FALE_CONOSCO_MESSAGES = {
    FALE_CONOSCO_SUCCESS_MESSAGE: 'Sua mensagem foi enviada com sucesso. Em breve retornaremos o contato.',
    DEFAULT_ERROR_MESSAGE: 'Não foi possível completar a sua operação. Por favor, tente novamente mais tarde.'
  };

  $scope.updateMainSubjectSelected = function () {
    if (typeof $scope.contact.subject === 'undefined' || $scope.contact.subject.id !== 1) {
      $scope.isMainSubjectSelected = false;
    } else {
      $scope.isMainSubjectSelected = true;
    }
  };

  // Retorna se deve ou nao apresentar campos escondidos
  // (de acordo com o 'Assunto' selecionado)
  $scope.hasToShowOtherFields = function () {
    return $scope.isMainSubjectSelected;
  };

  $scope.verifyAtLeastOneMarked = function() {
    var countMarkedCheckbox = 0;

    for (var i=0; i<$scope.contact.availableProducts.length; i++) {
      if($scope.contact.availableProducts[i].selected === true) {
        countMarkedCheckbox++;
      }
    }

    if (countMarkedCheckbox > 0) {
      if($scope.contactUs) {
        $scope.contactUs.$setValidity('atLeastOneCheckedValidation', true);
      }
    } else {
      if ($scope.contactUs) {
        $scope.contactUs.$setValidity('atLeastOneCheckedValidation', false);
      }
    }

  };

  // Salvar dados de formulario
  $scope.saveContact = function () {
    $scope.LOADING = true;

    $http({
      method: 'POST',
      url: '/api-web/comum/fale-conosco/enviar',
      data: {
        "nome": $scope.contact.name,
        "email": $scope.contact.email,
        "telefone": $scope.contact.celular,
        "assunto": $scope.contact.subject.id + ' - ' + $scope.contact.subject.name,
        "mensagem": $scope.contact.message,
        "cnpj": $scope.contact.cnpj,
        "nomeEmpresa": $scope.contact.companyName,
        "qtdeFuncionarios": $scope.contact.numberOfEmployees,
        "produtos": recuperarProdutos()
      },
      headers: {'Content-Type': 'application/json'}
    }).success(function (data, status, headers, config) {
      $scope.LOADING = false;
      var allRight = false;
      if (data) {
        if (data.codigoResposta == 0) {
          resetForm();
          allRight = true;
        }
      }
      // exibe msg
      if (allRight) {
        $scope.feedbacks = [{
          type: 'success', msg: constants.FALE_CONOSCO_MESSAGES.FALE_CONOSCO_SUCCESS_MESSAGE
        }];
      }
      else {
        $scope.feedbacks = [{
          type: 'danger', msg: constants.FALE_CONOSCO_MESSAGES.DEFAULT_ERROR_MESSAGE
        }];
      }
    }).error(function (data, status, headers, config) {
      $scope.LOADING = false;
      $scope.feedbacks = [{
        type: 'danger', msg: constants.FALE_CONOSCO_MESSAGES.DEFAULT_ERROR_MESSAGE
      }];
    });
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('FaleConoscoController', $scope);
  }

  function recuperarProdutos() {
    var str_produtos = '[';
    var first = true;
    for (var indice in $scope.contact.availableProducts) {
      var ckProduct = $scope.contact.availableProducts[indice];
      if (ckProduct.selected) {
        if (first) {
          first = false;
          str_produtos += ckProduct.name;
        }
        else
          str_produtos += ',' + ckProduct.name;
      }
    }
    str_produtos += ']';
    return str_produtos;
  }

  function resetForm() {
    $scope.contact = {};
    $scope.contactUs.$setPristine();
    $scope.isMainSubjectSelected = false;
  }

  $scope.verifyAtLeastOneMarked();

}]);
