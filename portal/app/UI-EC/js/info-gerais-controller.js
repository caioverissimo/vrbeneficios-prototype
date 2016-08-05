appEC.controller('infoGeraisController', ['$rootScope', '$scope', "$filter", '$http', '$window', function ($rootScope, $scope, $filter, $http, $window) {
  $scope.LOADING = $scope.hasActiveEstablishment();
  $scope.feedbacks = null;
  $scope.formInfoGerais = null;
  $scope.formPicture = null;

  constants.INFO_GERAIS = {
    DEFAULT_ERROR_MESSAGE: 'Não possível realizar a operação. Tente novamente mais tarde.',
    LOGO_SUCCESS_MESSAGE: 'Logo alterado com sucesso.',
    LOGO_REMOVE_SUCCESS_MESSAGE: 'Logo removido com sucesso.',
    URI_DOWNLOAD_CONTRATO: '/api-web/ec/contrato/visualizar-pdf/',
    URI_DOWNLOAD_TERMO: '/api-web/ec/contrato/gerar-termo-ec'
  };

  $scope.closeFeedback = function (index) {
    $scope.feedbacks.splice(index, 1);
  };

  $scope.consultarDadosEC = function (cnpjEC) {
    $scope.LOADING = true;
    $http(
      {
        method: 'GET',
        url: '/api-web/ec/cadastro/info/' + cnpjEC,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .success(function (data, status, headers, config) {
        $rootScope.$broadcast(constants.EVENTS.ESTABLISHMENT_DATA_LOADED, data);
        $scope.LOADING = false;
        $scope.formInfoGerais = data;
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.formInfoGerais = null;
        if (data) {
          $scope.feedbacks = [{
            type: 'danger',
            msg: data.message
          }];
        } else {
          $scope.feedbacks = [{
            type: 'danger',
            msg: constants.INFO_GERAIS.DEFAULT_ERROR_MESSAGE
          }];
        }
      });
  };

  if ($scope.hasActiveEstablishment()) {
    $scope.cnpjEC = $rootScope.getActiveEstablishment().cnpj;
    // se nao tiver imagem
    if (!$rootScope.getActiveEstablishment().pathLogotipo) {
      $scope.formPicture = '/portal/img/icons-painel/icon_avatar_ec.png';
    }
    else {
      $scope.formPicture = '/portal/data/' + $rootScope.getActiveEstablishment().pathLogotipo;
    }
    $scope.consultarDadosEC($scope.cnpjEC);
  }

  $scope.isInDadosEstabelecimento = function () {
    return $window.location.pathname.indexOf('dados-do-estabelecimento.html') > -1
      || $window.location.pathname.indexOf('estabelecimento.html') > -1;
  };


  $scope.hasContent = function () {
    return ($scope.formInfoGerais !== null && $scope.LOADING === false);
  };

  $scope.hasNoContent = function () {
    return ($scope.formInfoGerais === null && $scope.LOADING === false);
  };

  $scope.showInputFile = function () {
    return false;
  };

  $scope.selectFile = function () {
    angular.element("#establishmentImageUpload").click();
  };

  $scope.fileSelected = function () {
    $scope.LOADING = true;
    var file = event.target.files[0];
    $http(
      {
        method: 'POST',
        url: '/api-web/ec/cadastro/foto-subusuario',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: {
          "identificador": $scope.cnpjEC,
          "logotipo": file
        },
        transformRequest: function (data, headersGetter) {
          var formData = new FormData();
          angular.forEach(data, function (value, key) {
            formData.append(key, value);
          });

          var headers = headersGetter();
          delete headers['Content-Type'];

          return formData;
        }
      })
      .success(function (data, status, headers, config) {
        $scope.LOADING = false;
        if (data) {
          if (data.codigoResposta != 0) {
            $scope.feedbacks = [{
              type: 'danger',
              msg: data.descricaoResposta
            }];
          }
          else {
            $scope.feedbacks = [{
              type: 'success',
              msg: constants.INFO_GERAIS.LOGO_SUCCESS_MESSAGE
            }];
            // Atualiza a imagem na view e sessionStorage
            $scope.formPicture = '/portal/data/' + data.imagePath;
            var activeEstab = $rootScope.getActiveEstablishment();
            activeEstab.pathLogotipo = data.imagePath;
            $window.sessionStorage.setItem(constants.SESSION.ESTABLISHMENT_SELECTED, JSON.stringify(activeEstab));
          }
        }
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.feedbacks = [{
          type: 'danger',
          msg: constants.INFO_GERAIS.DEFAULT_ERROR_MESSAGE
        }];
      });
  };

  $scope.getCurrentPicture = function () {
    return $scope.formPicture;
  };

  $scope.getOperationDay = function () {
    var value = '';
    if ($scope.formInfoGerais != null && $scope.formInfoGerais.dadosQualificacao) {
      for (var key in constants.DYNAMIC_DATA.OPERATING_DAYS) {
        var operationDay = constants.DYNAMIC_DATA.OPERATING_DAYS[key];
        if (operationDay.key == $scope.formInfoGerais.dadosQualificacao.diasFuncionamento) {
          var hourOpen = $scope.formInfoGerais.dadosQualificacao.horaAbertura.substring(0, 2) + ':' + $scope.formInfoGerais.dadosQualificacao.horaAbertura.substring(2, 4);
          var hourClose = $scope.formInfoGerais.dadosQualificacao.horaFechamento.substring(0, 2) + ':' + $scope.formInfoGerais.dadosQualificacao.horaFechamento.substring(2, 4);
          value = operationDay.label + ' das ' + hourOpen + ' às ' + hourClose;
        }
      }
    }
    return value;
  };

  $scope.insertPicture = function () {
    angular.element('#establishmentImageUpload').click();
  };

  $scope.removePicture = function () {
    $http(
      {
        method: 'POST',
        url: '/api-web/ec/cadastro/remover-foto-subusuario',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          identificador: $scope.cnpjEC
        }
      })
      .success(function () {
        $scope.LOADING = false;
        // remove a imagem na view e sessionStorage
        $scope.formPicture = null;
        var activeEstab = $rootScope.getActiveEstablishment();
        activeEstab.pathLogotipo = null;
        $window.sessionStorage.setItem(constants.SESSION.ESTABLISHMENT_SELECTED, JSON.stringify(activeEstab));
        $scope.feedbacks = [{
          type: 'success',
          msg: constants.INFO_GERAIS.LOGO_REMOVE_SUCCESS_MESSAGE
        }];
      })
      .error(function () {
        $scope.LOADING = false;
        $scope.feedbacks = [{
          type: 'danger',
          msg: constants.INFO_GERAIS.DEFAULT_ERROR_MESSAGE
        }];
      });
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('infoGeraisController', $scope);
  }

}]);


appEC.controller('ContratosTermosController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
  $scope.LOADING = false;
  $scope.documentList = null;
  $scope.termoAdesao = {nome: 'Termos e Adesão', id: 0};

  $scope.getDocumentList = function () {
    $scope.LOADING = true;
    $http({
      method: 'GET',
      url: '/api-web/ec/contrato/visualizar-aceitos',
      headers: {
        'Content-Type': 'text/plain'
      }
    }).success(function (data, status, headers, config) {
      $scope.LOADING = false;
      $scope.documentList = data;
      $scope.documentList.push($scope.termoAdesao);
    }).error(function (data, status, headers, config) {
      $scope.LOADING = false;
      $scope.documentList = [{}];
      $scope.documentList.push($scope.termoAdesao);
      if (data) {
        console.log("Erro : " + data.message);
      } else {
        console.log("Erro interno");
      }
    });
  };

  $scope.downloadContrato = function (codigo, nome) {
    $scope.LOADING = true;
    $http.get($scope.resolveURI(codigo)).then(function (result) {
      $scope.LOADING = false;
      var buffer = $scope.convertDataURIToBinary('data:application/pdf;base64,' + result.data.contrato);
      $scope.downloadFile(nome, buffer);
    });
  };

  $scope.resolveURI = function (codigo) {
    var serviceName;
    if (codigo === 0) { // download termo de adesao
      serviceName = constants.INFO_GERAIS.URI_DOWNLOAD_TERMO;
    } else {
      serviceName = constants.INFO_GERAIS.URI_DOWNLOAD_CONTRATO + codigo;
    }
    return serviceName;
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
    return array;
  };

  $scope.downloadFile = function (nome, buffer) {
    if ($window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([buffer], {type: "application/pdf"});
      navigator.msSaveBlob(blob, nome + ".pdf");
    } else {
      var file = new Blob([buffer], {type: "application/pdf"});
      var url = $window.URL || $window.webkitURL;
      var fileURL = url.createObjectURL(file);
      var anchor = angular.element('<a/>');
      anchor.css({display: 'none'}); // Make sure it's not visible
      angular.element(document.body).append(anchor); // Attach to document
      anchor.attr({
        href: fileURL,
        target: '_self',
        download: nome + ".pdf"
      })[0].click();
      anchor.remove();
    }
  };


  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ContratosTermosController', $scope);
  }

}]);
