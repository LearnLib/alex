(function(){
	'use strict';

	describe('ProjectCreateController', function(){
	    var scope;

	    beforeEach(angular.mock.module('weblearner'));
	    beforeEach(angular.mock.module('weblearner.controller'));

	    beforeEach(angular.mock.inject(function($rootScope, $controller) {
	        scope = $rootScope.$new();
	        $controller('ProjectCreateController', {
	        	$scope: scope
	        });
	    }));
	});
}());