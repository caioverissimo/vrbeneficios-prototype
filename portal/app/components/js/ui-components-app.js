var constants = {
  COOKIES: {
    AGJSSESSIONID: "agjssessionid"
  },
  DYNAMIC_DATA: {
    PRODUCTS: [],
    OPERATING_DAYS: [],
    TYPE_OF_ESTABLISHMENT: [],
    VIDEO_URL: []
  },
  EVENTS: {
    CARD_CONFIRMATION: 'Card.confirmation',
    CARD_SELECTED: 'Card.selected',
    ESTABLISHMENT_SELECTED: 'Establishment.selected',
    HTTP_ERROR: 'Http.error',
    NAVIGATION_SET_PRODUCTS: 'Navigation.setProducts',
    NAVIGATION_SET_VIEW: 'Navigation.setView',
    NAVIGATION_SET_VIEW_PRODUCT: 'Navigation.setViewProduct',
    NAVIGATION_CHECK_CARD: 'Navigation.checkCard',
    BANK_AND_QUALIF_DATA_CHECK: 'BankAndQualifData.check',
    ESTABLISHMENT_DATA_LOADED: 'Establishment.dataLoaded',
    REQUEST_FORM_BANK_DATA_AND_QUALIF: 'requestForm.BankDataAndQualific',
    SEND_FORM_BANK_DATA_AND_QUALIF: 'sendForm.BankDataAndQualific',
    ACCREDITATION_DATA_BANK_LOADED: 'AccreditationBank.dataLoaded',
    ACCREDITATION_DATA_QUALIFIC_LOADED: 'AccreditationQualific.dataLoaded',
    TUTORIAL_ENABLE: 'Tutorial.Enable',
    TUTORIAL_START: 'Tutorial.start',
    SHOW_VIDEO: 'show.Video',
    TUTORIAL_PREFERENCE: 'Tutorial.preference'
  },
  MEDIA_QUERIES: {
    MOBILE_SCREEN: '(max-width: 768px)'
  },
  SESSION: {
    PRODUCT_CARD_SET: 'ProductCard.set',
    ESTABLISHMENT_SELECTED: 'Establishment.selected',
    ESTABLISHMENT_REFUND_PRINT: 'Establishment.RefundPrint',
    ESTABLISHMENT_REFUND_GUIDE_PRINT: 'Establishment.RefundGuidePrint',
    ESTABLISHMENT_SALES_PRINT: 'Establishment.SalesSearchDataPrint',
    BENEFICIARIO_EXTRACT_CARDNUMBER_PRINT: 'Beneficiario.ExtractCardNumberPrint'
  },
  SETTINGS: {
    MAX_PAGINATION: 10,
    CAROUSEL_INTERVAL: 5000,
    VRPAT: 'VRPAT',
    SIGLA_EMISSOR:"",
    DEBUG: false
  }
};

var appComponents = angular.module('ui-components-app', [
  'ngCookies',
  'pickadate'
]);

appComponents.service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function (file, uploadUrl) {
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).success(function () {
      console.log("Arquivo enviado com sucesso!");
    }).error(function () {
      console.log("Erro ao realizar upload de arquivo!");
    });
  };
}]);

appComponents.service('sessionService', ['$cookies', '$window', '$rootScope', function ($cookies, $window, $rootScope) {
  this.getAccessToken = function () {
    this.validateSession($cookies.accessToken);
    return $cookies.accessToken;
  };
  this.getCnpjEC = function () {
    var cnpj;
    if ($rootScope.getActiveEstablishment()) {
      cnpj = $rootScope.getActiveEstablishment().cnpj;
    }
    return cnpj;
  };
  this.validateSession = function (accessToken) {
    var agjsessionid = $window.sessionStorage.getItem(constants.COOKIES.AGJSSESSIONID);
    if (agjsessionid) {
      if (agjsessionid !== accessToken) {
        this.cleanSession();
        $window.sessionStorage.setItem(constants.COOKIES.AGJSSESSIONID, accessToken);
      }
    } else {
      $window.sessionStorage.setItem(constants.COOKIES.AGJSSESSIONID, accessToken);
    }
  };
  this.cleanSession = function () {
    for (var i = 0; i < Object.keys(constants.SESSION).length; i++) {
      $window.sessionStorage.removeItem(constants.SESSION[Object.keys(constants.SESSION)[i]]);
    }
  };
}]);

appComponents.factory('authorizationInjector', ['sessionService', function (sessionService) {
  return {
    request: function (config) {
      config.headers['access-token'] = sessionService.getAccessToken();
      return config;
    }
  };
}]);

