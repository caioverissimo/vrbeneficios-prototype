appBeneficiario.controller('PromotionsController', ['$scope', '$window', '$timeout', function ($scope, $window, $timeout) {

  $scope.promotions = null;
  $scope.pagination = null;

  $scope.LOADING = true;

  $scope.hasContent = function () {
    return $scope.promotions !== null && $scope.promotions.length > 0 && $scope.LOADING === false;
  };

  $scope.hasPagination = function () {
    return ($scope.pagination !== null && $scope.pagination.length > 0);
  };

  $scope.hasNoContent = function () {
    return ($scope.promotions === null || $scope.promotions.length < 1) && $scope.LOADING === false;
  };

  $timeout(function () {
    $scope.promotions = [{
      iconClass: 'icon-icon_carro',
      placeId: 'A',
      place: 'Posto Mauritânia',
      textPrefix: 'Ducha Grátis',
      textSuffix: 'com R$ 100,00 de abastecimento',
      expires: '20/12/2015' // vamos trabalhar com timestamp e filter... esse é só um placeholder
    }, {
      iconClass: 'icon-icon_carro',
      placeId: 'B',
      place: 'Posto Fênix',
      textPrefix: 'Troca de óleo',
      textSuffix: 'com R$ 200,00 de abastecimento',
      expires: '20/12/2015'
    }];

    $scope.promotionsTable = [{
      row: 1,
      promotions: [{
        iconClass: 'icon-icon_carro',
        placeId: 'A',
        place: 'Posto Mauritânia',
        textPrefix: 'Ducha Grátis',
        textSuffix: 'com R$ 100,00 de abastecimento',
        expires: '20/12/2015' // vamos trabalhar com timestamp e filter... esse é só um placeholder
      }, {
        iconClass: 'icon-icon_carro',
        placeId: 'B',
        place: 'Posto Fênix',
        textPrefix: 'Troca de óleo',
        textSuffix: 'com R$ 200,00 de abastecimento',
        expires: '20/12/2015'
      }]
    }, {
      row: 2,
      promotions: [{
        iconClass: 'icon-icon_carro',
        placeId: 'A',
        place: 'Posto Mauritânia 2',
        textPrefix: 'Ducha Grátis',
        textSuffix: 'com R$ 200,00 de abastecimento',
        expires: '20/12/2015' // vamos trabalhar com timestamp e filter... esse é só um placeholder
      }, {
        iconClass: 'icon-icon_carro',
        placeId: 'B',
        place: 'Posto Fênix 2',
        textPrefix: 'Troca de óleo',
        textSuffix: 'com R$ 200,00 de abastecimento',
        expires: '20/12/2015'
      }]
    }, {
      row: 3,
      promotions: [{
        iconClass: 'icon-icon_carro',
        placeId: 'A',
        place: 'Posto Mauritânia 3',
        textPrefix: 'Ducha Grátis',
        textSuffix: 'com R$ 100,00 de abastecimento',
        expires: '20/12/2015' // vamos trabalhar com timestamp e filter... esse é só um placeholder
      }, {
        iconClass: 'icon-icon_carro',
        placeId: 'B',
        place: 'Posto Fênix 3',
        textPrefix: 'Troca de óleo',
        textSuffix: 'com R$ 200,00 de abastecimento',
        expires: '20/12/2015'
      }]
    }, {
      row: 4,
      promotions: [{
        iconClass: 'icon-icon_carro',
        placeId: 'A',
        place: 'Posto Mauritânia 4',
        textPrefix: 'Ducha Grátis',
        textSuffix: 'com R$ 100,00 de abastecimento',
        expires: '20/12/2015' // vamos trabalhar com timestamp e filter... esse é só um placeholder
      }, {
        iconClass: 'icon-icon_carro',
        placeId: 'B',
        place: 'Posto Fênix 4',
        textPrefix: 'Troca de óleo',
        textSuffix: 'com R$ 200,00 de abastecimento',
        expires: '20/12/2015'
      }]
    }, {
      row: 5,
      promotions: [{
        iconClass: 'icon-icon_carro',
        placeId: 'A',
        place: 'Posto Mauritânia 5',
        textPrefix: 'Ducha Grátis',
        textSuffix: 'com R$ 100,00 de abastecimento',
        expires: '20/12/2015' // vamos trabalhar com timestamp e filter... esse é só um placeholder
      }, {
        iconClass: 'icon-icon_carro',
        placeId: 'B',
        place: 'Posto Fênix 5',
        textPrefix: 'Troca de óleo',
        textSuffix: 'com R$ 200,00 de abastecimento',
        expires: '20/12/2015'
      }]
    }];

    $scope.pagination = [{
      path: '/test',
      start: 1,
      length: 15
    }, {
      path: '/test',
      start: 16,
      length: 15
    }, {
      path: '/test',
      start: 31,
      length: 15
    }];

    $scope.LOADING = false;
  }, 3000);

  $scope.goToMap = function (item) {
    $window.location = 'guia-vr.html#network';
  };

  $scope.remove = function (item) {
    var index = $scope.promotions.indexOf(item);
    $scope.promotions.splice(index, 1);
  };
}]);

