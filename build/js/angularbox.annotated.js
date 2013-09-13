var angularbox;
angularbox = angular.module('angularbox', []);
angularbox.service('registerServ', function () {
  var Slide, getRegister, noRel, register;
  noRel = '$$none';
  register = {};
  Slide = function () {
    function Slide(rel, src, title) {
      this.rel = rel != null ? rel : noRel;
      this.src = src;
      this.title = title != null ? title : '';
    }
    return Slide;
  }();
  getRegister = function (rel) {
    return register[typeof rel === 'undefined' ? noRel : rel];
  };
  this.add = function (rel, src, title) {
    var slide;
    if (typeof src === 'undefined') {
      return void 0;
    }
    slide = new Slide(rel, src, title);
    if (register.hasOwnProperty(slide.rel)) {
      register[slide.rel].push(slide);
    } else {
      register[slide.rel] = [slide];
    }
    return slide.id = register[slide.rel].length - 1;
  };
  this.get = function (rel, id) {
    var reg;
    if (typeof id === 'undefined') {
      return null;
    }
    reg = getRegister(rel);
    if (!(0 <= id && id < reg.length)) {
      return null;
    }
    return reg[id];
  };
  this.next = function (rel, id) {
    var reg;
    reg = getRegister(rel);
    return this.get(rel, (id + 1) % reg.length);
  };
  this.prev = function (rel, id) {
    var reg;
    reg = getRegister(rel);
    if (--id < 0) {
      id = reg.length - 1;
    }
    return this.get(rel, id);
  };
});
angularbox.directive('angularbox', function () {
  return {
    restrict: 'A',
    replace: true,
    template: '<div class="angularbox-style hidden" data-ng-click="close($event)" data-ng-class="{hidden: isHidden, fadeout: isFading}">\n\t<figure>\n\t\t<img data-ng-src={{src}} data-ng-class="{loaded: !isLoading}" data-ng-click="catch($event)" />\n\t\t<figcaption data-ng-show="caption"><span data-ng-click="catch($event)">{{caption}}</span></figcaption>\n\t</figure>\n\t<div class="spinner" data-ng-show="isLoading"><span></span><span></span><span></span>\n\t</div>\n\t<button class="prev" title="previous" data-ng-click="prev($event)">&lsaquo;</button>\n\t<button class="next" title="next" data-ng-click="next($event)">&rsaquo;</button>\n\t<button class="close" title="close">&times;</button>\n</div>',
    controller: [
      '$scope',
      '$element',
      '$timeout',
      '$window',
      '$document',
      'registerServ',
      function ($scope, $element, $timeout, $window, $document, registerServ) {
        var current, hide, img, key, open, show, transition;
        current = {};
        transition = 250;
        img = angular.element($element.children()[0].childNodes[1]);
        $scope.isHidden = true;
        $scope.isLoading = $scope.isFading = false;
        img.bind('load', function () {
          $scope.isLoading = false;
          $scope.$apply();
        });
        key = function ($event) {
          if ($scope.isHidden || $scope.isFading) {
            return;
          }
          switch ($event.keyCode) {
          case 27:
            $scope.close($event);
            break;
          case 39:
            $scope.next($event);
            break;
          case 37:
            $scope.prev($event);
          }
          $scope.$apply();
        };
        $document.bind('keydown', key);
        open = function (e, rel, id) {
          current = registerServ.get(rel, id);
          $scope.isHidden = false;
          $scope.$apply(show);
        };
        $scope.$on('angularboxOpen', open);
        show = function () {
          $scope.isLoading = true;
          $scope.src = current.src;
          $scope.caption = current.title;
        };
        hide = function () {
          $scope.isFading = false;
          $scope.isHidden = true;
        };
        $scope.close = function ($event) {
          $event.stopPropagation();
          $scope.isFading = true;
          $timeout(hide, transition);
        };
        $scope.next = function ($event) {
          $event.stopPropagation();
          current = registerServ.next(current.rel, current.id);
          show();
        };
        $scope.prev = function ($event) {
          $event.stopPropagation();
          current = registerServ.prev(current.rel, current.id);
          show();
        };
        $scope['catch'] = function ($event) {
          $event.stopPropagation();
        };
      }
    ]
  };
});
angularbox.directive('angularbox', [
  '$rootScope',
  'registerServ',
  function ($rootScope, registerServ) {
    return {
      restrict: 'C',
      link: function ($scope, $elm, $attrs) {
        var id, rel;
        rel = $attrs.rel;
        id = registerServ.add(rel, $attrs.href, $attrs.title);
        $elm.bind('click', function (e) {
          e.preventDefault();
          return $rootScope.$broadcast('angularboxOpen', rel, id);
        });
      }
    };
  }
]);