appComponents.factory('authHttpResponseInterceptor', ['$q', '$window', '$rootScope', 'sessionService', function ($q, $window, $rootScope, sessionService) {
  return {
    response: function (response) {
      if (response.status === 401) {
        $rootScope.usuarioLogout();
        sessionService.cleanSession();
      }
      return response || $q.when(response);
    },
    responseError: function (rejection) {
      if (rejection.status === 401) {
        $rootScope.usuarioLogout();
        sessionService.cleanSession();
      }
      return $q.reject(rejection);
    }
  }
}]);

appComponents.factory('vrModalCustomize', ['$window', function ($window) {
  return {
    toCenter: function (modalInstance) {
      modalInstance.rendered.then(function () {
        var windowHeight = $window.innerHeight;
        var modalNode = document.querySelectorAll('.modal-dialog');
        for (var i = 0; i < modalNode.length; i++) {
          if (windowHeight > modalNode[i].offsetHeight) {
            modalNode[i].style.marginTop = (windowHeight - modalNode[i].offsetHeight) / 2 + 'px';
          }
        }
      });
    }
  };
}]);

appComponents.service('shareDataService', function ($window) {

  var addData = function (key, value) {
    $window.sessionStorage.setItem(key, value);
  };

  var getData = function (key) {
    return $window.sessionStorage.getItem(key);
  };

  return {
    addData: addData,
    getData: getData
  };
});

appComponents.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('authorizationInjector');
  $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);

appComponents.config(function (pickadateI18nProvider) {
  pickadateI18nProvider.translations = {
    prev: '<button class="btn btn-default"><i class="fa fa-angle-left"></i></button>',
    next: '<button class="btn btn-default"><i class="fa fa-angle-right"></i></button>'
  }
});

// definição de funções comuns reutilizaveis em todos os escopos por meio do rootscope
appComponents.run(['$rootScope', '$window', '$http', '$timeout', '$filter', function ($rootScope, $window, $http, $timeout, $filter) {

  $rootScope.urlQueryValue = function (param) {
    if ($window.location.search) {
      var query = $window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === param) {
          return decodeURIComponent(pair[1]);
        }
      }
    }
  };

  if ($rootScope.urlQueryValue('debug') && $rootScope.urlQueryValue('debug') !== "false") {
    constants.SETTINGS.DEBUG = true;
  }

  $rootScope.httpErrorCallback = function (response) {
    $rootScope.$broadcast(constants.EVENTS.HTTP_ERROR, {response: response});
  };

  $rootScope.getDynamicData = function (key) {
    return constants.DYNAMIC_DATA[key];
  };

  // essa função é necessária para propagar eventos de mudança para inputs duplicados injetados pelo lumis
  $rootScope.propagateInputChange = function (selector, val, filter) {

    // tratamento de inputs com filtro
    if (filter) {
      var filterName = filter.split(':')[0];
      var filterAttribute = filter.split(':')[1];
      if (filterAttribute) {
        val = $filter(filterName.trim())(val, filterAttribute.trim());
      } else {
        val = $filter(filterName.trim())(val);
      }
    }

    angular.element(selector).each(function (index, element) {
      if (!element.attributes['ng-model']) {
        angular.element(element).val(val);
      }
    });
  };

  $rootScope.hasURI = function (substring) {
    var viewpathname = $window.location.pathname;
    return (viewpathname.indexOf(substring) !== -1);
  };


  // utilizado para debug
  $rootScope.exposeScope = function (controllerName, scope) {
    if (constants.SETTINGS.DEBUG) {
      $window[controllerName + 'Scope'] = scope;
      console.log(controllerName + ': objeto $scope acessível em window.' + controllerName + 'Scope');
    }
  };

}]);


/*
 * FILTROS (inicio)
 */
appComponents.filter('cnpjFilter', function () {
  return function (cnpj) {
    var result = '';

    if (cnpj) {
      var l1 = cnpj.length - 2;
      var l2 = l1 - 4;
      var l3 = l2 - 3;
      var l4 = l3 - 3;

      result = '-' + cnpj.substring(l1);
      result = '/' + cnpj.substring(l2, l1) + result;
      result = '.' + cnpj.substring(l3, l2) + result;
      result = '.' + cnpj.substring(l4, l3) + result;
      result = cnpj.substring(0, l4) + result;
    }
    return result;
  };
});

appComponents.filter('cpfFilter', function () {
  return function (cpf) {
    var result = '';

    if (cpf) {
      var l1 = cpf.length - 2;
      var l2 = l1 - 3;
      var l3 = l2 - 3;

      result = '-' + cpf.substring(l1);
      result = '.' + cpf.substring(l2, l1) + result;
      result = '.' + cpf.substring(l3, l2) + result;
      result = cpf.substring(0, l3) + result;
    }
    return result;
  };
});