appBeneficiario.controller('NetworkSearcherController', ['$scope', '$http','$timeout', function ($scope, $http, $timeout) {

  $scope.displayResults = false;
  $scope.substate = "redecredenciada";
  $scope.userPosition = [0, 0];
  $scope.menuMapDisplay = false;

  $scope.currentPage = 1;
  $scope.totalPages = 2;

  // consulta serviço para verificar se há novas promoções
  // $http({
  //   method: 'POST',
  //   url: '/api-web/beneficiario/promocoes/consultar-qtd-novas-promocoes',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }).success(
  //   function (data, status, headers, config) {
  //     if (data > 0) {
  //       $scope.hasNews = true;
  //     }
  //   }).error(
  //   function (data, status) {
  //     if (data && data.message) {
  //       console.error("Erro ao verificar se há novas promoções para o usuário: " + data.message);
  //     } else {
  //       console.error("Erro ao verificar se há novas promoções para o usuário: ERRO INDEFINIDO. status: " + status);
  //     }
  //   });

  $scope.toggleMapMenu = function () {
    $scope.menuMapDisplay = !$scope.menuMapDisplay;
  };

  $scope.getSearchResults = function() {
    $scope.LOADING = true;
    $timeout(function(){
      $scope.LOADING = false;
    }, 500);

  };

  $scope.setSubstate = function (url) {
    $scope.substate = url;
    if (url === 'promocoes') {
      $scope.hasNews = false;

      //chama serviço para marcar que o usuário já viu as novas promoções
      $http({
        method: 'POST',
        url: '/api-web/beneficiario/promocoes/salvar-visualizacao-novas-promocoes',
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(
        function (data, status, headers, config) {
          if (data) {
            $scope.hasNews = false;
          }
        }).error(
        function (data) {
          if (data.message != null) {
            console.error("Erro ao verificar se há novas promoções para o usuário: " + data.message);
          }
        });
    }
  };

  $scope.getUserPosition = function () {
    navigator.geolocation.getCurrentPosition(function (position) {
      $scope.userPosition = [
        position.coords.latitude,
        position.coords.longitude];
    });
  };

  $scope.getUserPosition();

}]);


/**
 * Controller mockup para notificações -> eu tentaria padronizar a entrada de dados e separaria os
 * controllers por arquivo além de criar serviços para buscar os dados nos server
 **/
appBeneficiario.controller('NotificationsController', ['$scope', '$window', '$timeout', function ($scope, $window, $timeout) {

  $scope.LOADING = true;

  $timeout(function () {
    $scope.data = [{
      row: 1,
      notifications: [{
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }, {
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }]
    }, {
      row: 2,
      notifications: [{
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }, {
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }]
    }, {
      row: 3,
      notifications: [{
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }, {
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }]
    }, {
      row: 4,
      notifications: [{
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }, {
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }]
    }, {
      row: 5,
      notifications: [{
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }, {
        iconClass: 'icon-icon_notificacao_off',
        text: 'Seu saldo está próximo a R$ 400,00',
        from: '2 horas atrás'
      }]
    }];

    $scope.LOADING = false;
  }, 3000);
}]);

// appBeneficiario.controller('MinhaContaController', ['$scope', '$window', '$uibModal', '$timeout', function ($scope, $window, $uibModal, $timeout) {
//   console.log('ATENÇÃO: ui-beneficiario-app-development.js sobrescrevendo MinhaContaController para simular comportamento sem backend... ');
//
//   $scope.LOADING = false;
//   $scope.feedbacks = [];
//
//   $scope.generalInfo = {};
//
//   $scope.insertPicture = function () {
//     angular.element('#accountImageUpload').click();
//   };
//
//   $scope.openEmailModal = function () {
//     $uibModal.open({
//       template: angular.element('#emailChangeModalTemplate')[0].innerHTML,
//       controller: 'AlterarEmailController'
//     });
//   };
//
//   $scope.openConfirmationModal = function () {
//     var modal = $uibModal.open({
//       template: angular.element('#confirmationModalTemplate')[0].innerHTML,
//       controller: 'ModalCtrl'
//     });
//
//     modal.result.then(function (result) {
//       if (result === 'confirm') {
//         $scope.save();
//       }
//     });
//
//   };
//
//   $scope.save = function () {
//     $scope.LOADING = true;
//
//     $timeout(function () {
//       $scope.LOADING = false;
//       $scope.feedbacks.push({
//         msg: 'Conta salva com sucesso.'
//       });
//     }, 2000);
//
//   };
//
// }]);

/**
 * Controller mockup para notificações -> eu tentaria padronizar a entrada de dados e separaria os
 * controllers por arquivo além de criar serviços para buscar os dados nos server
 **/
appBeneficiario.controller('FavsController', ['$scope', '$window', '$timeout', function ($scope, $window, $timeout) {

  $scope.LOADING = true;
  $scope.data = null;

  $scope.hasNoContent = function () {
    return ($scope.data === null || $scope.data.length < 1) && $scope.LOADING === false;
  };

  $scope.hasContent = function () {
    return $scope.data !== null && $scope.data.length > 0 && $scope.LOADING === false;
  };

  $scope.toggleFav = function (fav) {
    fav.active = !fav.active;
  };

  $scope.goToMap = function (item) {
    $window.location = '/beneficiario/guia-vr.html#network';
  };

  $timeout(function () {
    $scope.data = [{
      row: 1,
      favs: [{
        active: false,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }, {
        active: false,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }]
    }, {
      row: 2,
      favs: [{
        active: true,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }, {
        active: true,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }]
    }, {
      row: 3,
      favs: [{
        active: true,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }, {
        active: true,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }]
    }, {
      row: 4,
      favs: [{
        active: true,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }, {
        active: true,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }]
    }, {
      row: 5,
      favs: [{
        active: true,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }, {
        active: true,
        title: 'Posto Mauritânia',
        place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
      }]
    }];

    $scope.LOADING = false;
  }, 3000);
}]);

appBeneficiario.controller('AccountPasswordController', ['$scope', '$timeout', function ($scope, $timeout) {
  $scope.LOADING = false;

  $scope.feedbacks = [];

  $scope.changePassword = function () {
    $scope.LOADING = true;
    $timeout(function () {
      $scope.LOADING = false;
      $scope.feedbacks.push({
        msg: 'Senha alterada com sucesso.'
      });
    }, 3000);
  };

}]);


// var constants = {
//   ENDPOINTS: {
//     MOCK: {
//       PAINEL: 'http://localhost:3031/vr/beneficiario/'
//     }
//   },
//   EVENTS: {
//     CARD_CONFIRMATION: 'Card.confirmation',
//     CARD_SELECTED: 'Card.selected',
//     ESTABLISHMENT_SELECTED: 'Establishment.selected',
//     HTTP_ERROR: 'Http.error',
//     NAVIGATION_SET_PRODUCTS: 'Navigation.setProducts',
//     NAVIGATION_SET_VIEW: 'Navigation.setView',
//     NAVIGATION_SET_VIEW_PRODUCT: 'Navigation.setViewProduct'
//   },
//   MEDIA_QUERIES: {
//     MOBILE_SCREEN: '(max-width: 768px)'
//   },
//   MESSAGES: {
//     DEFAULT_SUCCESS_MESSAGE: 'Sua solicitação foi enviada com sucesso!',
//     GEOLOCATION_UNAVAILABLE: 'Geolocalização indisponível.'
//   },
//   SESSION_STORAGE: {
//     ESTABLISHMENT_SELECTED: 'Establishment.selected'
//   }
// };
//
// var app = angular.module('app', [
//   'angular-chartist',
//   'ngMap',
//   'ui.bootstrap',
//   'ngMessages',
//   'ui.mask',
//   'angular-loading-bar',
//   'pickadate',
//   'ngCpfCnpj',
//   'vcRecaptcha',
//   'uiGmapgoogle-maps',
//   'imageupload'
// ]);
//
// //app.controller('ReferenceController', ['$scope', '$timeout', function ($scope, $timeout) {
// //  $scope.LOADING = false;
// //  $scope.LOCKED = true;
// //
// //  $scope.data = null;
// //
// //  $scope.hasContent = function () {
// //    return $scope.data !== null && $scope.data.length > 0 && $scope.LOADING === false;
// //  };
// //
// //  $scope.hasNoContent = function () {
// //    return ($scope.data === null || $scope.data.length < 1) && $scope.LOADING === false;
// //  };
// //
// // $scope.triggerAction = function () {
// //    $scope.LOADING = true;
// //    $timeout(function () {
// //      $scope.LOADING = false;
// //    }, 3000);
// //  };
// //
// //}]);
//
// /* LOADING INICIAL */
// app.run(['$timeout', function ($timeout) {
//   $timeout(function () {
//     angular.element(document.body).removeClass('loading-pane');
//     angular.element(document.querySelector('.front-loading-wrapper')).remove();
//   }, 2000); // 2 segundos
// }]);
//
// // definição de funções comuns reutilizaveis em todos os escopos por meio do rootscope
// app.run(['$rootScope', '$window', function ($rootScope, $window) {
//   $rootScope.urlQueryValue = function (param) {
//     if ($window.location.search) {
//       var query = $window.location.search.substring(1);
//       var vars = query.split('&');
//       for (var i = 0; i < vars.length; i++) {
//         var pair = vars[i].split('=');
//         if (decodeURIComponent(pair[0]) === param) {
//           return decodeURIComponent(pair[1]);
//         }
//       }
//     }
//   };
//
//   $rootScope.usingMocks = function () {
//     return $rootScope.urlQueryValue('mocks');
//   };
//
//   $rootScope.httpErrorCallback = function (response) {
//     $rootScope.$broadcast(constants.EVENTS.HTTP_ERROR, {response: response});
//   };
//
//   // Seleção e propagação de estabelecimento ativo entre páginas
//   var activeEstablishment = null;
//   var activeEstablishmentJson = $window.sessionStorage.getItem(constants.SESSION_STORAGE.ESTABLISHMENT_SELECTED);
//   if (activeEstablishmentJson) {
//     activeEstablishment = JSON.parse(activeEstablishmentJson);
//   }
//
//   $rootScope.getActiveEstablishment = function () {
//     return activeEstablishment;
//   };
//
//   $rootScope.$on(constants.EVENTS.ESTABLISHMENT_SELECTED, function (event, data) {
//     activeEstablishment = data.activeEstablishment;
//     $window.sessionStorage.setItem(constants.SESSION_STORAGE.ESTABLISHMENT_SELECTED, JSON.stringify(activeEstablishment));
//   });
//
//   $rootScope.hasActiveEstablishment = function () {
//     var activeEstablishment = $rootScope.getActiveEstablishment();
//     return activeEstablishment !== null && activeEstablishment !== undefined;
//   };
//
// }]);
//
// app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
//   cfpLoadingBarProvider.includeSpinner = false;
// }]);
//
//
// //https://angular-ui.github.io/angular-google-maps/#!/use
// app.config(function (uiGmapGoogleMapApiProvider) {
//   uiGmapGoogleMapApiProvider.configure({
//     //    key: 'your api key',
//     libraries: 'places'
//   });
// });
//
//
//
// app.controller('AccountPasswordController', ['$scope', '$timeout', function ($scope, $timeout) {
//   $scope.LOADING = false;
//
//   $scope.triggerAction = function () {
//     $scope.LOADING = true;
//     $timeout(function () {
//       $scope.LOADING = false;
//     }, 3000);
//   };
//
// }]);
//
//
// app.controller('IncomeController', ['$scope', '$timeout', function ($scope, $timeout) {
//   $scope.LOADING = true;
//
//   $scope.data = null;
//
//   $scope.hasContent = function () {
//     return $scope.data !== null && $scope.data.length > 0 && $scope.LOADING === false;
//   };
//
//   $scope.hasNoContent = function () {
//     return ($scope.data === null || $scope.data.length < 1) && $scope.LOADING === false || !$scope.hasActiveEstablishment();
//   };
//
//   $timeout(function () {
//     $scope.LOADING = false;
//
//     if ($scope.hasActiveEstablishment()) {
//       $scope.data = [{
//         fileName: 'IR_2015_1111111111.pdf',
//         fileUri: '/path/to/IR_2015_1111111111.pdf'
//       }, {
//         fileName: 'IR_2015_1111111112.pdf',
//         fileUri: '/path/to/IR_2015_1111111112.pdf'
//       }, {
//         fileName: 'IR_2015_1111111113.pdf',
//         fileUri: '/path/to/IR_2015_1111111113.pdf'
//       }];
//     }
//
//   }, 3000);
//
// }]);
//
//
// //CONFIG DA BARRA DE LOADING
//
// /**
//  * Controller de extrato
//  */
// app.controller('ExtractController', ['$rootScope', '$scope', '$timeout', '$window', function ($rootScope, $scope, $timeout, $window) {
//   $scope.LOADING = true;
//
//   $scope.cards = null;
//   $scope.activeCard = null;
//   $scope.pagination = null;
//
//   $scope.hasContent = function () {
//     return $scope.cards !== null && $scope.cards.length > 0 && $scope.LOADING === false;
//   };
//
//   $scope.hasNoContent = function () {
//     return ($scope.cards === null || $scope.cards.length < 1) && $scope.LOADING === false;
//   };
//
//   $scope.print = function () {
//     $window.print();
//   };
//
//   $scope.setActive = function (card) {
//     $scope.activeCard = card;
//   };
//
//   $scope.cardClass = function (card) {
//     var cardClass = '';
//     if ($scope.activeCard === card) {
//       cardClass += 'active';
//     }
//     return cardClass;
//   };
//
//   $scope.changeRange = function () {
//     $scope.LOADING = true;
//     // Substituir por função ajax
//     $timeout(function () {
//       $scope.LOADING = false;
//     }, 3 * 1000); // 3 segundos
//   };
//
//   $scope.hasPagination = function () {
//     return ($scope.pagination !== null && $scope.pagination.length > 0);
//   };
//
//   $timeout(function () {
//     $scope.LOADING = false;
//
//     var products = [{
//       id: 'vrrefeicao',
//       label: 'VR Refeição'
//     }, {
//       id: 'vralimentacao',
//       label: 'VR Alimentação'
//     }, {
//       id: 'vrauto',
//       label: 'VR Auto'
//     }, {
//       id: 'vrcultura',
//       label: 'VR Cultura'
//     }];
//
//     $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_PRODUCTS, {
//       products: products
//     });
//
//   }, 1000);
//
//   $scope.$on(constants.EVENTS.NAVIGATION_SET_VIEW_PRODUCT, function (event, data) {
//     $scope.LOADING = true;
//
//     $timeout(function () {
//       $scope.requestDate = '24/12/2015 - 14:42:20 '; // vamos utilizar timestamp com filtro;
//       $scope.cards = [{
//         endNumber: '0042',
//         ballance: '159,90', // vamos utilizar valores numericos com filtro
//         expendMean: '21,90', // idem
//         lastDepositValue: '200,00', // idem ao anterior
//         nextDepositDate: '5/11', // vamos utilizar timestamp com filtro
//         events: [{
//           date: '24 de novembro', // idem ao anterior
//           checkouts: [{
//             place: 'Fogo de Chão',
//             aut: '892845',
//             value: '130,00'// vamos utilizar valores numéricos e filtros
//           }, {
//             place: 'Fogo de Chão',
//             aut: '892845',
//             value: '130,00'// vamos utilizar valores numéricos e filtros
//           }]
//         },
//           {
//             date: '23 de novembro', // idem ao anterior
//             checkouts: [{
//               place: 'Fogo de Chão',
//               aut: '892845',
//               value: '130,00'// vamos utilizar valores numéricos e filtros
//             }, {
//               place: 'Fogo de Chão',
//               aut: '892845',
//               value: '130,00'// vamos utilizar valores numéricos e filtros
//             }]
//           }]
//       }, {
//         endNumber: '0039',
//         ballance: '59,90', // vamos utilizar valores numericos com filtro
//         expendMean: '11,90', // idem
//         lastDepositValue: '100,00', // idem
//         nextDepositDate: '1/11', // vamos utilizar timestamp com filtro
//         events: [{
//           date: '22 de novembro', // idem ao anterior
//           checkouts: [{
//             place: 'Fogo de Chão',
//             aut: '892845',
//             value: '1320,00'// vamos utilizar valores numéricos e filtros
//           }, {
//             place: 'Fogo de Chão',
//             aut: '892845',
//             value: '130,00'// vamos utilizar valores numéricos e filtros
//           }]
//         },
//           {
//             date: '21 de novembro', // idem ao anterior
//             checkouts: [{
//               place: 'Fogo de Chão',
//               aut: '892845',
//               value: '1310,00'// vamos utilizar valores numéricos e filtros
//             }, {
//               place: 'Fogo de Chão',
//               aut: '892845',
//               value: '1310,00'// vamos utilizar valores numéricos e filtros
//             }]
//           }]
//       }, {
//         endNumber: '0139',
//         ballance: '19,90', // vamos utilizar valores numericos com filtro
//         expendMean: '41,90', // idem
//         lastDepositValue: '300,00', // idem
//         nextDepositDate: '2/11', // vamos utilizar timestamp com filtro
//         events: [{
//           date: '20 de novembro', // idem ao anterior
//           checkouts: [{
//             place: 'Fogo de Chão',
//             aut: '892845',
//             value: '1030,00'// vamos utilizar valores numéricos e filtros
//           }, {
//             place: 'Fogo de Chão',
//             aut: '892845',
//             value: '1300,00'// vamos utilizar valores numéricos e filtros
//           }]
//         },
//           {
//             date: '19 de novembro', // idem ao anterior
//             checkouts: [{
//               place: 'Fogo de Chão',
//               aut: '892845',
//               value: '11230,00'// vamos utilizar valores numéricos e filtros
//             }, {
//               place: 'Fogo de Chão',
//               aut: '892845',
//               value: '12230,00'// vamos utilizar valores numéricos e filtros
//             }]
//           }]
//       }];
//
//       $scope.activeCard = $scope.cards[0];
//
//       $scope.pagination = [{
//         path: '/test',
//         start: 1,
//         length: 15
//       }, {
//         path: '/test',
//         start: 16,
//         length: 15
//       }, {
//         path: '/test',
//         start: 31,
//         length: 15
//       }];
//
//       $scope.LOADING = false;
//     }, 2 * 1000);
//
//   });
//
// }]);
//
// app.controller('ExtractCardController', ['$scope', '$timeout', function ($scope, $timeout) {
//
//   $scope.LOCKED = true;
//   $scope.LOADING = false;
//
//   $scope.hasContent = function () {
//     return !$scope.LOADING && !$scope.LOCKED;
//   };
//
//   // Substituir por função ajax
//   $timeout(function () {
//     $scope.LOADING = false;
//   }, 3 * 1000); // 3 segundos
//
//   $scope.$on(constants.EVENTS.CARD_SELECTED, function (event, data) {
//     if (data.activeCard !== null) {
//       console.log('ExtractCardController received new active card');
//       console.dir(data.activeCard);
//     }
//   });
//
// }]);
//
//
// /**
//  * Controller das Statistics
//  **/
// app.controller('StatisticsController', ['$scope', '$timeout', function ($scope, $timeout) {
//
//   $scope.chartist = null;
//   $scope.LOADING = false;
//   $scope.LOCKED = true;
//   $scope.activeCard = null;
//
//
//   $scope.hasNoContent = function () {
//     return $scope.chartist === null && !$scope.LOADING && !$scope.LOCKED;
//   };
//
//   $scope.hasContent = function () {
//     return $scope.chartist !== null && !$scope.LOADING && !$scope.LOCKED;
//   };
//
//   $scope.retrieveMiddleChartData = function (part) {
//     return $scope.daysold.split(" ")[part];
//   };
//
//   $scope.triggerAction = function () {
//     $scope.LOADING = true;
//     // Substituir por função ajax
//     $timeout(function () {
//       $scope.hasNoContent = false;
//       $scope.LOADING = false;
//
//       // Chart Data
//       $scope.chartist = {
//         data: {
//           series: [70, 30]
//         },
//         options: {
//           donut: true,
//           strokeWidth: 10,
//           labelInterpolationFnc: function (value) {
//             return value + '%';
//           }
//         }
//       };
//
//     }, 3 * 1000); // 3 segundos
//   };
//
//   $scope.$on(constants.EVENTS.CARD_SELECTED, function (event, data) {
//     if (data.activeCard !== null) {
//       console.log('StatisticsController received new active card');
//       console.dir(data.activeCard);
//     }
//   });
//
// }]);
//
// app.controller('FastSearchController', ['$scope', '$timeout', '$window', function ($scope, $timeout, $window) {
//   $scope.LOADING = false;
//   $scope.cards = null;
//   $scope.helpTooltipIsHidden = true;
//
//   $scope.recapchaSize = function () {
//     var size = '';
//     if ($window.matchMedia(constants.MEDIA_QUERIES.MOBILE_SCREEN).matches) {
//       size = 'compact';
//     } else {
//       size = 'normal';
//     }
//     return size;
//   };
//
//   $scope.hasContent = function () {
//     return $scope.cards !== null && $scope.cards.length > 0 && $scope.LOADING === false;
//   };
//
//   $scope.hasNoContent = function () {
//     return ($scope.cards === null || $scope.cards.length < 1) && $scope.LOADING === false;
//   };
//
//   $scope.triggerAction = function () {
//     $scope.LOADING = true;
//
//     // Substituir por função ajax
//     $timeout(function () {
//       $scope.LOADING = false;
//       $scope.cards = [{
//         endNumber: '0042',
//         ballance: '159,90', // vamos utilizar valores numericos com filtro
//         expendMean: '21,90', // idem
//         lastDepositValue: '200,00', // idem
//         nextDepositDate: '5/11' // vamos utilizar timestamp com filtro
//       }];
//
//     }, 3 * 1000); // 3 segundos
//   }
// }]);
//
// app.controller('CardConfirmationController', ['$scope', '$timeout', function ($scope, $timeout) {
//   $scope.LOADING = false;
//
//   $scope.triggerAction = function () {
//     $scope.LOADING = true;
//     $timeout(function () {
//       $scope.LOADING = false;
//     }, 3000);
//   };
//
// }]);
//
//
// /**
//  *  Controle de estabeleciomentos para adiconar campos
//  **/
// app.controller('EstablishmentConfirmationController', ['$scope', function ($scope) {
//   $scope.establishments = [{CNPJ: "", filiacao: ""}];
//   $scope.addFields = function () {
//     $scope.establishments.push({CNPJ: "", filiacao: ""});
//   };
//   $scope.removeFields = function (index) {
//     $scope.establishments.splice(index, 1);
//   };
// }]);
//
// app.controller('EstablishmentProfileController', ['$scope', '$window', '$timeout', function ($scope, $window, $timeout) {
//   $scope.LOADING = true;
//
//   $scope.data = null;
//
//   $scope.placeImageUpload = null;
//
//   $scope.hasContent = function () {
//     return $scope.data !== null && $scope.LOADING === false;
//   };
//
//   $scope.hasNoContent = function () {
//     return $scope.data === null && $scope.LOADING === false || !$scope.hasActiveEstablishment();
//   };
//
//   $scope.isInDashboard = function () {
//     return $window.location.pathname.indexOf('dashboard.html') > -1;
//   };
//
//   $scope.getCurrentPicture = function () {
//     var currentPicture = null;
//     if ($scope.data && $scope.data.pictures) {
//       for (var i = 0; i < $scope.data.pictures.length; i++) {
//         if ($scope.data.pictures[i].active) {
//           currentPicture = $scope.data.pictures[i];
//         }
//       }
//     }
//     return currentPicture;
//   };
//
//   $scope.$on('placeImageUploadEvent', function (event, data) {
//     $scope.placeImageUpload = data;
//   });
//
//   $scope.$watch('placeImageUpload', function () {
//     if ($scope.placeImageUpload) {
//       // simulação de upload de arquivo
//       console.log('implementar upload real de arquivo e na função de callback adicionar imagem ao array em data');
//       $timeout(function () {
//         var imageData = $scope.placeImageUpload.resized.dataURL;
//         $scope.data.pictures.push({
//           active: false,
//           imgUri: imageData
//         });
//         $scope.placeImageUpload = null;
//       }, 1000);
//     }
//   });
//
//   $scope.insertPicture = function () {
//     $window.document.getElementById('imageUploadInput').click();
//   };
//
//   $scope.removePicture = function (picture) {
//     var index = $scope.data.pictures.indexOf(picture);
//     $scope.data.pictures.splice(index, 1);
//   };
//
//   $scope.setActivePicture = function (picture) {
//     for (var i = 0; i < $scope.data.pictures.length; i++) {
//       if ($scope.data.pictures[i] === picture) {
//         $scope.data.pictures[i].active = true;
//       } else {
//         $scope.data.pictures[i].active = false;
//       }
//     }
//   };
//
//   $scope.hasProduct = function (productId) {
//     return true;
//   };
//
//   $timeout(function () {
//     $scope.LOADING = false;
//     if ($scope.hasActiveEstablishment()) {
//       $scope.data = $scope.getActiveEstablishment();
//       $scope.data.pictures = [{
//         active: true,
//         imgUri: '/portal/img/avatar-estb.jpg'
//       }];
//
//       $scope.feedbacks = [{
//         type: 'warning',
//         msg: 'Mensagem de atenção de exemplo'
//       }];
//     }
//
//   }, 3000);
//
// }]);
//
// app.controller('PlaceIndicationController', ['$scope', '$timeout', '$window', 'uiGmapGoogleMapApi', function ($scope, $timeout, $window, uiGmapGoogleMapApi) {
//   $scope.LOADING = false;
//   $scope.feedbacks = null;
//
//   $scope.closeFeedback = function (index) {
//     $scope.feedbacks.splice(index, 1);
//   };
//
//   $scope.geolocation = function () {
//     $scope.LOADING = true;
//     if ($window.navigator.geolocation) {
//       $window.navigator.geolocation.getCurrentPosition(function (position) {
//
//         var pos = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         };
//
//         uiGmapGoogleMapApi.then(function (maps) {
//           var geocoder = new maps.Geocoder;
//           geocoder.geocode({'location': pos}, function (results, status) {
//
//             if (status === maps.GeocoderStatus.OK && results.length >= 1) {
//               var address = results[0]['address_components'];
//               for (var i = 0; i < address.length; i++) {
//                 for (var j = 0; j < address[i].types.length; j++) {
//                   switch (address[i].types[j]) {
//                     case 'route':
//                       $scope.address = address[i]['long_name'];
//                       break;
//                     case 'street_number':
//                       $scope.number = address[i]['long_name'];
//                       break;
//                     case 'sublocality':
//                       $scope.neighborhood = address[i]['long_name'];
//                       break;
//                     case 'administrative_area_level_1':
//                       $scope.uf = address[i]['short_name'];
//                       break;
//                     case 'administrative_area_level_2':
//                       $scope.city = address[i]['long_name'];
//                       break;
//                   }
//                 }
//               }
//
//               $scope.LOADING = false;
//               $scope.$apply();
//             } else {
//               $scope.locationError(); // api do google não encontrou coordenadas
//             }
//           });
//         });
//
//       }, $scope.locationError); // usuario se negou a fornecer geolocation
//     } else {
//       $scope.locationError(); // browser nao tem geolocation
//     }
//   };
//
//   $scope.locationError = function () {
//     $scope.feedbacks = [{
//       type: 'warning', msg: constants.MESSAGES.GEOLOCATION_UNAVAILABLE
//     }];
//     $scope.LOADING = false;
//   };
//
//   $scope.indication = function () {
//     $scope.LOADING = true;
//
//     $timeout(function () {
//       $scope.LOADING = false;
//       $scope.feedbacks = [{
//         type: 'success', msg: constants.MESSAGES.DEFAULT_SUCCESS_MESSAGE
//       }];
//     }, 3000);
//
//   };
//
//   // TODO remover na versao final, somente exemplo de telefone
//   $scope.$watch('phone', function () {
//     if ($scope.phone && $scope.phone.indexOf('0000000000') > -1) {
//       $scope.feedbacks = [{
//         type: 'danger',
//         msg: 'Mensagem de erro de exemplo'
//       }]
//     }
//   });
//
// }]);
//
// app.controller('NewCredentialController', ['$scope', function ($scope) {
//   $scope.currentStep = 1;
//   $scope.breadCrumbClass = function (index) {
//     var breadCrumbClass = '';
//     if (index <= $scope.currentStep) {
//       breadCrumbClass += 'active';
//     }
//     return breadCrumbClass;
//   };
// }]);
//
//
// /**
//  * Controller mockup para notificações -> eu tentaria padronizar a entrada de dados e separaria os
//  * controllers por arquivo além de criar serviços para buscar os dados nos server
//  **/
// app.controller('FavsController', ['$scope', '$window', '$timeout', function ($scope, $window, $timeout) {
//
//   $scope.LOADING = true;
//   $scope.data = null;
//
//   $scope.hasNoContent = function () {
//     return ($scope.data === null || $scope.data.length < 1) && $scope.LOADING === false;
//   };
//
//   $scope.hasContent = function () {
//     return $scope.data !== null && $scope.data.length > 0 && $scope.LOADING === false;
//   };
//
//   $scope.toggleFav = function (fav) {
//     fav.active = !fav.active;
//   };
//
//   $scope.goToMap = function (item) {
//     $window.location = '/beneficiario/guia-vr.html#network';
//   };
//
//   $timeout(function () {
//     $scope.data = [{
//       row: 1,
//       favs: [{
//         active: false,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }, {
//         active: false,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }]
//     }, {
//       row: 2,
//       favs: [{
//         active: true,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }, {
//         active: true,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }]
//     }, {
//       row: 3,
//       favs: [{
//         active: true,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }, {
//         active: true,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }]
//     }, {
//       row: 4,
//       favs: [{
//         active: true,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }, {
//         active: true,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }]
//     }, {
//       row: 5,
//       favs: [{
//         active: true,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }, {
//         active: true,
//         title: 'Posto Mauritânia',
//         place: 'Avenida Brasil, 1234, Jardim Paulista, 33323-232 São Paulo - SP - 230km'
//       }]
//     }];
//
//     $scope.LOADING = false;
//   }, 3000);
// }]);
//
// /**
//  * Área de subheader usando o dado para ativar o elemento
//  **/
// app.controller('SubNavigation', ['$scope', '$window', function ($scope, $window) {
//   var actualPath = $window.location.pathname.split('/')[2].replace('.html', '');
//
//   this.pageView = function (pageView) {
//     return actualPath == pageView;
//   };
// }]);
//
// /**
//  * Área de dashboard - Meus cartões
//  **/
// app.controller('NavigationController', ['$rootScope', '$scope', '$window', '$uibModal', function ($rootScope, $scope, $window, $uibModal) {
//   $scope.substate = "";
//   $scope.products = null;
//
//   this.setView = function (viewName, product) {
//     $scope.substate = viewName;
//     if (product) {
//       $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_VIEW_PRODUCT, {product: product});
//     }
//   };
//
//   this.setProducts = function (products) {
//     $scope.products = products;
//   };
//
//   this.getProducts = function () {
//     return $scope.products;
//   };
//
//   this.isView = function (viewName) {
//     return $scope.substate == viewName;
//   };
//
//   this.setDefault = function (viewName) {
//     if ($window.location.hash) {
//       this.setView($window.location.hash.replace('#/', ''));
//     } else {
//       this.setView(viewName);
//     }
//   };
//
//   //Abrir modais
//   this.open = function (modal, size) {
//
//     var opts = {
//       templateUrl: '/partials/modals/' + modal + '.html',
//       controller: 'ModalCtrl',
//       backdrop: 'static',
//       keyboard: false
//     };
//
//     if (size) opts.size = size;
//
//     return $uibModal.open(opts);
//   };
//
//   var querySubstate = $scope.urlQueryValue('substate');
//   if (querySubstate) {
//     this.setView(querySubstate);
//   }
//
//
//   // Registro de eventos
//   var navigation = this;
//
//   $scope.$on(constants.EVENTS.NAVIGATION_SET_VIEW, function (event, data) {
//     navigation.setView(data.view);
//   });
//
//   $scope.$on(constants.EVENTS.NAVIGATION_SET_PRODUCTS, function (event, data) {
//     navigation.setProducts(data.products);
//     navigation.setView(data.products[0].id, data.products[0]);
//   });
//
// }]);
//
// app.controller('UnlockCardController', ['$scope', '$timeout', function ($scope, $timeout) {
//   $scope.LOADING = false;
//
//   $scope.showPersonalInfoInputs = function () {
//     return false;
//   };
//
//   $scope.showCodeInput = function () {
//     return false;
//   };
//
//   $scope.triggerAction = function () {
//     $scope.LOADING = true;
//     $timeout(function () {
//       $scope.LOADING = false;
//     }, 3000);
//   };
//
// }]);
//
// /**
//  * Controllers dos modais
//  **/
// app.controller('ModalCtrl', ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
//
//   $scope.onstate = "awaiting";
//   $scope.LOADING = false;
//
//   $scope.doSomethingToSuccess = function () {
//     $scope.LOADING = true;
//     $timeout(function () {
//       $scope.LOADING = false;
//       $scope.onstate = "success";
//     }, 1000);
//   };
//
//   $scope.cancel = function () {
//     $uibModalInstance.dismiss("close");
//   };
//
//   $scope.ok = function (data) {
//     $uibModalInstance.close(data);
//   };
//
//   $scope.changeState = function (state) {
//     $scope.onstate = state;
//   };
// }]);
//
// app.controller('BlockCardModalCtrl', ['$scope', '$uibModalInstance', '$timeout', 'activeCard', function ($scope, $uibModalInstance, $timeout, activeCard) {
//
//   $scope.onstate = "awaiting";
//   $scope.LOADING = false;
//   $scope.activeCard = activeCard;
//   $scope.option = null;
//
//   $scope.blockCard = function () {
//     $scope.LOADING = true;
//     $timeout(function () {
//       $scope.LOADING = false;
//       $scope.onstate = "success";
//     }, 1000);
//   };
//
//   $scope.setOption = function (option) {
//     $scope.option = option;
//   };
//
//   $scope.isBlockDisabled = function () {
//     return $scope.option === null;
//   };
//
//   $scope.cancel = function () {
//     $uibModalInstance.dismiss("close");
//   };
//
//   $scope.ok = function (data) {
//     $uibModalInstance.close(data);
//   };
//
//   $scope.changeState = function (state) {
//     $scope.onstate = state;
//   };
// }]);
//
// app.controller('ChangeCardPasswordModalCtrl', ['$scope', '$uibModalInstance', '$timeout', 'activeCard', function ($scope, $uibModalInstance, $timeout, activeCard) {
//
//   $scope.onstate = "awaiting";
//   $scope.LOADING = false;
//   $scope.activeCard = activeCard;
//   $scope.option = null;
//
//   $scope.changePassword = function () {
//     $scope.LOADING = true;
//     $timeout(function () {
//       $scope.LOADING = false;
//       $scope.onstate = "success";
//     }, 1000);
//   };
//
//   $scope.setOption = function (option) {
//     $scope.option = option;
//   };
//
//   $scope.cancel = function () {
//     $uibModalInstance.dismiss("close");
//   };
//
//   $scope.ok = function (data) {
//     $uibModalInstance.close(data);
//   };
//
//   $scope.changeState = function (state) {
//     $scope.onstate = state;
//   };
// }]);
//
// /**
//  *  Diretiva com a barra que altera pelo tamanho
//  *  Data = é o valor em número que o usuário tem
//  *  Total = Valor total possível
//  *  Limit = Valor que deve alertar -> Opcional
//  **/
// app.directive('vrDataBar', ['$timeout', function ($timeout) {
//   return {
//     restrict: 'EA',
//     scope: {
//       spent: '=',
//       total: '=',
//       limit: '=?'
//     },
//     template: '<div class="vr-progress-wrapper">'
//     + '<div class="vr-progress">'
//     + '<div class="vr-progress-bar">'
//     + '<div class="vr-progress-limit-bar"></div>'
//     + '<div class="vr-progress-bar-text">{{ pct }}%</div>'
//     + '</div>'
//     + '<div class="vr-progress-limit-text">Alerta de saldo {{ limitPct }}%</div>'
//     + '<div class="vr-progress-limit"></div></div></div>',
//     replace: true,
//     link: function ($scope, iElm, iAttrs, controller) {
//       var el = iElm[0];
//
//       //Cálculo inicial
//       $scope.pct = Math.round(($scope.spent / $scope.total) * 100);
//
//       //Pegando os elementos necessários do dom
//       var bar = el.querySelector('.vr-progress-bar');
//       var barText = el.querySelector('.vr-progress-bar-text');
//       var barLimit = el.querySelector('.vr-progress-limit');
//       var barOverLimit = el.querySelector('.vr-progress-limit-bar');
//       var barOverLimitText = el.querySelector('.vr-progress-limit-text');
//
//       //Ajuste para tamanho máximo
//       if ($scope.pct >= 100) bar.style.width = "100%";
//       else bar.style.width = $scope.pct + "%";
//
//       //Posicionamento da porcentagem na barra
//       if ($scope.pct >= 50) barText.style.right = "45%";
//
//       //Caso ele tenha setado um limite
//       $scope.limitPct = Math.round(($scope.limit / $scope.total) * 100);
//
//       $scope.barOverLimitWidth = ($scope.pct - 100) > 0 ? ($scope.pct - 100) : 0;
//       barOverLimit.style.width = $scope.barOverLimitWidth + "%";
//       barOverLimitText.style.left = $scope.barOverLimitWidth + "%";
//       barLimit.style.left = $scope.limitPct + "%";
//
//       //Colorizando a barra
//       if ($scope.limitPct > $scope.pct) {
//         bar.style.background = "#f93417";
//       } else {
//         bar.style.background = "#10BA54";
//       }
//
//     }
//   };
// }]);
//
//
// /**
//  * Diretiva para loading dos paineis!
//  * vr-loading-panel="true || false"
//  * True mostra e False esconde!
//  **/
// app.directive('vrLoadingPanel', ['$timeout', function ($timeout) {
//   return {
//     scope: {
//       vrLoadingPanel: '='
//     },
//     restrict: 'AE',
//     template: '<section class="panel-loading" ng-show="vrLoadingPanel"><div class="panel-loading-bar"></div></section>',
//     replace: true,
//     link: function ($scope, iElm, iAttrs, controller) {
//       $scope.$watch('vrLoadingPanel', function () {
//       });
//     }
//   };
// }]);
//
// /**
//  * Diretiva para comparar senhas por exemplo compare-to=model
//  **/
// app.directive('compareTo', function () {
//   return {
//     require: "ngModel",
//     scope: {
//       otherModelValue: "=compareTo"
//     },
//     link: function (scope, element, attributes, ngModel) {
//
//       ngModel.$validators.compareTo = function (modelValue) {
//         return modelValue == scope.otherModelValue;
//       };
//
//       scope.$watch("otherModelValue", function () {
//         ngModel.$validate();
//       });
//     }
//   };
// });
//
// /**
//  * Diretiva de tooltip
//  *
//  * div tooltipCloseable='texto'
//  **/
// app.directive('tooltipCloseable', [function () {
//   return {
//     scope: {
//       tooltipCloseable: '='
//     },
//     restrict: 'AE',
//     template: '' +
//     '<div ng-show="tipDisplay">' +
//     '<div class="row tooltip-closeable">' +
//     '<div class="col-xs-2 text-center">' +
//     '<i class="icon icon-icon_alerta"></i>' +
//     '</div>' +
//     '<div class="col-xs-8" ng-bind="tooltipCloseable">' +
//     '</div>' +
//     '<div class="col-xs-2">' +
//     '<button ng-click="tipDisplay=!tipDisplay">' +
//     '<i class="icon icon-icon_fechar_alerta"></i>' +
//     '</button>' +
//     '</div>' +
//     '<div class="tooltip-arrow-down"></div>' +
//     '</div>' +
//     '</div>',
//     replace: true,
//     link: function ($scope) {
//       $scope.tipDisplay = false;
//
//       $scope.$watch('tooltipCloseable', function (newVal) {
//         $scope.tipDisplay = newVal !== "";
//       });
//
//       $scope.dismiss = function () {
//         $scope.tooltipCloseable = "";
//         $scope.tipDisplay = false;
//       };
//     }
//   };
// }]);
//
// /**
//  * Diretiva de alerta!
//  * vr-alert="Texto"
//  **/
// app.directive('vrAlert', [function () {
//   return {
//     scope: {
//       vrAlert: '=',
//       vrAlertType: '='
//     },
//     restrict: 'AE',
//     template: '' +
//     '<section role="alert" class="alert alert-main"  ng-class="{\'alert-success\':(vrAlertType!==\'danger\' && vrAlertType!==\'warning\'), \'alert-warning\':vrAlertType===\'warning\', \'alert-danger\':vrAlertType===\'danger\' }" ng-show="alertDisplay">' +
//     '<p><i class="icon" ng-class="{\'icon-icon_alerta\':vrAlertType===\'success\', \'icon-icon_informacoes_on\':vrAlertType!==\'success\'}"></i>' +
//     '<span>{{vrAlert}}</span>&nbsp;' +
//     '<a href="javascript:void(0)" role="close" class="pull-right alert-dismiss" ng-click="dismiss()">' +
//     '<i class="icon" ng-class="{\'icon-icon_fechar_alerta\':vrAlertType===\'success\', \'icon-icon_fechar_feedback_form\':vrAlertType!==\'success\'}"></i>' +
//     '</a></p></section>',
//     replace: true,
//     link: function ($scope, iElm, iAttrs, controller) {
//       $scope.alertDisplay = false;
//
//       $scope.$watch('vrAlert', function (value) {
//         $scope.alertDisplay = value && value.trim().length > 0;
//       });
//
//       $scope.dismiss = function () {
//         $scope.vrAlert = "";
//         $scope.alertDisplay = false;
//       };
//     }
//   };
// }]);
//
// /**
//  * DIRETIVA DE NAVEGAÇÃO EM TAB
//  **/
// app.directive('navTabs', ['$window', '$timeout', function ($window, $timeout) {
//   return {
//     scope: {
//       navTabs: "="
//     },
//     restrict: 'A',
//     replace: true,
//     template: '<nav class="tabs" role="navigation"></nav>',
//     transclude: true,
//     link: function ($scope, iElm, iAttrs, controller, transclude) {
//       iElm.append(transclude());
//       var wrapper = iElm[0].querySelector(".tabs-wrapper");
//       var tabs = iElm[0].querySelectorAll(".tab");
//       var tab = tabs[0];
//
//       if (!tabs || !wrapper) return false;
//
//       var leftButton = iElm[0].querySelectorAll(".tab-navigation")[0];
//       var rightButton = iElm[0].querySelectorAll(".tab-navigation")[1];
//       var selectionIndex = 0;
//       var maxIndex = tabs.length - 1;
//       var displayArrows = false;
//
//       angular.element(tabs).on('click', function (event) {
//         tab = event.target;
//         toggleActive(tab);
//       });
//
//       angular.element(leftButton).on('click', goBack);
//       angular.element(rightButton).on('click', goNext);
//       angular.element(rightButton).addClass("hidden");
//       angular.element(leftButton).addClass("hidden");
//
//       function detectWidth() {
//
//         if (wrapper.clientWidth < wrapper.scrollWidth) {
//           displayArrows = true;
//           toggleActive(tab);
//         } else {
//           displayArrows = false;
//           $timeout(function () {
//             angular.element(leftButton).addClass("hidden");
//             angular.element(rightButton).addClass("hidden");
//           })
//         }
//       }
//
//       $window.addEventListener('resize', detectWidth)
//       detectWidth();
//
//       function toggleActive(tab) {
//         $timeout(function () {
//           $scope.navTabs = tab.innerHTML;
//         });
//
//         //Muda pra active
//         angular.element(tabs).removeClass("active");
//         angular.element(tab).addClass("active");
//
//         //Verifica o selecionado para mudar o index
//         for (var i = 0; i < tabs.length; i++) {
//           if (tabs[i].className.indexOf("active") != -1) {
//             selectionIndex = i;
//             break;
//           }
//         }
//
//         //Move a div
//         var offset = tab.offsetLeft;
//         wrapper.scrollLeft = offset;
//         //TODO: Ver como animar isso pra ficar mais legal
//
//         //Toogle do botão de navegação da esquerda
//         if (tabs[0].className.indexOf("active") != -1) {
//           angular.element(leftButton).addClass("hidden");
//         } else if (displayArrows) {
//           angular.element(leftButton).removeClass("hidden");
//         }
//         //Toggle do botão de navegação da direita
//         if (tabs[tabs.length - 1].className.indexOf("active") != -1) {
//           angular.element(rightButton).addClass("hidden");
//         } else if (displayArrows) {
//           angular.element(rightButton).removeClass("hidden");
//         }
//       }
//
//       function goNext() {
//         if (selectionIndex < maxIndex) {
//           selectionIndex++;
//           //toggleActive(tabs[selectionIndex]);
//         }
//       }
//
//       function goBack() {
//         if (selectionIndex > 0) {
//           selectionIndex--;
//           //toggleActive(tabs[selectionIndex]);
//         }
//       }
//
//       toggleActive(tab);
//     }
//   };
// }]);
//
//
// /**
//  * DIRETIVA PARA ATUALIZAÇÃO DE ATIVAÇÃO
//  **/
// app.directive('updateActive', function () {
//   return {
//     restrict: 'A',
//     link: function ($scope, iElm, Attrs, Ctrl) {
//       var el = iElm[0];
//       el.onclick = function () {
//         angular.forEach(el.parentNode.children, function (node) {
//           angular.element(node).removeClass("active");
//         });
//
//         angular.element(el).addClass("active");
//       };
//     }
//   };
// });
//
// /**
//  * DROPDOWN DO MENU
//  **/
// app.directive('dropdownHover', ['$timeout', function ($timeout) {
//   return {
//     scope: {
//       dropdownHover: "@"
//     },
//     restrict: 'A',
//     link: function ($scope, iElm, Attrs, Ctrl) {
//       var dropWrapper = document.querySelector("#" + $scope.dropdownHover);
//       if (!dropWrapper) return false;
//       var el = iElm[0];
//       var timelimit = 100;
//       var openTimeout;
//       var hoveringElement = false;
//
//       var startHover = function (e) {
//         dropWrapper.style.display = "block";
//         hoveringElement = true;
//       };
//
//       var leaveHover = function (e) {
//         var nextObject = e.toElement || e.relatedTarget;
//         hoveringElement = false;
//
//         $timeout(function () {
//           if (!hoveringElement) {
//             dropWrapper.style.display = "none";
//           }
//         }, timelimit);
//       };
//
//       angular.element(el).on('mouseenter', startHover);
//       angular.element(dropWrapper).on('mouseenter', startHover);
//       angular.element(el).on('mouseleave', leaveHover);
//       angular.element(dropWrapper).on('mouseleave', leaveHover);
//
//     }
//   };
// }]);
//
//
// app.filter('cardMask', function () {
//   return function (card) {
//     var result = '!cardMask: ' + card;
//     card = card.toString();
//     if (card) {
//       var prefix = card.substring(0, 6);
//       var middle = card.substring(6, card.length - 4);
//       var suffix = card.substring(card.length - 4, card.length);
//
//       result = prefix;
//       for (var i = 0; i < middle.length; i++) {
//         result += 'X';
//       }
//       result += suffix;
//     }
//
//     return result;
//   }
// });
//
