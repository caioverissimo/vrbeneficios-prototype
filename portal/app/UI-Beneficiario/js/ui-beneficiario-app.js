var appBeneficiario = angular.module('ui-beneficiario-app', [
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


appBeneficiario.config(function (pickadateI18nProvider) {
  pickadateI18nProvider.translations = {
    prev: '<button class="btn btn-default"><i class="fa fa-angle-left"></i></button>',
    next: '<button class="btn btn-default"><i class="fa fa-angle-right"></i></button>'
  }
});

appBeneficiario.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}]);

appBeneficiario.config(function (uiGmapGoogleMapApiProvider) {
  //https://angular-ui.github.io/angular-google-maps/#!/use
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    libraries: 'places'
  });
});


/**
 *  Diretiva com a barra que altera pelo tamanho
 *  Data = é o valor em número que o usuário tem
 *  Total = Valor total possível
 *  Limit = Valor que deve alertar -> Opcional
 **/
appBeneficiario.directive('vrDataBar', [function () {
  return {
    restrict: 'EA',
    template: '<div class="vr-progress-wrapper">'
    + '<div class="vr-progress">'
    + '<div class="vr-progress-bar">'
    + '<div class="vr-progress-limit-bar"></div>'
    + '<div class="vr-progress-bar-text">{{ pct }}%</div>'
    + '</div>'
    + '<div class="vr-progress-limit-text" ng-class="{\'hidden\': limitValuePct === 0}">Alerta de saldo {{ limitValuePct | currency:"R$" }}</div>'
    + '<div class="vr-progress-limit" ng-class="{\'hidden\': limitValuePct === 0}"></div></div></div>',
    replace: true,
    scope: {
      spent: '=',
      total: '=',
      limit: '=?',
      limitPercent: '=?'
    },
    link: function ($scope, iElm, iAttrs) {
      var el = iElm[0], spent, total, limit, limitPercent;

      //Pegando os elementos necessários do dom
      var bar = el.querySelector('.vr-progress-bar'),
        barText = el.querySelector('.vr-progress-bar-text'),
        barLimit = el.querySelector('.vr-progress-limit'),
        barOverLimit = el.querySelector('.vr-progress-limit-bar'),
        barOverLimitText = el.querySelector('.vr-progress-limit-text');

      //Need fool-proof :x
      var handleDot = function (val) {
        if (typeof val === "string")
          val = val.replace(',', '.');

        if (isNaN(val))
          return 0;

        return parseFloat(val);
      };

      var drawGraph = function () {
        if (spent !== undefined && total !== undefined && limit !== undefined && limitPercent !== undefined) {
          //Cálculo inicial
          $scope.pct = Math.round((spent / total) * 100);

          //Ajuste para tamanho máximo
          if ($scope.pct >= 100) {
            bar.style.width = "100%";
          } else {
            bar.style.width = $scope.pct + "%";
          }

          //Posicionamento da porcentagem na barra
          if ($scope.pct >= 50) {
            barText.style.right = "45%";
          }

          //Caso ele tenha setado um limite
          $scope.limitValuePct = limit;

          $scope.barOverLimitWidth = ($scope.pct - 100) > 0 ? 10 : 0;
          barOverLimit.style.width = $scope.barOverLimitWidth + "%";
          barOverLimitText.style.left = limitPercent + "%";
          barLimit.style.left = limitPercent + "%";

          //Colorizando a barra
          if (limitPercent > $scope.pct) {
            bar.style.background = "#f93417";
          } else {
            bar.style.background = "#10BA54";
          }
        }
      };

      $scope.$watch('spent', function (newVal) {
        spent = handleDot(newVal);
        drawGraph();
      });

      $scope.$watch('total', function (newVal) {
        total = handleDot(newVal);
        drawGraph();
      });

      $scope.$watch('limit', function (newVal) {
        limit = handleDot(newVal);
        drawGraph();
      });

      $scope.$watch('limitPercent', function (newVal) {
        limitPercent = handleDot(newVal);
        drawGraph();
      });

      drawGraph();
    }
  };
}]);
