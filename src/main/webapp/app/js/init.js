angular
    .module('weblearner', [

        // modules from external libraries
        'ngAnimate',
        'ui.sortable',
        'ui.bootstrap',
        'ui.ace',
        'ui.router',
        'ngToast',

        // application specific modules
        'weblearner.controller',
        'weblearner.resources',
        'weblearner.directives',
        'weblearner.enums',
        'weblearner.services',
        'weblearner.filters'
    ]);

angular
    .module('weblearner.controller', []);

angular
    .module('weblearner.resources', []);

angular
    .module('weblearner.directives', []);

angular
    .module('weblearner.enums', []);

angular
    .module('weblearner.services', []);

angular
    .module('weblearner.filters', []);