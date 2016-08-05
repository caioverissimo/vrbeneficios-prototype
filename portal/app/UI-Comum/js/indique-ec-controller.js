appComum.controller('PlaceIndicationController', ['$http', '$scope', '$timeout', '$window', 'uiGmapGoogleMapApi', 'mobileChecker', '$cookies', function ($http, $scope, $timeout, $window, uiGmapGoogleMapApi, mobileChecker, $cookies) {
  $scope.LOADING = false;
  $scope.feedbacks = null;
  $scope.estabelecimento = {};
  $scope.municipios = [{}];
  $scope.indiqueECFromCanal = false;

  //Detecta se está em ambiente mobile - Adicionado em 16/04 @luiz
  $scope.isMobile = mobileChecker();

  constants.INDIQUE_EC_MESSAGES = {
    INDIQUE_EC_SUCCESS_MESSAGE: 'Olá</br>Agradecemos o seu Contato e em breve daremos retorno sobre sua indicação.</br></br>Atenciosamente,</br>Equipe Telemarketing</br>Rede de Estabelecimentos.',
    DEFAULT_ERROR_MESSAGE: 'Não foi possível completar a sua operação. Por favor, tente novamente mais tarde.',
    GEOLOCATION_UNAVAILABLE: 'Geolocalização indisponível.'
  };

  $scope.closeFeedback = function (index) {
    $scope.feedbacks.splice(index, 1);
  };

  $scope.geolocation = function () {
    $scope.LOADING = true;
    if ($window.navigator.geolocation) {
      $window.navigator.geolocation.getCurrentPosition(function (position) {

        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        uiGmapGoogleMapApi.then(function (maps) {
          var geocoder = new maps.Geocoder;
          geocoder.geocode({'location': pos}, function (results, status) {

            if (status === maps.GeocoderStatus.OK && results.length >= 1) {
              var address = results[0]['address_components'];
              for (var i = 0; i < address.length; i++) {
                for (var j = 0; j < address[i].types.length; j++) {
                  switch (address[i].types[j]) {
                    case 'route':
                      $scope.estabelecimento.endereco = address[i]['long_name'];
                      break;
                    // case 'street_number':
                    //   $scope.estabelecimento.numero = address[i]['long_name'].replace(/[^0-9]/g, '');
                    //   break;
                    case 'sublocality':
                      $scope.estabelecimento.bairro = address[i]['long_name'];
                      break;
                    case 'administrative_area_level_1':
                      $scope.estabelecimento.uf = address[i]['short_name'];
                      break;
                    case 'administrative_area_level_2':
                      $scope.estabelecimento.cidade = address[i]['long_name'];
                      break;
                  }
                }
              }

              $scope.LOADING = false;
              $scope.$apply();
            } else {
              $scope.locationError(); // api do google não encontrou coordenadas
            }
          });
        });

      }, $scope.locationError); // usuario se negou a fornecer geolocation
    } else {
      $scope.locationError(); // browser nao tem geolocation
    }
  };

  $scope.locationError = function () {
    $scope.feedbacks = [{
      type: 'warning', msg: constants.INDIQUE_EC_MESSAGES.GEOLOCATION_UNAVAILABLE
    }];
    $scope.LOADING = false;
  };

  $scope.indication = function () {
    $scope.LOADING = true;
    $scope.estabelecimento.siglaEmissor = constants.SETTINGS.SIGLA_EMISSOR;
    $http({
      method: 'POST',
      url: '/api-web/comum/indique-ec/enviar',
      data: $scope.estabelecimento,
      headers: {'Content-Type': 'application/json'}
    }).success(function (data, status, headers, config) {
      $scope.LOADING = false;
      $scope.feedbacks = [{
        type: 'success', msg: constants.INDIQUE_EC_MESSAGES.INDIQUE_EC_SUCCESS_MESSAGE
      }];
    }).error(function (data, status, headers, config) {
      $scope.LOADING = false;
      $scope.feedbacks = [{
        type: 'error', msg: constants.INDIQUE_EC_MESSAGES.DEFAULT_ERROR_MESSAGE
      }];
    });
  };

  $scope.changeUf = function (ufSelecionado) {
    $http({
      method: 'GET',
      url: '/api-web/comum/cadastro/listar-municipios/' + ufSelecionado,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        $scope.municipios = data;
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


  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('PlaceIndicationController', $scope);
  }

  $scope.isIndiqueECFromCanal = function () {
    return $scope.indiqueECFromCanal;
  };

  if ($cookies.indiqueecFromCanal && $cookies.indiqueecFromCanal !== "") {
    var dadosIndiqueEC = angular.fromJson($cookies.indiqueecFromCanal);
    $scope.estabelecimento.nomeEmpresa = dadosIndiqueEC.nomeEmpresa;
    $scope.estabelecimento.tipoEmpresa = dadosIndiqueEC.tipoEmpresa;
    $scope.estabelecimento.contato = dadosIndiqueEC.nomeUsuario;
    $scope.estabelecimento.cpf = dadosIndiqueEC.cpfUsuario;
    $scope.estabelecimento.email = dadosIndiqueEC.emailUsuario;
    $scope.indiqueECFromCanal = true;
    $cookies.indiqueecFromCanal = "";
  }

}]);
