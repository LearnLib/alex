(function(){
	'use strict';
	 
	describe('HomeController', function(){
	    var scope;
	 
	    beforeEach(angular.mock.module('weblearner'));
	    beforeEach(angular.mock.module('weblearner.controller'));

	    beforeEach(angular.mock.inject(function($rootScope, $controller) {
	        scope = $rootScope.$new();
	        $controller('HomeController', {
	        	$scope: scope
	        });
	    }));
	    
	    it('should have no projects', function(){
	    	expect(scope.projects).toEqual([]);
	    })
	    
	});
}())