appComponents.filter('dateSlashFilter', function () {
  return function (dateWithSlash, addSlashes) {
    var output = '', day, month, year;
    dateWithSlash += '';
    if (dateWithSlash) {
      if (addSlashes) {
        day = dateWithSlash.substring(0, 2);
        month = dateWithSlash.substring(2, 4);
        year = dateWithSlash.substring(4);

        output = '' + day + '/' + month + '/' + year;

      } else {
        day = parseInt(dateWithSlash.split('/')[0], 10);
        month = parseInt(dateWithSlash.split('/')[1], 10);
        year = parseInt(dateWithSlash.split('/')[2], 10);

        day = day >= 10 ? '' + day : '0' + day;
        month = month >= 10 ? '' + month : '0' + month;

        output = '' + day + month + year;
      }
    }

    return output;
  };
});

appComponents.filter('telefoneFilter', function () {
  return function (telefone) {
    var output = '';
    if (telefone) {

      var value = telefone.toString().trim().replace(/^\+/, '');

      if (value.match(/[^0-9]/)) {
        return telefone;
      }
      // ex. 1144445555?9
      var ddd = value.slice(0, 2);
      var number = value.slice(2);

      number = number.slice(0, 4) + '-' + number.slice(4);
      output = ("(" + ddd + ") " + number).trim();
    }
    return output;
  };
});

appComponents.filter('cardMask', function () {
  return function (card) {
    var result = '' + card;
    if (card != undefined) {
      card = card.toString();
      if (card) {
        var prefix = card.substring(0, 6);
        var middle = card.substring(6, card.length - 4);
        var suffix = card.substring(card.length - 4, card.length);

        result = prefix;
        for (var i = 0; i < middle.length; i++) {
          result += 'X';
        }
        result += suffix;
      }
    }
    return result;
  }
});

appComponents.filter('cardEnd', function () {
  return function (card) {
    var result = '!cardEnd: ' + card;
    card = card.toString();
    if (card) {
      result = card.substring(card.length - 4);
    }
    return result;
  }
});

// Mobile checker
// Detecta se está em ambiente mobile by mobilechecker.com
appComponents.factory('mobileChecker', function () {
  return function isMobile() {
    var check = false;
    (function (a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };
});

/**
 * Diretiva para loading dos paineis!
 * vr-loading-panel="true || false"
 * True mostra e False esconde!
 **/
appComponents.directive('vrLoadingPanel', [function () {
  return {
    scope: {
      vrLoadingPanel: '='
    },
    restrict: 'AE',
    template: '<section class="panel-loading" ng-show="vrLoadingPanel"><div class="panel-loading-bar"></div></section>',
    replace: true,
    link: function ($scope) {
      $scope.$watch('vrLoadingPanel', function () {
        // nao faz nada dentro do watch
      });
    }
  };
}]);


/**
 * Diretiva para comparar senhas por exemplo compare-to=model
 **/
appComponents.directive('compareTo', function () {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function (scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function (modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function () {
        ngModel.$validate();
      });
    }
  };
});

/**
 * Diretiva de validação de datas
 */
appComponents.directive('dateValidation', function () {
  return {
    require: "ngModel",
    link: function (scope, element, attributes, ngModel) {

      ngModel.$validators.dateValidation = function (modelValue) {
        var isValid = false;

        if (modelValue) {
          var stringValue = modelValue.toString();

          if (stringValue.length >= 7) {
            var l1 = stringValue.length - 4;
            var l2 = l1 - 2;
            var year = parseInt(stringValue.substring(l1), 10);
            var month = parseInt(stringValue.substring(l2, l1), 10);
            var day = parseInt(stringValue.substring(0, l2), 10);

            // validação de ano
            var date = new Date();
            var yearValid = (year >= 1900 && year <= date.getFullYear());

            // validação de mês
            var monthValid = (month >= 1 && month <= 12);

            // validação de dia
            date = new Date(year, month, 0);
            var lastDayInMonth = date.getDate();
            var dayValid = (day >= 1 && day <= lastDayInMonth);

            isValid = yearValid && monthValid && dayValid;
          }

        }

        return isValid;
      };

    }
  };
});

/**
 * Diretiva de prevenção de área de transferência
 */
appComponents.directive('noCutCopyPaste', function () {
  return {
    link: function (scope, element) {
      element.on('cut copy paste', function (event) {
        event.preventDefault();
      });
    }
  };
});

appComponents.directive('positiveNumberValidation', function () {
  return {
    require: "ngModel",
    link: function (scope, element, attributes, ngModel) {

      ngModel.$validators.positiveNumberValidation = function (modelValue) {
        var isValid = false;

        if (modelValue) {
          modelValue = parseFloat(modelValue, 10);
          if (modelValue > 0) {
            isValid = true;
          }
        }

        return isValid;
      };

    }
  };
});


/**
 * Diretiva para comparar senhas por exemplo greaterThan=model
 **/
appComponents.directive('greaterThan', function () {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=greaterThan"
    },
    link: function (scope, element, attributes, ngModel) {

      ngModel.$validators.greaterThan = function (modelValue) {
        return modelValue > scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function () {
        ngModel.$validate();
      });
    }
  };
});


