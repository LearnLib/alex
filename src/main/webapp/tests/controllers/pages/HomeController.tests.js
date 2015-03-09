(function(){
	'use strict';
	 
	describe('HomeController', function(){
	    var scope;

	    var projects = [
	        {
                name: 'test',
                baseUrl: 'http://localhost',
                description: null
            },
            {
                name: 'test2',
                baseUrl: 'http://localhost',
                description: null
            }
        ];
	 
	    beforeEach(angular.mock.module('weblearner'));
	    beforeEach(angular.mock.module('weblearner.controller'));

	    beforeEach(angular.mock.inject(function($rootScope, $controller, $injector) {
	        scope = $rootScope.$new();
	        $controller('HomeController', {
	        	$scope: scope
	        });
	    }));

	    it('should save a project in sessionStorage', function(){
	        scope.openProject(projects[0]);
            expect(sessionStorage.getItem('project')).not.toBeNull();
            sessionStorage.clear();
        });
	});
}());