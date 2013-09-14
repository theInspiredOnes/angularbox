angular.module 'angularbox', []

angular.module('angularbox').service 'registerServ', ->
	noRel = '$$none'
	register = {}

	class Slide
		constructor: (@rel = noRel, @src, @title = '') ->

	getRegister = (rel) ->
		register[if typeof rel is 'undefined' then noRel else rel]

	@add = (rel, src, title) ->
		if typeof src is 'undefined' then return undefined
		slide = new Slide rel, src, title
		if register.hasOwnProperty slide.rel
			register[slide.rel].push slide
		else
			register[slide.rel] = [slide]
		slide.id = register[slide.rel].length - 1

	@get = (rel, id) ->
		if typeof id is 'undefined' then return null
		reg = getRegister rel
		unless 0 <= id < reg.length then return null
		reg[id]

	@next = (rel, id) ->
		reg = getRegister rel
		@get rel, (id + 1) % reg.length

	@prev = (rel, id) ->
		reg = getRegister rel
		id = reg.length - 1 if --id < 0
		@get(rel, id)
	return

angular.module('angularbox').directive 'angularbox', ->
	restrict: 'A'
	replace: true
	template:
		'''
		<div class="angularbox-style hidden" data-ng-click="close($event)" data-ng-class="{hidden: isHidden, fadeout: isFading}">
			<figure>
				<img src={{src}} data-ng-class="{loaded: !isLoading}" data-ng-click="catch($event)" />
				<figcaption data-ng-show="caption"><span data-ng-click="catch($event)">{{caption}}</span></figcaption>
			</figure>
			<div class="spinner" data-ng-show="isLoading"><span></span><span></span><span></span>
			</div>
			<button class="prev" title="previous" data-ng-click="prev($event)">&lsaquo;</button>
			<button class="next" title="next" data-ng-click="next($event)">&rsaquo;</button>
			<button class="close" title="close">&times;</button>
		</div>
		'''
	controller:
		($scope, $element, $timeout, $window, $document, registerServ) ->
			current = {}
			transition = 250
			img = angular.element $element.children()[0].childNodes[1]
			$scope.isHidden = yes
			$scope.isLoading = no
			$scope.isFading = no

			# img.bind 'load', ->
			# 	$scope.isLoading = no
			# 	$scope.$apply()
			# 	return

			key = ($event) ->
				if $scope.isHidden or $scope.isFading then return
				switch $event.keyCode
					when 27 then $scope.close $event
					when 39 then $scope.next $event
					when 37 then $scope.prev $event
				$scope.$apply()
				return

			$document.bind 'keydown', key

			open = (e, rel, id) ->
				current = registerServ.get rel, id
				$scope.isHidden = no
				$scope.$apply show
				return

			$scope.$on 'angularboxOpen', open

			show = ->
				# $scope.isLoading = yes
				$scope.src = current.src
				$scope.caption = current.title
				return

			hide = ->
				$scope.isFading = no
				$scope.isHidden = yes
				$scope.src = $scope.caption = ''
				return

			$scope.close = ($event) ->
				$event.stopPropagation()
				$scope.isFading = yes
				$timeout hide, transition
				return

			$scope.next = ($event) ->
				$event.stopPropagation()
				current = registerServ.next current.rel, current.id
				show()
				return

			$scope.prev = ($event) ->
				$event.stopPropagation()
				current = registerServ.prev current.rel, current.id
				show()
				return

			$scope.catch = ($event) ->
				$event.stopPropagation()
				return
			return

angular.module('angularbox').directive 'angularbox',
	($rootScope, registerServ) ->
		restrict: 'C'
		link: ($scope, $elm, $attrs) ->
			rel = $attrs.rel
			id = registerServ.add rel, $attrs.href, $attrs.title
			$elm.bind 'click', (e) ->
				e.preventDefault()
				$rootScope.$broadcast 'angularboxOpen', rel, id
			return
