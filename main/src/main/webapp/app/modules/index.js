import angularDragula from 'angular-dragula';
import ngFileUpload from 'ng-file-upload';
import angularJwt from 'angular-jwt';
import d3 from 'd3/d3';

import {configuration} from './config';
import {routes} from './routes';
import * as constant from './constants';

import {controllers} from './controllers/index';
import {directives} from './directives/index';
import {entities} from './entities/index';
import {filters} from './filters/index';
import {resources} from './resources/index';
import {services} from './services/index';
import {components} from './components/index';

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
        angularJwt,
        ngFileUpload,
        angularDragula(angular),

        // application specific modules
        'ALEX.templates',
        controllers,
        components,
        directives,
        entities,
        filters,
        resources,
        services
    ])
    .config(configuration.config)
    .config(routes.config)
    .run(routes.run)
    .constant('learnAlgorithm', constant.learnAlgorithm)
    .constant('webBrowser', constant.webBrowser)
    .constant('eqOracleType', constant.eqOracleType)
    .constant('events', constant.events)
    .constant('actionType', constant.actionType)
    .constant('chartMode', constant.chartMode);

window.d3 = d3;

angular.bootstrap(document, ['ALEX']);