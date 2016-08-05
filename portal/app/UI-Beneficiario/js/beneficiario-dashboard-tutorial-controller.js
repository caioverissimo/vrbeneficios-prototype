appBeneficiario.controller('BeneficiarioDashboardTutorialController', ['$rootScope', '$scope', '$timeout', function ($rootScope, $scope, $timeout) {
  $scope.stepContent = [{
    title: 'Menu de navegação com as principais funções do painel Você.',
    items: ['Acesso rápido ao resumo, extrato de consumo por produto VR Benefícios e Rede Credenciada']
  }, {
    title: 'Mantenha seus dados cadastrais atualizados.'
  }, {
    title: 'Resumo de consumo por produto VR Benefícios.',
    items: [
      'Selecione o produto para consulta;',
      'Acesso rápido ao saldo e gasto médio;',
      'Alerta de saldo disponível;',
      'Bloqueio ou alteração de senha do cartão.'
    ]
  }, {
    title: 'Consulte a Rede Credenciada VR Benefícios.',
    items: [
      'Busca por ponto de referência;',
      'Busca por nome do estabelecimento;',
      'Adicione estabelecimentos aos seus favoritos.'
    ]
  }, {
    title: 'Resumo do extrato do cartão selecionado no menu Meus Cartões.',
    items: [
      'Visualização das últimas transações;',
      'VER EXTRATO COMPLETO: consulta extrato detalhado.'
    ]
  }, {
    title: 'Análise da utilização do cartão selecionado no menu Meus Cartões.',
    items: [
      'Selecione o perído para consulta;',
      'Filtro para estabelecimentos mais visitados ou valores em reais.'
    ]
  }, {
    title: 'Menu de interação do painel de controle.',
    items: [
      'Acesso a este tutorial;',
      'Vídeo de introdução;',
      'Indique um estabelecimento.'
    ]
  }];

  var iniciarTutorial = function () {
    $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_VIEW, {view: 'mycards'});
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

  $timeout(function () {
    $rootScope.$broadcast(constants.EVENTS.TUTORIAL_ENABLE);
  }, 3000);

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('BeneficiarioDashboardTutorialController', $scope);
  }

}]);