/**
 * Diretiva de tooltip
 *
 * div tooltipCloseable='texto'
 **/
appComponents.directive('tooltipCloseable', [function () {
  return {
    scope: {
      tooltipCloseable: '='
    },
    restrict: 'AE',
    template: '' +
    '<div ng-show="tipDisplay">' +
    '<div class="row tooltip-closeable">' +
    '<div class="col-xs-2 text-center">' +
    '<i class="icon icon-icon_alerta"></i>' +
    '</div>' +
    '<div class="col-xs-8" ng-bind="tooltipCloseable">' +
    '</div>' +
    '<div class="col-xs-2">' +
    '<button ng-click="tipDisplay=!tipDisplay">' +
    '<i class="icon icon-icon_fechar_alerta"></i>' +
    '</button>' +
    '</div>' +
    '<div class="tooltip-arrow-down"></div>' +
    '</div>' +
    '</div>',
    replace: true,
    link: function ($scope) {
      $scope.tipDisplay = false;

      $scope.$watch('tooltipCloseable', function (newVal) {
        $scope.tipDisplay = newVal !== "";
      });

      $scope.dismiss = function () {
        $scope.tooltipCloseable = "";
        $scope.tipDisplay = false;
      };
    }
  };
}]);

/**
 * Diretiva de alerta!
 * vr-alert="Texto"
 **/
appComponents.directive('vrAlert', [function () {
  return {
    scope: {
      vrAlert: '=',
      vrAlertType: '='
    },
    restrict: 'AE',
    templateUrl: function (element, attrs) {
      return attrs.templateUrl || '/portal/app/components/partials/directives/vr-alert.html'
    },
    replace: true,
    link: function ($scope, iElm, iAttrs, controller) {
      var templateInline = iAttrs.templateInline;
      $scope.alertDisplay = true;
      $scope.templateInline = templateInline;

      if (templateInline) {
        var contentElement = iElm[0].querySelector('#vr-alert-content');
        contentElement.innerHTML = templateInline;
      }

      $scope.$watch('vrAlert', function (newValue, oldValue, scope) {
        if (scope.templateInline) {
          scope.vrAlert = scope.templateInline;
        }
      });

      $scope.dismiss = function () {
        $scope.alertDisplay = false;
      };
    }
  };
}]);

/**
 * DIRETIVA DE NAVEGAÇÃO EM TAB
 **/
appComponents.directive('navTabs', ['$window', '$timeout', function ($window, $timeout) {
  return {
    scope: {
      navTabs: "="
    },
    restrict: 'A',
    replace: true,
    template: '<nav class="tabs" role="navigation"></nav>',
    transclude: true,
    link: function ($scope, iElm, iAttrs, controller, transclude) {
      iElm.append(transclude());
      var wrapper = iElm[0].querySelector(".tabs-wrapper");
      var tabs = iElm[0].querySelectorAll(".tab");
      var tab = tabs[0];

      if (!tabs || !wrapper) return false;

      var leftButton = iElm[0].querySelectorAll(".tab-navigation")[0];
      var rightButton = iElm[0].querySelectorAll(".tab-navigation")[1];
      var selectionIndex = 0;
      var maxIndex = tabs.length - 1;
      var displayArrows = false;

      angular.element(tabs).on('click', function (event) {
        tab = event.target;
        toggleActive(tab);
      });

      angular.element(leftButton).on('click', goBack);
      angular.element(rightButton).on('click', goNext);
      angular.element(rightButton).addClass("hidden");
      angular.element(leftButton).addClass("hidden");

      function detectWidth() {

        if (wrapper.clientWidth < wrapper.scrollWidth) {
          displayArrows = true;
          toggleActive(tab);
        } else {
          displayArrows = false;
          $timeout(function () {
            angular.element(leftButton).addClass("hidden");
            angular.element(rightButton).addClass("hidden");
          })
        }
      }

      $window.addEventListener('resize', detectWidth)
      detectWidth();

      function toggleActive(tab) {
        $timeout(function () {
          $scope.navTabs = tab.innerHTML;
        });

        //Muda pra active
        angular.element(tabs).removeClass("active");
        angular.element(tab).addClass("active");

        //Verifica o selecionado para mudar o index
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].className.indexOf("active") != -1) {
            selectionIndex = i;
            break;
          }
        }

        //Move a div
        var offset = tab.offsetLeft;
        wrapper.scrollLeft = offset;

        //Toogle do botão de navegação da esquerda
        if (tabs[0].className.indexOf("active") != -1) {
          angular.element(leftButton).addClass("hidden");
        } else if (displayArrows) {
          angular.element(leftButton).removeClass("hidden");
        }
        //Toggle do botão de navegação da direita
        if (tabs[tabs.length - 1].className.indexOf("active") != -1) {
          angular.element(rightButton).addClass("hidden");
        } else if (displayArrows) {
          angular.element(rightButton).removeClass("hidden");
        }
      }

      function goNext() {
        if (selectionIndex < maxIndex) {
          selectionIndex++;
          //toggleActive(tabs[selectionIndex]);
        }
      }

      function goBack() {
        if (selectionIndex > 0) {
          selectionIndex--;
          //toggleActive(tabs[selectionIndex]);
        }
      }

      toggleActive(tab);
    }
  };
}]);


