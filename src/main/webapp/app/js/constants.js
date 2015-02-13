(function(){

    angular
        .module('weblearner.resources')
        .constant('api', {
            URL: '/rest',
            PROXY_URL: '/rest/proxy?url='
        })
    	.constant('paths', {
    		PARTIALS: '/app/partials',
    		PARTIALS_DIRECTIVES: 'app/partials/directives',
    		PARTIALS_MODALS: 'app/partials/directives',
    		PARTIALS_WIDGETS: 'app/partials/widgets'
    	})
}());