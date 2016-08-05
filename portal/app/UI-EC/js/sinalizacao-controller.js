appEC.controller('sinalizacaoController', ['$rootScope', '$scope', '$http', '$uibModal', function ($rootScope, $scope, $http, $uibModal) {
  $scope.produtos = {};
  $scope.formSinalizacao = {};
  $scope.registryaddress = "";
  $scope.produtoSelecionado = false;


  $scope.changeUf = function (ufSelecionado) {
    $http({
      method: 'GET',
      url: '/api-web/ec/cadastro/listar-municipios/' + ufSelecionado,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.municipios = data;
      })
      .error(function (data, status, headers, config) {
        $scope.municipios = [{}];
        $scope.feedbacks = [{
          type: 'danger',
          msg: 'Não foi possível carregar as cidades. Tente novamente mais tarde.'
        }];
      });

    return false;
  };

  $scope.selecionarProduto = function () {
    for (var i = 0; i < $scope.produtos.length; i++) {
      if ($scope.produtos[i].selected) {
        $scope.produtoSelecionado = true;
        return;
      }
    }
    $scope.produtoSelecionado = false;
  };

  $scope.consultarCredenciamentos = function () {
    $http({
      method: 'GET',
      url: '/api-web/ec/cadastro/consultar-credenciamento',
      headers: {'Content-Type': 'text/plain'}
    })
      .success(function (data, status, headers, config) {
        $scope.produtos = data;
      })
      .error(function (data, status, headers, config) {
        $scope.feedbacks = [{
          type: 'danger',
          msg: 'Não foi possível carregar os produtos. Tente novamente mais tarde.'
        }];
      });

    return false;
  };

  $scope.setRegistryaddress = function (value) {
    $scope.registryaddress = value;
  };

  $scope.preencherEndereco = function (tipoEndereco) {
    if (tipoEndereco == "sameaddress") {
      $scope.formSinalizacao.cep = $scope.dadosEC.endereco.cep;
      $scope.formSinalizacao.tipoLogradouro = $scope.dadosEC.endereco.tipoLogradouro;
      $scope.formSinalizacao.endereco = $scope.dadosEC.endereco.logradouro;
      $scope.formSinalizacao.numero = $scope.dadosEC.endereco.numero;
      $scope.formSinalizacao.complemento = $scope.dadosEC.endereco.complemento;
      $scope.formSinalizacao.uf = $scope.dadosEC.endereco.uf;
      $scope.formSinalizacao.cidade = $scope.dadosEC.endereco.cidade;
    } else {
      $scope.formSinalizacao = {};
    }
    if ($scope.dadosEC != undefined) {
      $scope.formSinalizacao.razaoSocial = $scope.dadosEC.razaoSocial;
    }
    $scope.formSinalizacao.flagNovoEndereco = !tipoEndereco == "sameaddress";
  };


  $scope.sendRequest = function () {

    $scope.formSinalizacao.produtos = [];
    for (var i = 0; i < $scope.produtos.length; i++) {
      if ($scope.produtos[i].selected) {
        $scope.formSinalizacao.produtos.push($scope.produtos[i].id);
      }
    }
    $scope.formSinalizacao.cep = $scope.formSinalizacao.cep.replace("-", "");

    $http({
      method: 'POST',
      url: '/api-web/ec/cadastro/sinalizacao',
      data: $scope.formSinalizacao,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $uibModal.open({
          templateUrl: '/portal/app/UI-EC/partials/modals/sinal-sucesso.html',
          controller: 'SinalizacaoModalCtrl',
          backdrop: 'static',
          size: 'lg',
          keyboard: false
        });

      })
      .error(function (data, status, headers, config) {
        $scope.feedbacks = [{
          type: 'danger', msg: "Não foi possível executar operação. Tente novamente mais tarde."
        }];
      });


  };

  $rootScope.$on(constants.EVENTS.ESTABLISHMENT_DATA_LOADED, function (event, dadosEC) {
    if (dadosEC) {
      $scope.dadosEC = dadosEC;
      $scope.consultarCredenciamentos();
    }
  });


  $scope.$watch('registryaddress', function (value) {
    $scope.preencherEndereco(value);
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('sinalizacaoController', $scope);
  }

}]);

appEC.controller('SinalizacaoModalCtrl', ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
  $scope.onstate = "awaiting";
  $scope.LOADING = false;
  $scope.messageSubject = "Sua solicitação de sinalização foi enviada com sucesso! "
  $scope.messageDetail = "Em aproximadamente 15 dias você a receberá no endereço informado."


  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
  };

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('SinalizacaoModalCtrl', $scope);
  }

}]);
