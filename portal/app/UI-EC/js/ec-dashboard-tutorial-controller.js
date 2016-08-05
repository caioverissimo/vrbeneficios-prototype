appEC.controller('ECDashboardTutorialController', ['$rootScope', '$scope', '$timeout', function ($rootScope, $scope, $timeout) {
  $scope.stepContent = [
    {
      title: 'Menu de navegação com as principais funções do painel Estabelecimentos.',
      items: ['Acesso rápido ao extrato de vendas ou Antecipação de Reembolso, Dados do Estabelecimento cadastrado e Informe de Rendimentos']
    }, {
      title: 'Controle do cliente',
      items: ['Mantenha seus dados cadastrais atualizados.']
    }, {
      title: 'Seleção dos estabelecimentos ou filiais cadastradas'
    }, {
      title: 'Resumo das vendas realizadas pelo seu estabelecimento, por produto VR Benefícios.',
      items: [
        'Selecione o produto para consulta;',
        'Total das vendas nas últimas 4 semanas;',
        'Média de vendas semanal;',
        'VER MAIS: consulta do extrato detalhado.'
      ]
    }, {
      title: 'Antecipe o seu reembolso aqui no site.',
      items: [
        'Detalhamento de valor disponível;',
        'Contratação de Antecipação Automática;',
        'CONTRATE AGORA: para receber seu reembolso no dia seguinte.'
      ]
    }, {
      title: 'Consulte os seus reembolsos.',
      items: [
        'Consulta por produto contratado;',
        'Reembolsos pagos;',
        'Data dos próximos reembolsos;',
        'VER MAIS: extrato detalhado das vendas pagas em cada reembolso.'
      ]
    }, {
      title: 'Mantenha seus dados cadastrais atualizados.',
      items: [
        'Consulta e atualização de dados gerais;',
        'VER MAIS: atualização de dados bancários e solicitação de adesivos para sinalização.'
      ]
    }, {
      title: 'Menu de interação do painel de controle.',
      items: [
        'Acesso a este tutorial;',
        'Vídeo de introdução;',
        'Adicione um estabelecimento ao seu cadastro.'
      ]
    }];

  var iniciarTutorial = function () {
    $scope.currentStep = 1;
  };

  $scope.$on(constants.EVENTS.TUTORIAL_START, function () {
    iniciarTutorial();
  });

  $scope.nextStep = function () {
    $scope.currentStep++;
  };

  $scope.markElement = function (selector) {
    var elements = angular.element('.tour-element-active');
    for (var i = 0; i < elements.length; i++) {
      angular.element(elements[i]).removeClass('tour-element-active');
    }
    angular.element(selector).addClass('tour-element-active');
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ECDashboardTutorialController', $scope);
  }

  $timeout(function () {
    $rootScope.$broadcast(constants.EVENTS.TUTORIAL_ENABLE);
  }, 3000);


}]);
