(function() {
	'use strict';

	angular.module('weblearner.filters')
		.filter('typeOfRest', typeOfRest)
		.filter('typeOfWeb', typeOfWeb);

	/**
	 * The filter that takes an array of objects and returns only those with a
	 * property 'type' with the value 'rest'
	 * 
	 * @return {Function}
	 */
	function typeOfRest() {
		return function(list) {
			return _.filter(list, {
				type : 'rest'
			})
		}
	}

	/**
	 * The filter that takes an array of objects and returns only those with a
	 * property 'type' with the value 'web'
	 * 
	 * @return {Function}
	 */
	function typeOfWeb() {
		return function(list) {
			return _.filter(list, {
				type : 'web'
			})
		}
	}
}());