/**
 * DIRETIVA PARA ATUALIZAÇÃO DE ATIVAÇÃO
 **/
appComponents.directive('updateActive', function () {
  return {
    restrict: 'A',
    link: function ($scope, iElm, Attrs, Ctrl) {
      var el = iElm[0];
      el.onclick = function () {
        angular.forEach(el.parentNode.children, function (node) {
          angular.element(node).removeClass("active");
        });

        angular.element(el).addClass("active");
      };
    }
  };
});

/**
 * DROPDOWN DO MENU
 **/
appComponents.directive('dropdownHover', ['$timeout', function ($timeout) {
  return {
    scope: {
      dropdownHover: "@"
    },
    restrict: 'A',
    link: function ($scope, iElm, Attrs, Ctrl) {
      var dropWrapper = document.querySelector("#" + $scope.dropdownHover);
      if (!dropWrapper) return false;
      var el = iElm[0];
      var timelimit = 100;
      var openTimeout;
      var hoveringElement = false;

      var startHover = function (e) {
        dropWrapper.style.display = "block";
        hoveringElement = true;
      };

      var leaveHover = function (e) {
        var nextObject = e.toElement || e.relatedTarget;
        hoveringElement = false;

        $timeout(function () {
          if (!hoveringElement) {
            dropWrapper.style.display = "none";
          }
        }, timelimit);
      };

      angular.element(el).on('mouseenter', startHover);
      angular.element(dropWrapper).on('mouseenter', startHover);
      angular.element(el).on('mouseleave', leaveHover);
      angular.element(dropWrapper).on('mouseleave', leaveHover);

    }
  };
}]);

