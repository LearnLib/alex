/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import angularDragula from 'angular-dragula';
import ngFileUpload from 'ng-file-upload';
import angularJwt from 'angular-jwt';
import d3 from 'd3/d3';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from 'angular-ui-router';
import toastr from 'angular-toastr';

import {configuration} from './config';
import {routes} from './routes';
import * as constant from './constants';

import {directives} from './directives/index';
import {filters} from './filters/index';
import {resources} from './resources/index';
import {services} from './services/index';
import {components} from './components/index';

angular
    .module('ALEX', [

        // modules from external libraries
        'ngAnimate',
        'ngMessages',
        uiBootstrap,
        uiRouter,
        'ui.ace',
        'n3-line-chart',
        'selectionModel',
        toastr,
        angularJwt,
        ngFileUpload,
        angularDragula(angular),

        // application specific modules
        'ALEX.templates',
        components,
        directives,
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