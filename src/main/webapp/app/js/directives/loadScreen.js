(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('loadScreen', ['$http', loadScreen]);

    function loadScreen($http) {

        var directive = {
            templateUrl: 'app/partials/directives/load-screen.html',
            link: link
        };
        return directive;

        //////////

        function link (scope, el, attrs) {
        	        	            
        	scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if(v){
                	el[0].style.display = 'block'
                }else{
                	el[0].style.display = 'none'
                }
            });
        }
    }
}());