appComponents.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function () {
        scope.$apply(function () {
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);


appComponents.directive('vrPagination', [function () {
  return {
    scope: {
      page: '=',
      pageQuantity: '=',
      pageLimit: '=',
      pageChangeRequest: '='
    },
    restrict: 'A',
    template: ''
    + '<nav class="text-center no-print">'
    + '<ul class="pagination">'
    + '<li ng-show="showLeftPaginationArrow()">'
    + '<a href="javascript:void(0)" ng-click="changePage(pagination[0].page - 1)">'
    + '<span aria-hidden="true">'
    + '<i class="fa fa-angle-left"></i>'
    + '</span></a></li>'
    + '<li ng-repeat="item in pagination | limitTo:pageLimit">'
    + '<a href="javascript:void(0)" ng-click="changePage(item.page)" ng-class="{\'active\':item.page === page}">{{item.page}}</a>'
    + '</li>'
    + '<li ng-show="showRightPaginationArrow()">'
    + '<a href="javascript:void(0)" ng-click="changePage(pagination[pageLimit].page)">'
    + '<span aria-hidden="true">'
    + '<i class="fa fa-angle-right"></i>'
    + '</span></a></li></ul></nav>',
    replace: true,
    link: function ($scope) {

      $scope.showLeftPaginationArrow = function () {
        return $scope.pagination && $scope.pagination.length > 0 && $scope.page > 1 && ($scope.pageQuantity > $scope.pageLimit);
      };

      $scope.showRightPaginationArrow = function () {
        return $scope.pagination && $scope.pagination.length > 0 && !($scope.pageQuantity - $scope.page < $scope.pageLimit);
      };

      $scope.changePage = function (pageNumber) {
        $scope.pageChangeRequest(pageNumber);
        $scope.page = pageNumber;
      };

      $scope.$watchGroup(['page', 'pageQuantity', 'pageLimit', 'pageChangeRequest'], function () {
        $scope.pagination = [];
        if ($scope.pageQuantity) {
          if ($scope.pageQuantity > $scope.pageLimit) {
            if ($scope.pageQuantity - $scope.page < $scope.pageLimit) {
              // situacao de exceçao: ultimos itens da lista
              for (var j = ($scope.pageQuantity - $scope.pageLimit) + 1; j <= $scope.pageQuantity; j++) {
                $scope.pagination.push({
                  page: j
                });
              }
            } else {
              // situacao normal, todos os itens de 1 até os ultimos x
              for (var i = 0; i < constants.SETTINGS.MAX_PAGINATION + 1 && i < $scope.pageQuantity; i++) {
                $scope.pagination.push({
                  page: $scope.page + i
                });
              }
            }
          } else {
            for (var k = 1; k <= $scope.pageQuantity; k++) {
              $scope.pagination.push({
                page: k
              });
            }
          }
        }
      });
    }
  };
}]);

//diretiva para possibilitar o init dos dados recebidos do Lumis no Angular (forms)
appComponents.directive('vrInitial', function () {
  return {
    restrict: 'A',
    controller: [
      '$scope', '$element', '$attrs', '$parse', '$filter', function ($scope, $element, $attrs, $parse, $filter) {
        var getter = $parse($attrs.ngModel), setter, val;
        val = $attrs.vrInitial || $attrs.value;

        // tratamento de inputs com filtro
        if (val && val.indexOf('|') > -1) {
          var filterName = val.replace('{{', '').replace('}}', '').split('|')[1].split(':')[0];
          var filterAttribute = val.replace('{{', '').replace('}}', '').split('|')[1].split(':')[1];
          var input = val.replace('{{', '').replace('}}', '').split('|')[0];
          if (filterAttribute) {
            val = $filter(filterName.trim())(input.trim(), filterAttribute.trim());
          } else {
            val = $filter(filterName.trim())(input.trim());
          }
        }

        // tratamento de inputs radio
        if ($element[0].type === 'radio') {
          val = val === 'checked' ? $attrs.value : '';
        }

        // tratamento de inputs de select>option
        if ($element[0].tagName.toLowerCase() === 'option') {
          getter = $parse($element[0].parentElement.attributes['ng-model'].value);
          val = $element[0].value;
        }

        if (val && val.length > 0) {
          setter = getter.assign;
          setter($scope, val);
        }
      }
    ]
  };
});

// diretiva de manipulação de tecla enter para forms (somente formularios validos podem continuar)
appComponents.directive('vrEnterKeyFormInterceptor', function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      angular.element(element).on('keypress keyup', function (e) {
        var keyCode = e.keyCode || e.which;
        var pressedReturn = keyCode === 13;
        var formName = angular.element(element).attr('name');
        if (formName) {
          var formIsInvalid = angular.element(element).scope()[formName].$invalid;
          if (pressedReturn && formIsInvalid) {
            if (constants.SETTINGS.DEBUG) {
              console.error('Capturada tecla enter, porém o form ' + formName + ' está marcado como inválido:');
              console.dir(angular.element(element).scope()[formName].$error);
            }

            // evento de enter em text area pode passar
            if (e.target.tagName.toLowerCase() !== 'textarea') {
              e.preventDefault();
            }
          }

          if (pressedReturn && !formIsInvalid) {
            var callback = angular.element(element).attr('vr-enter-key-form-interceptor');

            if (callback && callback.length > 0) {
              if (constants.SETTINGS.DEBUG) {
                console.log('A função ' + callback + ' foi passada como parâmetro e será executada...');
              }
              callback = callback.replace('()', '');
              angular.element(element).scope()[callback].call();
            } else {
              if (constants.SETTINGS.DEBUG) {
                console.log('Nenhuma função de callback foi passada como parâmetro');
              }
              var submitButton = angular.element('form[name=' + formName + ']').find('button[type=submit]');
              if (submitButton && submitButton.length > 0) {
                if (constants.SETTINGS.DEBUG) {
                  console.log('Encontrado botão de submit, simulando click desse botão...');
                }
                submitButton[0].click();
              }
            }
          }
        }
      });
    }
  }
});

