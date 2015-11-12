import {configuration} from './config';
import {routes} from './routes';

import {controllers} from './controllers/index';
import {directives} from './directives/index';
import {entities} from './entities/index';
import {filters} from './filters/index';
import {resources} from './resources/index';
import {services} from './services/index';

angular.module('lodash', []).factory('_', () => window._);
angular.module('dagreD3', []).factory('dagreD3', () => window.dagreD3);
angular.module('d3', []).factory('d3', () => window.d3);
angular.module('graphlib', []).factory('graphlib', () => window.graphlib);

angular
    .module('ALEX', [

        // plain js libraries as modules
        'lodash',
        'dagreD3',
        'd3',
        'graphlib',

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
    .config(configuration.config)
    .config(routes.config)
    .run(configuration.run)
    .run(routes.run);