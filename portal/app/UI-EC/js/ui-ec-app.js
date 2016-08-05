var appEC = angular.module('ui-ec-app', [
  // modulos de terceiros
  'angular-chartist',
  'ngMap',
  'ngMessages',
  'ui.bootstrap',
  'ui.mask',
  'angular-loading-bar',
  'ngCpfCnpj',
  'vcRecaptcha',
  'uiGmapgoogle-maps',

  // modulos vr
  'ui-components-app',
  'ui-comum-app'
]);

appEC.factory('cnpjECInjector', ['sessionService', function (sessionService) {
  return {
    request: function (config) {
      var cnpjEC = sessionService.getCnpjEC();
      if (cnpjEC) {
        config.headers['cnpjEC'] = cnpjEC;
      }
      return config;
    }
  };
}]);

appEC.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('cnpjECInjector');
}]);

appEC.run(['$rootScope', '$window', function ($rootScope, $window) {

  $rootScope.isInProfile = function () {
    return $window.location.pathname.indexOf('estabelecimento.html') > -1;
  };

}]);




