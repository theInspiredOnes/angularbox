angular.module('angularbox', [])

.service('registerServ', function() {
	var serv = {},
	noRel = '$$none',
	register = {},
	getRegister = function(rel) {
		if (rel == undefined) {
			return register[noRel];
		}

		return register[rel];
	}

	function Slide(rel, src, title) {
		this.rel = rel || noRel;
		this.id;
		this.src = src;
		this.title = title || '';
	}

	serv.add = function(rel, src, title) {
		if (src == undefined) {
			return undefined;
		}

		var slide = new Slide(rel, src, title);

		if (register.hasOwnProperty(slide.rel)) {
			register[slide.rel].push(slide);
		} else {
			register[slide.rel] = [slide];
		}

		slide.id = register[slide.rel].length - 1;

		return slide.id;
	}

	serv.get = function(rel, id) {
		if (id == undefined) {
			return null;
		}

		var reg = getRegister(rel);

		if (reg.length <= id || id < 0) {
			return null;
		}
		
		return reg[id];
	}

	serv.next = function(rel, id) {
		var reg = getRegister(rel);

		return this.get(rel, (id + 1) % reg.length);
	}

	serv.prev = function(rel, id) {
		var reg = getRegister(rel);

		if (--id < 0) {
			id = reg.length - 1;
		}

		return this.get(rel, id);
	}

	return serv;
})

.directive('angularbox', function() {
	return {
		restrict: "A",
		replace: true,
		template: 
		'<div class="box hidden" data-ng-click="close($event)" data-ng-class="{hidden: hidden, fadeout: fadeout}">' +
			'<figure>' +
				'<img src="{{src}}"/>' +
				'<button class="close" title="close" data-ng-click="close($event)">x</button>' +
				'<figcaption data-ng-show="caption">{{caption}}</figcaption>' +
			'</figure>' +
		'</div>'/*,
		link: function($scope, $elm, $attrs) {
		}*/,
		controller:
			['$scope', '$element', '$timeout', '$window', '$document', 'registerServ',
			function($scope, $element, $timeout, $window, $document, registerServ) {
			var current,
				transition = 250,
				img = $element.children()[0].childNodes[0];

			/*img.onload = function() {
				$scope.width = (this.naturalWidth > $window.innerWidth) ? $window.innerWidth : this.naturalWidth;
				$scope.height = (this.naturalHeight > $window.innerHeight) ? $window.innerHeight : this.naturalHeight;
				$scope.$apply();
			};*/

			$scope.hidden = true;
			$scope.$on('angularboxOpen', open);
			$document.bind('keydown', key);

			$scope.close = function($event) {
				$event.stopPropagation();
				$scope.fadeout = true;
				$timeout(function() {
					$scope.fadeout = false;
					$scope.hidden = true;
				}, transition);
			}

			$scope.next = function($event) {
				$event.stopPropagation();
				current = registerServ.next(current.rel, current.id);
				show();
			}

			$scope.prev = function($event) {
				$event.stopPropagation();
				current = registerServ.prev(current.rel, current.id);
				show();
			}

			function key($event) {
				if ($scope.hidden || $scope.fadeout) {
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
						break;
					default:
						console.log($event.keyCode);
				}

				$scope.$apply();
			}

			function open(e, rel, id) {
				current = registerServ.get(rel, id);
				$scope.hidden = false;
				show();
				$scope.$apply();
			}

			function show() {
				$scope.src = current.src;
				$scope.caption = current.title;
			}
		}]
	};
})

.directive('angularbox', ['$rootScope', 'registerServ', function($rootScope, registerServ) {
	return {
		restrict: "C",
		link: function($scope, $elm, $attrs) {
			var rel = $attrs.rel;
			var id = registerServ.add(rel, $attrs.href, $attrs.title);

			$elm.bind('click', function(e) {
				e.preventDefault();
				$rootScope.$broadcast('angularboxOpen', rel, id);
			});
		}
	};
}]);