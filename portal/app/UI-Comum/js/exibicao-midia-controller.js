appComum.controller('ExibicaoMidiaController', ['$rootScope', '$scope', '$window', '$uibModal', 'preferenciaService', function ($rootScope, $scope, $window, $uibModal, preferenciaService) {

  $scope.showVideo = function (videoName) {
    var preferencia = preferenciaService.load(videoName);
    preferencia.then(function (preferencia) {
      if ((preferencia.code == -1 || (preferencia.code == 0 && preferencia.valor !== "true"))) {
        preferenciaService.save(videoName, "true");
        var url = $rootScope.getUrlVideo(videoName);
        $scope.openVideosModal(url, videoName);
      } else {
        $scope.startTutorial(videoName);
      }
    });
  };


  $scope.openVideosModalAreaAberta = function (videoName) {
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

  $scope.openVideosModal = function (url, videoName) {
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

  $scope.startTutorial = function (videoName) {
    // se não apresentou modal de primeiro acesso
    if (!$rootScope.isFirstLogin()) {
      if ($rootScope.isInDashboardBen() || $rootScope.isInDashboardEC()) {
        var tutorialPref = videoName.replace("VIDEO_", "TUTORIAL_");
        var preferencia = preferenciaService.load(tutorialPref);
        preferencia.then(function (preferencia) {
          if ((preferencia.code == -1 || (preferencia.code == 0 && preferencia.valor !== "true"))) {
            preferenciaService.save(tutorialPref, "true");
            $rootScope.$broadcast(constants.EVENTS.TUTORIAL_START);
          }
        });
      }
    }
  };

  $rootScope.$on(constants.EVENTS.SHOW_VIDEO, function (event, data) {
    if (data) {
      $scope.showVideo($rootScope.buildVideoName(data.pageName));
    }
  });

  $rootScope.$on(constants.EVENTS.TUTORIAL_PREFERENCE, function (event, data) {
    if (data) {
      $scope.startTutorial(data.pageName);
    }
  });

  $scope.showVideoBeneficiario = function () {
    if ($rootScope.isInDashboardBen()
      || $window.location.pathname.indexOf('extrato.html') > -1
      || $window.location.pathname.indexOf('guia-vr.html') > -1) {

      $scope.showVideo($rootScope.buildVideoName($window.location.pathname));
    }
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ExibicaoMidiaController', $scope);
  }

  // ajuste para chamar video de beneficiario somente em seu dashboard
  // somente se não apresentou modal de primeiro acesso
  if ($rootScope.isInDashboardBen()) {

    // se não apresentou modal de primeiro acesso, exibe o video
    if (!$rootScope.isFirstLogin()) {
      $scope.showVideoBeneficiario();
    }

  }

}]);