appComponents.directive('vrTransientImage', function ($q) {

  var URL = window.URL || window.webkitURL;

  var getResizeArea = function () {
    var resizeAreaId = 'fileupload-resize-area';

    var resizeArea = document.getElementById(resizeAreaId);

    if (!resizeArea) {
      resizeArea = document.createElement('canvas');
      resizeArea.id = resizeAreaId;
      resizeArea.style.visibility = 'hidden';
      document.body.appendChild(resizeArea);
    }

    return resizeArea;
  };

  var resizeImage = function (origImage, options) {
    var maxHeight = options.resizeMaxHeight || 300;
    var maxWidth = options.resizeMaxWidth || 250;
    var quality = options.resizeQuality || 0.7;
    var type = options.resizeType || 'image/jpg';

    var canvas = getResizeArea();

    var height = origImage.height;
    var width = origImage.width;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round(height *= maxWidth / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round(width *= maxHeight / height);
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;

    //draw image on canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(origImage, 0, 0, width, height);

    // get the data from canvas as 70% jpg (or specified type).
    return canvas.toDataURL(type, quality);
  };

  var createImage = function (url, callback) {
    var image = new Image();
    image.onload = function () {
      callback(image);
    };
    image.src = url;
  };

  var fileToDataURL = function (file) {
    var deferred = $q.defer();
    var reader = new FileReader();
    reader.onload = function (e) {
      deferred.resolve(e.target.result);
    };
    reader.readAsDataURL(file);
    return deferred.promise;
  };


  return {
    restrict: 'A',
    scope: {
      vrTransientImage: '=',
      emitEvent: '@?',
      resizeMaxHeight: '@?',
      resizeMaxWidth: '@?',
      resizeQuality: '@?',
      resizeType: '@?'
    },
    link: function postLink(scope, element, attrs, ctrl) {

      var doResizing = function (imageResult, callback) {
        createImage(imageResult.url, function (image) {
          var dataURL = resizeImage(image, scope);
          imageResult.resized = {
            dataURL: dataURL,
            type: dataURL.match(/:(.+\/.+);/)[1]
          };
          callback(imageResult);
        });
      };

      var applyScope = function (imageResult) {
        scope.$apply(function () {
          scope.$emit(attrs.emitevent, imageResult);
          if (attrs.multiple) {
            scope.vrTransientImage.push(imageResult);
          } else {
            scope.vrTransientImage = imageResult;
          }
        });
      };


      element.bind('change', function (evt) {
        //when multiple always return an array of images
        if (attrs.multiple) {
          scope.vrTransientImage = [];
        }

        var files = evt.target.files;
        for (var i = 0; i < files.length; i++) {
          //create a result object for each file in files
          var imageResult = {
            file: files[i],
            url: URL.createObjectURL(files[i])
          };

          fileToDataURL(files[i]).then(function (dataURL) {
            imageResult.dataURL = dataURL;
          });

          if (scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
            doResizing(imageResult, function (imageResult) {
              applyScope(imageResult);
            });
          }
          else { //no resizing
            applyScope(imageResult);
          }
        }
      });
    }
  };
});

appComponents.directive('vrFileInput', [function () {
  return {
    link: function (scope, element, attrs) {
      var callback = attrs.vrFileInput;
      if (callback && callback.length > 0) {
        callback = callback.replace('()', '');
      }
      element.on('change', function (event) {
        var files = event.target.files;
        scope.candidate.curriculum = files[0];
        scope.$apply();
        if (callback) {
          if (constants.SETTINGS.DEBUG) {
            console.log('A função ' + callback + ' foi passada como parâmetro e será executada...');
          }
          angular.element(element).scope()[callback].call();
        }
      });
    }
  }
}]);

appComponents.controller('CarouselController', ['$scope', function ($scope) {
  $scope.interval = constants.SETTINGS.CAROUSEL_INTERVAL;
  $scope.activeIndex = 0;

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('CarouselController', $scope);
  }

}]);

/**
 * Área de subheader usando o dado para ativar o elemento
 **/
appComponents.controller('SubNavigation', ['$scope', '$window', function ($scope, $window) {
  var actualPath = $window.location.pathname.split('/')[2].replace('.html', '');

  this.pageView = function (pageView) {
    return actualPath == pageView;
  };

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('SubNavigation', $scope);
  }

}]);

/**
 * Controllers dos modais
 **/
appComponents.controller('ModalCtrl', ['$scope', '$uibModalInstance', '$timeout', 'vrModalCustomize', function ($scope, $uibModalInstance, $timeout, vrModalCustomize) {

  $scope.onstate = "awaiting";
  $scope.LOADING = false;

  $scope.doSomethingToSuccess = function () {
    $scope.LOADING = true;
    $timeout(function () {
      $scope.LOADING = false;
      $scope.onstate = "success";
    }, 1000);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss("close");
  };

  $scope.ok = function (data) {
    $uibModalInstance.close(data);
  };

  $scope.changeState = function (state) {
    $scope.onstate = state;
  };

  vrModalCustomize.toCenter($uibModalInstance);

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('ModalCtrl', $scope);
  }

}]);

