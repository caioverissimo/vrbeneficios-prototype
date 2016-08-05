appBeneficiario.controller('MinhaContaController', ['$scope', '$window', '$uibModal', '$timeout', function ($scope, $window, $uibModal, $timeout) {

  $scope.generalInfo = {};
  $scope.transientPicture = null;

  $scope.getPicture = function () {
    return $scope.picture;
  };

  $scope.hasPicture = function () {
    return $scope.picture !== null && $scope.picture !== undefined;
  };

  $scope.insertPicture = function () {
    angular.element('#accountImageUpload').click();
  };

  $scope.removePicture = function () {
    angular.element('#accountImageUpload')[0].value = '';
    delete $scope.picture;
  };

  $scope.openConfirmationModal = function () {
    var modal = $uibModal.open({
      template: angular.element('#confirmationModalTemplate')[0].innerHTML,
      controller: 'AlterarDadosConfirmacaoController',
      resolve: {
        changedImportantData: function () {
          return ($scope.generalInfo.cpf !== $scope.generalInfo.previousCpf) || ($scope.generalInfo.dataNascimento !== $scope.generalInfo.previousDataNascimento);
        }
      }
    });

    modal.result.then(function (result) {
      if (result === 'confirm') {
        $scope.save();
      }
    });

  };

  $scope.openEmailModal = function () {
    $uibModal.open({
      template: angular.element('#emailChangeModalTemplate')[0].innerHTML,
      controller: 'AlterarEmailController'
    });
  };

  $scope.save = function () {
    angular.element('form[name="generalInfoForm"]').submit();
  };

  // tratamento de mudança de cpf (muda mensagem de confirmação)
  $scope.$watch('generalInfo.cpf', function (newVal) {
    if (!$scope.generalInfo.previousCpf) {
      $scope.generalInfo.previousCpf = newVal;
    }
  });

  // tratamento de mudança de data de nascimento (muda mensagem de confirmação)
  $scope.$watch('generalInfo.dataNascimento', function (newVal) {
    if (!$scope.generalInfo.previousDataNascimento) {
      $scope.generalInfo.previousDataNascimento = newVal;
    }
  });

  // implementado como loop em timeout pois watch nao funciona com essa diretiva de image
  var checkTransientPicture = function () {
    if ($scope.transientPicture) {
      $scope.picture = $scope.transientPicture.resized.dataURL;
      delete $scope.transientPicture;
    }
    $timeout(checkTransientPicture, 1000);
  };

  // primeira execução
  checkTransientPicture();

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('MinhaContaController', $scope);
  }

}]);

appBeneficiario.controller('AlterarDadosConfirmacaoController', ['$scope', '$uibModalInstance', 'changedImportantData', function ($scope, $uibModalInstance, changedImportantData) {
  $scope.changedImportantData = changedImportantData;

  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
  };

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('AlterarDadosConfirmacaoController', $scope);
  }

}]);

appBeneficiario.controller('AlterarEmailController', ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
  $scope.LOADING = false;

  $scope.FINAL_STATE = false;

  $scope.cancel = function () {
    $uibModalInstance.dismiss();
  };

  $scope.alterarEmail = function () {
    $scope.LOADING = true;

    $timeout(function () {
      $scope.LOADING = false;
      $scope.FINAL_STATE = true;
    }, 2000);
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('AlterarEmailController', $scope);
  }

}]);
