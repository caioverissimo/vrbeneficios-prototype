appBeneficiario.controller('consultaRapidaController', ['$scope', '$timeout', '$window', '$http', '$rootScope', function ($scope, $timeout, $window, $http, $rootScope) {
  $scope.LOADING = false;
  $scope.cartao = null;
  $scope.formConsultaRapida = {};
  $scope.formConsultaRapida.erro = null;
  $scope.helpTooltipIsHidden = true;
  $scope.dataConsulta = null;
  $scope.recaptchaKey = null;

  $scope.notificarWidgets = function (cartao) {
    $rootScope.$broadcast(constants.EVENTS.CARD_SELECTED, {activeCard: cartao, from: 'consultaRapida'});
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

  $scope.hasContent = function () {
    return $scope.cartao !== null && $scope.LOADING === false;
  };

  $scope.hasError = function () {
    return $scope.formConsultaRapida.erro !== null && $scope.LOADING === false;
  };


  $scope.triggerAction = function () {
    $scope.formConsultaRapida.erro = null;
    $scope.LOADING = true;
    $scope.dataConsulta = new Date();
    $http({
      method: 'GET',
      url: '/api-web/beneficiario/cartao/consulta-rapida/' + $scope.formConsultaRapida.numeroCartao,
      headers: {'Content-Type': 'text/plain'}
    }).success(function (data) {
      $scope.LOADING = false;
      $scope.cartao = data;
      $scope.notificarWidgets($scope.cartao);
    }).error(function (data) {
      $scope.LOADING = false;
      $scope.cartao = null;
      if (data) {
        $scope.formConsultaRapida.erro = data.message;
      } else {
        $scope.formConsultaRapida.erro = "Conteúdo indisponível no momento.";
      }
      $scope.notificarWidgets();
    });
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('consultaRapidaController', $scope);
  }

  $scope.notificarWidgets();
  $scope.init();

}]);