/**
 * Controller de navegação
 **/
appComponents.controller('NavigationController', ['$rootScope', '$scope', '$window', '$uibModal', '$attrs', '$timeout', function ($rootScope, $scope, $window, $uibModal, $attrs, $timeout) {
  $scope.substate = "";
  $scope.products = null;
  $scope.cardChecked = false;

  this.setView = function (viewName, product) {
    if (!this.isCardChecked() && viewName === "mycards") {
      $scope.substate = "confirm";
      return;
    }
    $scope.substate = viewName;
    if (product) {
      $rootScope.$broadcast(constants.EVENTS.NAVIGATION_SET_VIEW_PRODUCT, {product: product});
    }
  };

  this.isCardChecked = function () {
    return $scope.cardChecked;
  };

  this.checkCard = function () {
    $scope.cardChecked = true;
  };


  this.setProducts = function (products) {
    $scope.products = products;
  };

  this.getProducts = function () {
    return $scope.products;
  };

  this.isView = function (viewName) {
    return $scope.substate == viewName;
  };

  this.setDefault = function (viewName) {
    if ($window.location.hash) {
      this.setView($window.location.hash.replace('#/', ''));
    } else {
      this.setView(viewName);
    }
  };

  this.setLocation = function (location, validation) {
    if (typeof validation !== "undefined") {
      if (validation() === true) {
        window.location.href = location;
      }
    } else {
      window.location.href = location;
    }
  };

  //Abrir modais
  this.open = function (modalPath, size) {

    var opts = {
      templateUrl: modalPath,
      controller: 'ModalCtrl',
      backdrop: 'static',
      keyboard: false
    };

    if (size) opts.size = size;

    return $uibModal.open(opts);
  };

  this.hasURI = $rootScope.hasURI;

  // configura view 'default': procura por 'hash' na url, atributo 'vrDefaultView' ou parametro em input hidden vindo do lumis
  if (constants.SETTINGS.DEBUG) {
    console.log('NavigationController: Aplicando lógica de exibição automática de painel ativo...');
  }


  this.vrDefaultView = function () {
    var viewHash = $window.location.hash;
    var nav = this;
    var vrDefaultView = angular.element('[vr-default-view]').attr('vr-default-view');
    if (viewHash && viewHash.length > 0) {
      if (constants.SETTINGS.DEBUG) {
        console.log('NavigationController: Recuperado painel ativo via url: ' + viewHash);
      }
      var view = viewHash.substring(viewHash.indexOf('/') + 1);
      if (!this.isView(view)) {
        $timeout(function () {
          nav.setView(view);
        }, 200);
      }

    } else if (vrDefaultView && vrDefaultView.length > 0) {
      if (constants.SETTINGS.DEBUG) {
        console.log('NavigationController: Recuperado painel ativo via atributo vr-default-view: ' + vrDefaultView);
      }
      if (!this.isView(vrDefaultView)) {
        $timeout(function () {
          nav.setView(vrDefaultView);
        }, 200);
      }

    } else {
      var element = angular.element(document).find('input[name="lumPrevParams"]');
      if (element.length > 0) {

        var findView = function (elementValue) {
          //descobre a 'showView' a partir do elemento 'lumPrevParams' montado pelo Lumis
          var baseString = decodeURIComponent(elementValue).replace(/\+/g, ' ');
          var xmlDoc = $.parseXML(baseString);
          var xml = $(xmlDoc);
          return xml.find("p[n=showView]").text();
        };

        var view = findView(element.val());
        if (view) {
          if (constants.SETTINGS.DEBUG) {
            console.log('NavigationController: Recuperado painel ativo via atributo lumPrevParams: ' + view);
          }

          if (!this.isView(view)) {
            $timeout(function () {
              nav.setView(view);
            }, 200);
          }

        }

      }
    }
  };

  // Registro de eventos
  var navigation = this;

  $scope.$on(constants.EVENTS.NAVIGATION_CHECK_CARD, function () {
    navigation.checkCard();
  });

  $scope.$on(constants.EVENTS.NAVIGATION_SET_VIEW, function (event, data) {
    navigation.setView(data.view);
  });

  $scope.$on(constants.EVENTS.NAVIGATION_SET_PRODUCTS, function (event, data) {
    navigation.setProducts(data.products);
    navigation.setView(data.products[0].id, data.products[0]);
  });

  if (constants.SETTINGS.DEBUG) {
    $scope.exposeScope('NavigationController', $scope);
  }

  this.vrDefaultView();

}]);
