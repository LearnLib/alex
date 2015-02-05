(function(){

    angular
        .module('weblearner.resources')
        .constant('api', {
            URL: '/rest',
            PROXY_URL: '/rest/proxy?url='
        });
}());