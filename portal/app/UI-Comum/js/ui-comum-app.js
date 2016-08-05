var appComum = angular.module('ui-comum-app', [
  // modulos de terceiros
  'ngAnimate',
  'ngMessages',
  'ngCpfCnpj',
  'ui.bootstrap',
  'ui.mask',
  'duScroll',
  'angular-price-format',
  'angular-tour',
  'ngCookies',

  // modulos vr
  'ui-components-app'
]);


appComum.run(['$rootScope', '$window', '$timeout', '$cookies', '$http', function ($rootScope, $window, $timeout, $cookies, $http) {

  // remove barra de loading da página em 2 segundos (default)
  $timeout(function () {
    angular.element(document.body).removeClass('loading-pane');
    angular.element(document.querySelector('.front-loading-wrapper')).remove();
  }, 2000); // 2 segundos

  // TODO
  // RESOLVER SIGLA EMISSOR
  // if (condicao = true) constants.SETTINGS.SIGLA_EMISSOR = VRPAT else constants.SETTINGS.SIGLA_EMISSOR = ANOTHER_EMISSOR
  constants.SETTINGS.SIGLA_EMISSOR = constants.SETTINGS.VRPAT;

  $rootScope.modalFirstLogin = null;
  $rootScope.isFirstLogin = function () {
    if ($cookies.boasVindas) {
      $rootScope.modalFirstLogin = angular.fromJson($cookies.boasVindas);
      // remove o cookie
      $cookies.boasVindas = null;
    }
    return $rootScope.modalFirstLogin;
  };


  var activeEstablishment = null;
  var activeEstablishmentJson = $window.sessionStorage.getItem(constants.SESSION.ESTABLISHMENT_SELECTED);
  if (activeEstablishmentJson) {
    activeEstablishment = JSON.parse(activeEstablishmentJson);
  }

  $rootScope.getActiveEstablishment = function () {
    return activeEstablishment;
  };

  $rootScope.setCommercialPlaceInStorage = function (place) {
    $window.sessionStorage.setItem(constants.SESSION.ESTABLISHMENT_SELECTED, JSON.stringify(place));
  };

  $rootScope.$on(constants.EVENTS.ESTABLISHMENT_SELECTED, function (event, data) {
    $rootScope.setCommercialPlaceInStorage(data.activeEstablishment);
    $http.get('/api-web/ec/cadastro/info/' + data.activeEstablishment.cnpj).then(function (result) {
      activeEstablishment = data.activeEstablishment;
      activeEstablishment.dadosDeNegocio = result.data;
      $rootScope.setCommercialPlaceInStorage(activeEstablishment);
    });
    if (data.callback) {
      data.callback();
    }
  });

  $rootScope.hasActiveEstablishment = function () {
    return $rootScope.getActiveEstablishment() !== null && $rootScope.getActiveEstablishment() !== undefined;
  };

  $rootScope.usuarioLogout = function () {
    $http({
      method: 'POST',
      url: '/api-web/comum/usuario/logout',
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        console.log('Logout efetuado');
        $window.location.reload();
      })
      .error(function (data, status, headers, config) {
        console.log('erro ao efetuar Logout');
        $window.location.reload();
      });
    return false;
  };

  $rootScope.isInConfirmation = function () {
    return $window.location.pathname.indexOf('credenciamento-contato-ec.html') > -1 || $window.location.pathname.indexOf('credenciamento-contato.html') > -1;
  };

  $rootScope.isInGuiaVR = function () {
    return $window.location.pathname.indexOf('guia-vr.html') > -1;
  };

  $rootScope.buildVideoName = function (pageName) {
    if ($rootScope.isInDashboardBen()) {
      return "VIDEO_DASHBOARD";
    } else if ($rootScope.isInDashboardEC()) {
      return "VIDEO_DASHBOARD_ESTAB";
    } else {
      var splitPageName = pageName.split("/");
      var page = splitPageName[splitPageName.length - 1];
      page = page.replace(".html", "").toUpperCase();
      page = page.replace(/-/g, "_");
      return "VIDEO_" + page;
    }
  };

  $rootScope.isInDashboardBen = function () {
    var pageName = $window.location.pathname;
    if (pageName.indexOf('.html') === -1) {
      // portal lumis
      return pageName.indexOf('area-restrita/vr-e-voce/') > -1;
    } else {
      // ambiente dev
      return pageName.indexOf('dashboard.html') > -1;
    }
  };

  $rootScope.isInDashboardEC = function () {
    var pageName = $window.location.pathname;
    if (pageName.indexOf('.html') === -1) {
      // portal lumis
      return pageName.indexOf('area-restrita/vr-e-estabelecimentos/') > -1;
    } else {
      // ambiente dev
      return pageName.indexOf('dashboard-ec.html') > -1;
    }
  };

  $rootScope.isInDashboard = function () {
    return $rootScope.isInDashboardBen() || $rootScope.isInDashboardEC();
  };

  $rootScope.getUrlVideo = function (videoName) {
    var url;
    for (var key in constants.DYNAMIC_DATA.VIDEO_URL) {
      var videoURL = constants.DYNAMIC_DATA.VIDEO_URL[key];
      if (videoURL.key == videoName) {
        url = videoURL.label;
        break;
      }
    }
    return url;
  };


  // popula dados dinamicos
  // produtos
  $http.get('/api-web/comum/enumerations/' + constants.SETTINGS.VRPAT).then(function (result) {
    if (result.data) {

      for (var i = 0; i < result.data.products.length; i++) {
        constants.DYNAMIC_DATA.PRODUCTS.push(result.data.products[i]);
      }

      for (var j = 0; j < result.data.operatingDays.length; j++) {
        constants.DYNAMIC_DATA.OPERATING_DAYS.push(result.data.operatingDays[j]);
      }

      for (var k = 0; k < result.data.typeOfEstablishment.length; k++) {
        constants.DYNAMIC_DATA.TYPE_OF_ESTABLISHMENT.push(result.data.typeOfEstablishment[k]);
      }
      for (var l = 0; l < result.data.videos.length; l++) {
        constants.DYNAMIC_DATA.VIDEO_URL.push(result.data.videos[l]);
      }
    }
  });

  // Adiciona * nos labels de inputs obrigatorios
  var requiredLabelCheck = function () {
    angular.element('input[required]:not(:disabled)').parent().siblings('label').addClass('form-label-required');
    angular.element('input[required]:not(:disabled)').siblings('label').addClass('form-label-required');
    angular.element('select[required]:not(:disabled)').parent().siblings('label').addClass('form-label-required');
    angular.element('select[required]:not(:disabled)').siblings('label').addClass('form-label-required');
    angular.element('textarea[required]:not(:disabled)').parent().siblings('label').addClass('form-label-required');
    angular.element('textarea[required]:not(:disabled)').siblings('label').addClass('form-label-required');

    $timeout(requiredLabelCheck, 1000);
  };
  requiredLabelCheck();

}]);


