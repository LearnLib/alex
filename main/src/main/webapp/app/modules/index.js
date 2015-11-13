import {configuration} from './config';
import {routes} from './routes';

import {controllers} from './controllers/index';
import {directives} from './directives/index';
import {entities} from './entities/index';
import {filters} from './filters/index';
import {resources} from './resources/index';
import {services} from './services/index';

angular
    .module('ALEX', [

        // modules from external libraries
        'ngAnimate',
        'ui.bootstrap',
        'ui.ace',
        'ui.router',
        'ngToast',
        'n3-line-chart',
        'selectionModel',
        'ng-sortable',
        'ngFileUpload',
        'angular-jwt',

        // application specific modules
        'ALEX.templates',
        controllers,
        directives,
        entities,
        filters,
        resources,
        services
    ])
    .constant('_', window._)
    .config(configuration.config)
    .config(routes.config)
    .run(configuration.run)
    .run(routes.run);