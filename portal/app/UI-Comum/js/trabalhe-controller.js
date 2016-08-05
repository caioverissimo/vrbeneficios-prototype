appComum.controller('TrabalheNaVrController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {

  $scope.curriculumFile = null;
  $scope.candidate = {};
  $scope.candidate.name = "";
  $scope.candidate.email = "";
  $scope.candidate.celular = "";
  $scope.candidate.linkedin = "";
  $scope.candidate.occupationArea = "";
  $scope.candidate.curriculum = "";
  $scope.candidate.message = "";
  $scope.occupationAreaOptions = [
    {
      'name': 'Recursos Humanos'
    },
    {
      'name': 'Tecnologia'
    },
    {
      'name': 'Contabilidade'
    },
    {
      'name': 'Security Office'
    },
    {
      'name': 'Supply Chain'
    },
    {
      'name': 'Jurídico'
    },
    {
      'name': 'Marketing'
    },
    {
      'name': 'Vendas'
    },
    {
      'name': 'Estabelecimentos'
    },
    {
      'name': 'Atendimento ao Cliente'
    }
  ];

  constants.TRABALHE_NA_VR_MESSAGES = {
    TRABALHE_NA_VR_SUCCESS_MESSAGE: 'Sua mensagem foi enviada com sucesso. Em breve retornaremos o contato.',
    DEFAULT_ERROR_MESSAGE: 'Não foi possível completar a sua operação. Por favor, tente novamente mais tarde.'
  };

  $scope.fileSelected = function () {
    $scope.curriculumFile = event.target.files[0];
  };

  $scope.saveCandidate = function () {
    $scope.LOADING = true;
    var file = angular.element('#candidateCurriculumUpload');


    $http(
      {
        method: 'POST',
        url: '/api-web/comum/trabalhe-vr/enviar',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: {
          "nome": $scope.candidate.name,
          "email": $scope.candidate.email,
          "linkedin": "http://www.linkedin.com/in/" + $scope.candidate.linkedin,
          "areaAtuacao": $scope.candidate.occupationArea.name,
          "telefone": $scope.candidate.celular,
          "mensagem": $scope.candidate.message,
          "curriculo": $scope.curriculumFile
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
        if (status == 200) {
          resetForm();
          $scope.feedbacks = [{
            type: 'success',
            msg: constants.TRABALHE_NA_VR_MESSAGES.TRABALHE_NA_VR_SUCCESS_MESSAGE
          }];
        } else {
          $scope.feedbacks = [{
            type: 'danger',
            msg: constants.TRABALHE_NA_VR_MESSAGES.DEFAULT_ERROR_MESSAGE
          }];
        }
      })
      .error(function (data, status, headers, config) {
        $scope.LOADING = false;
        $scope.feedbacks = [{
          type: 'danger',
          msg: constants.TRABALHE_NA_VR_MESSAGES.DEFAULT_ERROR_MESSAGE
        }];
      });
  };

  $scope.openFileInputBySelector = function (inputSelector) {
    angular.element(inputSelector).click();
  };

  function resetForm() {
    $scope.candidate = {};
    $scope.workAtVr.$setPristine();
  }

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('TrabalheNaVrController', $scope);
  }

}]);