appComum.service('preferenciaService', function ($http, $q) {
  var retorno = {};
  var load = function (key) {
    var deferred = $q.defer();
    var preferenciaForm = {};
    preferenciaForm.chave = key;
    $http({
      method: 'POST',
      url: '/api-web/comum/usuario/preferencia/carregar',
      data: preferenciaForm,
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function (data, status, headers, config) {
      if (data.code == 0) {
        if (constants.SETTINGS.DEBUG) {
          console.log("preferência recuperada");
        }
        deferred.resolve(data);
      } else if (data.code == -1) {
        if (constants.SETTINGS.DEBUG) {
          console.log("preferência não cadastrada.");
        }
        deferred.resolve(data);
      } else {
        if (constants.SETTINGS.DEBUG) {
          console.log("Erro ao carregar preferência");
        }
        deferred.resolve(data);
      }
    }).error(function (data, status, headers, config) {
      if (constants.SETTINGS.DEBUG) {
        console.log("Erro ao salvar preferência");
      }
      retorno.code = -99;
      deferred.resolve(retorno);
    });
    return deferred.promise;
  };

  var save = function (key, value) {
    var retorno = {};
    var preferenciaForm = {};
    preferenciaForm.chave = key;
    preferenciaForm.valor = value;
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: '/api-web/comum/usuario/preferencia/salvar',
      data: preferenciaForm,
      headers: {'Content-Type': 'application/json'}
    })
      .success(function (data, status, headers, config) {
        if (data.code == 0) {
          if (constants.SETTINGS.DEBUG) {
            console.log("preferência salva");
          }

          deferred.resolve(data);
        } else {
          if (constants.SETTINGS.DEBUG) {
            console.log("Erro ao salvar preferência");
          }
          deferred.resolve(data);
        }
      })
      .error(function (data, status, headers, config) {
        if (constants.SETTINGS.DEBUG) {
          console.log("Erro ao salvar preferência");
        }
        retorno.code = -99;
        deferred.resolve(retorno);
      });
    return deferred.promise;
  };

  return {
    load: load,
    save: save
  };
});

appComum.controller('PageTooltipController', ['$rootScope', '$scope', '$window', '$uibModal', function ($rootScope, $scope, $window, $uibModal) {

  $scope.tutorialEnabled = false;
  $scope.tutorial = false;
  $scope.indication = false;

  $scope.$on(constants.EVENTS.TUTORIAL_ENABLE, function () {
    $scope.tutorialEnabled = true;
  });

  $scope.openVideosModal = function () {

    var videoName = $rootScope.buildVideoName($window.location.pathname);
    var url = $rootScope.getUrlVideo(videoName);

    $uibModal.open({
      templateUrl: '/portal/app/UI-Comum/partials/modals/vr-video.html',
      controller: 'VideoModalCtrl',
      backdrop: 'static',
      keyboard: false,
      resolve: {
        urlVideo: function () {
          return url;
        },
        video: function () {
          return videoName;
        }
      }
    });
  };

  $scope.isTutorialEnabled = function () {
    return $scope.tutorialEnabled;
  };

  $scope.isEcDashboard = function () {
    return $window.location.pathname.indexOf('estabelecimentos') > 0;
  };

  $scope.startTutorial = function () {
    $scope.tutorial = false;
    $rootScope.$broadcast(constants.EVENTS.TUTORIAL_START);
  };

  $scope.goToIndique = function () {
    $window.location = 'guia-vr.html#addplace';
  };

  $scope.goToAdicione = function () {
    $window.location = "credenciamento-contato-ec.html#confirmation";
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('PageTooltipController', $scope);
  }

}]);

appComum.controller('VideoModalCtrl', ['$rootScope', '$scope', '$uibModalInstance', 'vrModalCustomize', 'urlVideo', 'video', '$sce', function ($rootScope, $scope, $uibModalInstance, vrModalCustomize, urlVideo, video, $sce) {
  $scope.urlVideo = $sce.trustAsResourceUrl(urlVideo);
  $scope.videoName = video;

  $scope.onstate = "awaiting";
  $scope.LOADING = false;


  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
    if ($scope.videoName != undefined) {
      $rootScope.$broadcast(constants.EVENTS.TUTORIAL_PREFERENCE, {pageName: $scope.videoName});
    }
  };

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
    if ($scope.videoName != undefined) {
      $rootScope.$broadcast(constants.EVENTS.TUTORIAL_PREFERENCE, {pageName: $scope.videoName});
    }
  };

  $scope.changeState = function (state) {
    $scope.onstate = state;
  };

  vrModalCustomize.toCenter($uibModalInstance);

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('VideoModalCtrl', $scope);
  }

}]);
