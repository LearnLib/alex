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
    .module('weblearner.filters', []);;(function () {
    'use strict';

    angular
        .module('weblearner')
        .config([
            '$stateProvider', '$urlRouterProvider', 'ngToastProvider',
            config
        ]);

    /**
     * Application routes
     * @param $stateProvider
     * @param $urlRouterProvider
     */
    function config($stateProvider, $urlRouterProvider, ngToastProvider) {

        ngToastProvider.configure({
            verticalPosition: 'top',
            horizontalPosition: 'center',
            maxNumber: 1
        });

        // redirect to the start page when no other route fits
        $urlRouterProvider.otherwise("/");

        $stateProvider

            // =========================================================
            // index route

            .state('state0', {
                url: '/',
                controller: 'IndexController',
                templateUrl: 'app/partials/index.html',
                data: {
                    requiresProject: false
                }
            })

            // =========================================================
            // project related routes

            .state('state1', {
                url: '/project/create',
                controller: 'ProjectCreateController',
                templateUrl: 'app/partials/project-create.html',
                data: {
                    requiresProject: false
                }
            })
            .state('state2', {
                url: '/project/:projectId',
                controller: 'DashboardController',
                templateUrl: 'app/partials/dashboard.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state3', {
                url: '/project/:projectId/settings',
                templateUrl: 'app/partials/project-settings.html',
                controller: 'ProjectSettingsController',
                data: {
                    requiresProject: true
                }
            })

            // =========================================================
            // editor related routes

            .state('state4', {
                url: '/project/:projectId/editor/symbols/web',
                controller: 'EditorSymbolController',
                templateUrl: 'app/partials/editor-symbols.html',
                data: {
                    requiresProject: true
                },
                resolve: {
                    type: function () {
                        return 'web'
                    }
                }
            })
            .state('state5', {
                url: '/project/:projectId/editor/symbols/rest',
                controller: 'EditorSymbolController',
                templateUrl: 'app/partials/editor-symbols.html',
                data: {
                    requiresProject: true
                },
                resolve: {
                    type: function () {
                        return 'rest'
                    }
                }
            })
            .state('state6', {
                url: '/project/:projectId/editor/actions/:symbolId',
                controller: 'EditorActionController',
                templateUrl: 'app/partials/editor-actions.html',
                data: {
                    requiresProject: true
                }
            })

            // =========================================================
            // test and learn related routes

            .state('state7', {
                url: '/project/:projectId/test/setup/web',
                controller: 'TestSetupController',
                templateUrl: 'app/partials/test-setup.html',
                data: {
                    requiresProject: true
                },
                resolve: {
                    type: function () {
                        return 'web'
                    }
                }
            })
            .state('state71', {
                url: '/project/:projectId/test/setup/rest',
                controller: 'TestSetupController',
                templateUrl: 'app/partials/test-setup.html',
                data: {
                    requiresProject: true
                },
                resolve: {
                    type: function () {
                        return 'rest'
                    }
                }
            })
            .state('state8', {
                url: '/project/:projectId/learn',
                controller: 'LearnController',
                templateUrl: 'app/partials/learn.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state9', {
                url: '/project/:projectId/test/result',
                controller: 'TestResultController',
                templateUrl: 'app/partials/test-result.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state15', {
                url: '/project/:projectId/test/result/:testNo',
                controller: 'HypothesesSlideshowController',
                templateUrl: 'app/partials/hypotheses-slideshow.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state10', {
                url: '/project/:projectId/statistics',
                controller: 'StatisticsController',
                templateUrl: 'app/partials/statistics.html',
                data: {
                    requiresProject: true
                }
            })

            // =========================================================
            // symbol related routes

            .state('state11', {
                url: '/project/:projectId/symbol/upload',
                controller: 'SymbolUploadController',
                templateUrl: 'app/partials/symbol-upload.html',
                data: {
                    requiresProject: true
                }
            })
            .state('state12', {
                url: '/project/:projectId/symbol/export',
                controller: 'SymbolExportController',
                templateUrl: 'app/partials/symbol-export.html',
                data: {
                    requiresProject: true
                }
            })

            // =========================================================
            // static pages related routes

            .state('state13', {
                url: '/about',
                templateUrl: 'app/partials/about.html',
                data: {
                    requiresProject: false
                }
            })
            .state('state14', {
                url: '/help',
                templateUrl: 'app/partials/help.html',
                data: {
                    requiresProject: false
                }
            })
    }

    //////////

    angular.module('weblearner')
        .run([
            '$rootScope', '$state', 'SessionService',
            run
        ]);

    function run ($rootScope, $state, SessionService) {

        // route validation
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.data.requiresProject && SessionService.project.get() == null) {
                $state.transitionTo("state0");
                event.preventDefault();
            }
        });
    }
}());;(function(){

    angular
        .module('weblearner.resources')
        .constant('api', {
            URL: '/rest',
            PROXY_URL: '/rest/proxy?url='
        });
}());;(function () {
    'use strict';

    angular
        .module('weblearner.enums')

        // web action types
        .constant('WebActionTypesEnum', {
            SEARCH_FOR_TEXT: 'checkText',
            SEARCH_FOR_NODE: 'checkNode',
            CLEAR: 'clear',
            CLICK: 'click',
            FILL: 'fill',
            GO_TO: 'goto',
            SUBMIT: 'submit',
            WAIT: 'wait'
        })

        // rest action types
        .constant('RestActionTypesEnum', {
            CALL_URL: 'call',
            CHECK_STATUS: 'checkStatus',
            CHECK_HEADER_FIELD: 'checkHeaderField',
            CHECK_HTTP_BODY_TEXT: 'checkForText',
            CHECK_ATTRIBUTE_EXISTS: 'checkAttributeExists',
            CHECK_ATTRIBUTE_VALUE: 'checkAttributeValue',
            CHECK_ATTRIBUTE_TYPE: 'checkAttributeType'
        })

        // eq oracles
        .constant('EqOraclesEnum', {
            RANDOM: 'random_word',
            COMPLETE: 'complete',
            SAMPLE: 'sample'
        })

        // learn algorithms
        .constant('LearnAlgorithmsEnum', {
            EXTENSIBLE_LSTAR: 'EXTENSIBLE_LSTAR',
            DHC: 'DHC',
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE'
        })

}());;(function(){
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('DashboardController', [
            '$scope', 'SessionService',
            DashboardController
        ]);

    function DashboardController($scope, SessionService) {

        $scope.project = SessionService.project.get();
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('EditorActionController', [
            '$scope', '$stateParams', 'SymbolResource', 'SessionService', 'SelectionService', 'WebActionTypesEnum', 'RestActionTypesEnum', 'ngToast',
            EditorActionController
        ]);

    function EditorActionController($scope, $stateParams, SymbolResource, SessionService, SelectionService, WebActionTypesEnum, RestActionTypesEnum, toast) {

        var _id = 0;

        //////////

        /** the enum for web action types that are displayed in a select box */
        $scope.webActionTypes = WebActionTypesEnum;

        /** the enum for rest action types that are displayed in a select box */
        $scope.restActionTypes = RestActionTypesEnum;

        //////////

        /** the open project */
        $scope.project = SessionService.project.get();

        /** the symbol whose actions are managed */
        $scope.symbol = null;

        /** a copy of $scope.symbol to revert unsaved changes */
        $scope.symbolCopy = null;

        //////////

        // load all actions from the symbol
        SymbolResource.get($scope.project.id, $stateParams.symbolId).then(function (symbol) {

            _.forEach(symbol.actions, function (action) {
                action._id = _id++;
            });

            $scope.symbol = symbol;
            $scope.symbolCopy = angular.copy($scope.symbol);
        });

        //////////

        /**
         * delete the actions that the user selected from the scope
         */
        $scope.deleteActions = function () {
            var selectedActions = SelectionService.getSelected($scope.symbol.actions);
            if (selectedActions.length > 0) {
                _.forEach(selectedActions, function (action) {
                    _.remove($scope.symbol.actions, {_id: action._id})
                });
                toast.create({
                    class: 'success',
                    content: 'Actions deleted'
                });
            }
        };

        /**
         * add a new action to the list of actions of the symbol
         * @param action
         */
        $scope.addAction = function (action) {
            action._id = _id++;
            $scope.symbol.actions.push(action);
        };

        /**
         * update an action
         * @param updatedAction
         */
        $scope.updateAction = function (updatedAction) {
            var index = _.findIndex($scope.symbol.actions, {_id: updatedAction._id});
            if (index > -1) {
                $scope.symbol.actions[index] = updatedAction;
            }
        };

        /**
         * save the changes that were made to the symbol by updating it on the server
         */
        $scope.saveChanges = function () {
            var copy = angular.copy($scope.symbol);
            SelectionService.removeSelection(copy.actions);
            _.forEach(copy.actions, function (action) {
                delete action._id;
            });
            SymbolResource.update($scope.project.id, copy)
                .then(function (updatedSymbol) {

                    _id = 0;
                    _.forEach(updatedSymbol.actions, function (action) {
                        action._id = _id++;
                    });

                    $scope.symbol = updatedSymbol;
                    $scope.symbolCopy = angular.copy(updatedSymbol);
                })
        };

        /**
         * revert the changes that were made to the symbol
         */
        $scope.revertChanges = function () {
            $scope.symbol = angular.copy($scope.symbolCopy);
        };
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('EditorSymbolController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService', 'type',
            EditorSymbolController
        ]);

    function EditorSymbolController($scope, SessionService, SymbolResource, SelectionService, type) {

        /** the open project @type {*} */
        $scope.project = SessionService.project.get();

        /** the symbol type @type {string} */
        $scope.type = type;

        /** the list of web or rest symbols @type {[]|*[]} */
        $scope.symbols = [];

        //////////

        // load symbols from the server
        switch ($scope.type) {
            case 'web':
                // web symbols
                SymbolResource.allWeb($scope.project.id)
                    .then(function (symbols) {
                        $scope.symbols = symbols;
                    });
                break;
            case 'rest':
                // rest symbols
                SymbolResource.allRest($scope.project.id)
                    .then(function (symbols) {
                        $scope.symbols = symbols;
                    });
                break;
            default:
                break;
        }

        //////////

        /**
         * @description deletes the symbols that the user selected from the server and the scope
         */
        $scope.deleteSelectedSymbols = function () {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            if (selectedSymbols.length > 0) {
                SelectionService.removeSelection(selectedSymbols);
                _.forEach(selectedSymbols, function (symbol) {
                    SymbolResource.delete(symbol.project, symbol.id)
                        .then(function () {
                            _.remove($scope.symbols, function (s) {
                                return s.id == symbol.id
                            })
                        })
                })
            }
        };

        /**
         * @description add a symbol to the scope
         * @param symbol {{}}
         */
        $scope.addSymbol = function (symbol) {
            $scope.symbols.push(symbol)
        };

        /**
         * @description updates a symbol in the scope
         * @param symbol {{}}
         */
        $scope.updateSymbol = function (symbol) {
            var index = _.findIndex($scope.symbols, {id: symbol.id});
            if (index > -1) {
                SelectionService.select(symbol);
                $scope.symbols[index] = symbol;
            }
        };
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('HypothesesSlideshowController', [
            '$scope', '$stateParams', 'SessionService', 'TestResource',
            HypothesesSlideshowController
        ]);

    function HypothesesSlideshowController($scope, $stateParams, SessionService, TestResource) {

        $scope.project = SessionService.project.get();
        $scope.tests = [];
        $scope.panels = [];

        //////////

        TestResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
                return $stateParams.testNo;
            })
            .then(loadIntermediateResults);

        //////////

        function loadIntermediateResults(testNo, index) {
            TestResource.getComplete($scope.project.id, testNo)
                .then(function (steps) {
                    if (!index) {
                        $scope.panels.push({
                            testNo: testNo,
                            steps: steps,
                            pointer: steps.length - 1
                        })
                    } else {
                        $scope.panels[index] = {
                            testNo: testNo,
                            steps: steps,
                            pointer: steps.length - 1
                        }
                    }
                })
        }

        //////////

        $scope.getPanelStyle = function (index) {

            var width = 100 / $scope.panels.length;
            var style = 'width: ' + width + '%; ' +
                'top: 50px; bottom: 0; background: #fff; border-right: 1px solid #e7e7e7; position: absolute;' +
                'left: ' + (index * width) + '%';

            return style;
        };

        $scope.closePanel = function (index) {
            $scope.panels.splice(index, 1);
        };

        $scope.addEmptyPanel = function () {
            $scope.panels.push({})
        };

        $scope.addPanel = function (test, index) {
            loadIntermediateResults(test.testNo, index);
        };

        $scope.clearPanel = function (index) {
            $scope.panels[index] = {}
        }
    }

}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('IndexController', [
            '$scope', '$location', 'ProjectResource', 'SessionService',
            IndexController
        ]);

    /**
     * IndexController
     *
     * The controller for the landing page. It lists the projects.
     *
     * @param $scope
     * @param $location
     * @param ProjectResource
     * @param SessionService
     * @constructor
     */
    function IndexController($scope, $location, ProjectResource, SessionService) {

        /** The project list */
        $scope.projects = [];

        //////////

        // redirect to the project dash page if one is open
        if (SessionService.project.get() != null) {
            $location.path('/project/' + SessionService.project.get().id);
        }

        // get all projects from the server
        ProjectResource.all()
            .then(function (projects) {
                $scope.projects = projects;
            });

        //////////

        /**
         * Open a project by saving it into the session and redirect to the projects dashboard.
         *
         * @param project
         */
        $scope.openProject = function (project) {
            SessionService.project.save(project);
            $location.path('/project/' + project.id);
        }
    }
}());;(function () {

    angular
        .module('weblearner.controller')
        .controller('LearnController', [
            '$scope', '$interval', 'SessionService', 'LearnerResource',
            LearnController
        ]);

    /**
     * LearnController
     *
     * Shows a load screen and the hypothesis of a test.
     *
     * @param $scope
     * @param $interval
     * @param SessionService
     * @param Learner
     * @constructor
     */
    function LearnController($scope, $interval, SessionService, LearnerResource) {

        var _project = SessionService.project.get();
        var _interval = null;
        var _intervalTime = 10000;

        //////////

        /** the test result **/
        $scope.test = null;

        /** indicator for polling the server for a test result */
        $scope.active = false;

        /** indicator if eqOracle was type 'sample' **/
        $scope.isEqOracleSample = false;

        $scope.counterExample = {
            input: '',
            output: ''
        };

        //////////

        // start polling the server
        _poll();

        //////////

        /**
         * check every x seconds if the server has finished learning and set the test if he did finish
         * @private
         */
        function _poll() {

            $scope.active = true;
            _interval = $interval(function () {
                LearnerResource.isActive()
                    .then(function (active) {
                        if (!active) {
                            LearnerResource.status()
                                .then(function (test) {
                                    $scope.active = false;
                                    $scope.test = test;
                                    $scope.isEqOracleSample = test.configuration.eqOracle.type == 'sample';
                                });
                            $interval.cancel(_interval);
                        }
                    })
            }, _intervalTime);
        }

        //////////

        /**
         * Update the configuration for the continuing test when choosing eqOracle 'sample' and showing an intermediate
         * hypothesis
         *
         * @param config
         */
        $scope.updateLearnConfiguration = function (config) {

            $scope.test.configuration = config;
        };

        /**
         * Tell the server to continue learning with the new or old learn configuration when eqOracle type was 'sample'
         *
         * @param config
         */
        $scope.resumeLearning = function () {

            var copy = angular.copy($scope.test.configuration);
            delete copy.algorithm;
            delete copy.symbols;

            LearnerResource.resume(_project.id, $scope.test.testNo, copy)
                .then(function () {
                    _poll();
                })
        }
    }

}());
;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('NavigationController', [
            '$scope', '$location', 'SessionService',
            NavigationController
        ]);

    /**
     * the controller to handle the app navigation
     * @template 'app/partials/navs/nav-main.html'
     * @param $scope
     * @param $location
     * @param Session
     * @constructor
     */
    function NavigationController($scope, $location, Session) {

        /** the project or null if not open */
        $scope.project = Session.project.get();

        //////////

        // load project into scope when projectOpened is emitted
        $scope.$on('project.opened', function () {
            $scope.project = Session.project.get();
        });

        // delete project from scope when projectOpened is emitted
        $scope.$on('project.closed', function () {
            $scope.project = null;
        });

        //////////

        /**
         * remove the project object from the session and redirect to the start page
         */
        $scope.closeProject = function () {
            Session.project.remove();
            $location.path('/');
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectCreateController', [
            '$scope', '$location', 'ProjectResource',
            ProjectCreateController
        ]);

    /**
     * create a new project
     * @template 'app/partials/project-create.html'
     * @param $scope
     * @param $location
     * @param Project
     * @constructor
     */
    function ProjectCreateController($scope, $location, ProjectResource) {

        /** @type {{}} */
        $scope.project = {};

        //////////

        /**
         * create a new project
         */
        $scope.createProject = function () {
            if ($scope.create_form.$valid) {
                ProjectResource.create($scope.project)
                    .then(function (project) {
                        $location.path('/');
                    })
            } else {
                $scope.create_form.submitted = true;
            }
        };

        /**
         * reset the form
         */
        $scope.reset = function () {
            $scope.project = {}
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', [
            '$scope', '$location', 'ProjectResource', 'SessionService',
            ProjectSettingsController
        ]);

    function ProjectSettingsController($scope, $location, ProjectResource, SessionService) {

        $scope.project = SessionService.project.get();
        $scope.projectCopy = SessionService.project.get();

        //////////

        $scope.updateProject = function () {
            if ($scope.update_form.$valid) {
                ProjectResource.update($scope.project)
                    .then(function (project) {
                        SessionService.project.save(project);
                        $scope.project = project;
                        $scope.projectCopy = project;
                    })
            } else {
                $scope.update_form.submitted = true;
            }
        };

        $scope.deleteProject = function () {
            ProjectResource.delete($scope.project)
                .then(function () {
                    SessionService.project.remove();
                    $location.path('/')
                })
        };

        $scope.reset = function () {
            $scope.project = angular.copy($scope.projectCopy);
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('StatisticsController', [
            '$scope', 'SessionService', 'TestResource', 'TestResultsChartService', 'SelectionService',
            StatisticsController
        ]);

    /**
     * StatisticsController
     *
     * The controller that is used for the statistics page
     *
     * @param $scope
     * @param SessionService
     * @param TestResource
     * @param TestResultsChartService
     * @param SelectionService
     * @constructor
     */
    function StatisticsController($scope, SessionService, TestResource, TestResultsChartService, SelectionService) {

        /** The open project */
        $scope.project = SessionService.project.get();

        /** The tests of the project @type {Array} */
        $scope.tests = [];

        /** Enum for the kind of chart that will be displayed **/
        $scope.chartModes = {
            SINGLE_COMPLETE_TEST_RESULT: 0,
            MULTIPLE_FINAL_TEST_RESULTS: 1,
            TWO_COMPLETE_TEST_RESULTS: 2
        };

        /** The active mode **/
        $scope.chartMode;

        /** The sets of chart data that is displayed on the chart **/
        $scope.chartDataSets = [];

        //////////

        // get all final tests of the project
        TestResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
            });

        //////////

        /**
         * Create chart data from multiple selected final test results
         */
        $scope.chartFromMultipleFinalTestResults = function () {
            var tests = SelectionService.getSelected($scope.tests);
            if (tests.length > 0) {
                $scope.chartMode = $scope.chartModes.MULTIPLE_FINAL_TEST_RESULTS;
                $scope.chartDataSets = [TestResultsChartService.createChartDataFromMultipleTestResults(tests)];
            }
        };

        /**
         * Create chart data for a single complete test result with all intermediate steps. Therefore fetch all
         * intermediate steps first
         */
        $scope.chartFromSingleCompleteTestResult = function () {
            var tests = SelectionService.getSelected($scope.tests);
            if (tests.length == 1) {
                TestResource.getComplete($scope.project.id, tests[0].testNo)
                    .then(function (results) {
                        $scope.chartMode = $scope.chartModes.SINGLE_COMPLETE_TEST_RESULT;
                        $scope.chartDataSets = [TestResultsChartService.createChartDataFromSingleCompleteTestResult(results)];
                    });
            }
        };

        /**
         * Create chart data for two complete test result with all intermediate steps. Therefore fetch all
         * intermediate steps for both selected tests first
         */
        $scope.chartFromTwoCompleteTestResults = function () {
            var tests = SelectionService.getSelected($scope.tests);
            var dataSets = [];
            if (tests.length == 2) {
                TestResource.getComplete($scope.project.id, tests[0].testNo)
                    .then(function (results) {
                        dataSets.push(TestResultsChartService.createChartDataFromSingleCompleteTestResult(results));
                        TestResource.getComplete($scope.project.id, tests[1].testNo)
                            .then(function (results) {
                                dataSets.push(TestResultsChartService.createChartDataFromSingleCompleteTestResult(results));
                                $scope.chartMode = $scope.chartModes.TWO_COMPLETE_TEST_RESULTS;
                                $scope.chartDataSets = dataSets;
                            })
                    })
            }
        };

        /**
         * Make the list of final test results visible again and remove the chart
         */
        $scope.back = function () {
            $scope.chartDataSets = [];
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolExportController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolExportController
        ]);

    function SymbolExportController($scope, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();
        var _fileName = 'symbols-project-' + _project.id + '.json';

        //////////

        $scope.symbols = [];

        //////////

        SymbolResource.all(_project.id)
            .then(function (symbols) {
                $scope.symbols = symbols;
            });

        //////////

        $scope.downloadSymbols = function () {

            var symbolsToDownload = angular.copy(SelectionService.getSelected($scope.symbols));
            SelectionService.removeSelection(symbolsToDownload);

            _.forEach(symbolsToDownload, function (symbol) {
                delete symbol.id;
                delete symbol.project;
                delete symbol.revision;
            })

            if (symbolsToDownload.length > 0) {
                var a = document.createElement('a');
                a.setAttribute('href', window.URL.createObjectURL(new Blob([angular.toJson(symbolsToDownload)], {type: 'text/json'})));
                a.setAttribute('target', '_blank');
                a.setAttribute('download', _fileName);
                a.click();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolUploadController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolUploadController
        ]);

    function SymbolUploadController($scope, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();

        ////////////

        $scope.symbols = [];

        ////////////

        $scope.fileLoaded = function(data) {
            $scope.symbols = data;
            _.forEach($scope.symbols, function(symbol){
                symbol.project = _project.id;
            })
        };

        $scope.createSymbols = function() {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            SelectionService.removeSelection(selectedSymbols);
            if (selectedSymbols.length > 1) {
                _.forEach(selectedSymbols, function(symbol){
                    SymbolResource.create(symbol);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestResultController', [
            '$scope', 'SessionService', 'TestResource', 'SelectionService',
            TestResultController
        ]);

    function TestResultController($scope, SessionService, TestResource, SelectionService) {

        $scope.project = SessionService.project.get();
        $scope.tests = [];

        //////////

        TestResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
            });

        //////////

        $scope.deleteTest = function (test) {

            SelectionService.removeSelection(test);

            TestResource.delete($scope.project.id, test.testNo)
                .then(function () {
                    _.remove($scope.tests, {test_no: test.testNo})
                })
        };

        $scope.deleteTests = function (tests) {

            var selectedTests = SelectionService.getSelected($scope.tests);

            if (selectedTests.length > 0) {
                _.forEach(selectedTests, $scope.deleteTest)
            }
        }
    }
}());
;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestSetupController', [
            '$scope', '$location', 'SymbolResource', 'SessionService', 'SelectionService', 'type', 'EqOraclesEnum',
            'LearnAlgorithmsEnum', 'LearnerResource',
            TestSetupController
        ]);

    function TestSetupController($scope, $location, SymbolResource, SessionService, SelectionService, type, EqOracles,
                                 LearnAlgorithms, LearnerResource) {

        $scope.project = SessionService.project.get();
        $scope.symbols = [];
        $scope.testConfiguration = {
            symbols: [],
            algorithm: LearnAlgorithms.EXTENSIBLE_LSTAR,
            eqOracle: {
                type: EqOracles.COMPLETE,
                minDepth: 1,
                maxDepth: 1
            },
            maxAmountOfStepsToLearn: 0
        };

        //////////

        LearnerResource.isActive()
            .then(function (active) {
                if (active) {
                    $location.path('/project/' + $scope.project.id + '/learn');
                } else {
                    loadSymbols();
                }
            });

        //////////

        function loadSymbols() {
            switch (type) {
                case 'web':
                    SymbolResource.allWeb($scope.project.id)
                        .then(function (symbols) {
                            $scope.symbols = symbols;
                        });
                    break;
                case 'rest':
                    SymbolResource.allRest($scope.project.id)
                        .then(function (symbols) {
                            $scope.symbols = symbols;
                        });
                    break;
                default:
                    break;
            }
        }

        //////////

        $scope.startTest = function () {

            var selectedSymbols = SelectionService.getSelected($scope.symbols);

            if (selectedSymbols.length == 0) {
                return;
            }

            _.forEach(selectedSymbols, function (symbol) {
                $scope.testConfiguration.symbols.push({
                    id: symbol.id,
                    revision: symbol.revision
                });
            });

            LearnerResource.start($scope.project.id, $scope.testConfiguration)
                .then(function (data) {
                    $location.path('/project/' + $scope.project.id + '/learn');
                })
        };

        $scope.updateLearnConfiguration = function (config) {
            $scope.testConfiguration = config;
        };
    }
}());;(function(){
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateController', [
            '$scope', '$modalInstance', 'modalData', 'WebActionTypesEnum', 'RestActionTypesEnum',
            ActionCreateController
        ]);

    function ActionCreateController ($scope, $modalInstance, modalData, WebActionTypesEnum, RestActionTypesEnum) {

        $scope.webActionTypes = WebActionTypesEnum;
        $scope.restActionTypes = RestActionTypesEnum;

        //////////

        $scope.symbol = modalData.symbol;
        $scope.action = {type: null};

        //////////

        $scope.createAction = function(){
            $modalInstance.close($scope.action);
        };

        $scope.closeModal = function(){
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionUpdateController', [
            '$scope', '$modalInstance', 'modalData', 'WebActionTypesEnum', 'RestActionTypesEnum',
            ActionUpdateController
        ]);

    function ActionUpdateController($scope, $modalInstance, modalData, WebActionTypesEnum, RestActionTypesEnum) {

        $scope.webActionTypes = WebActionTypesEnum;
        $scope.restActionTypes = RestActionTypesEnum;

        //////////

        $scope.symbol = modalData.symbol;
        $scope.action = angular.copy(modalData.action);

        //////////

        $scope.updateAction = function () {
            $modalInstance.close($scope.action);
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolCreateController', [
            '$scope', '$modalInstance', 'config', 'SymbolResource',
            SymbolCreateController
        ]);

    function SymbolCreateController($scope, $modalInstance, config, SymbolResource) {

        var _projectId = config.projectId;

        //////////

        $scope.symbol = {
            type: config.symbolType
        };

        //////////

        $scope.createSymbol = function () {
            SymbolResource.create(_projectId, $scope.symbol)
                .then(function (newSymbol) {
                    $modalInstance.close(newSymbol);
                })
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolUpdateController', [
            '$scope', '$modalInstance', 'modalData', 'SymbolResource', 'SelectionService',
            SymbolUpdateController
        ]);

    function SymbolUpdateController($scope, $modalInstance, modalData, SymbolResource, SelectionService) {

        $scope.symbol = modalData.symbol;

        //////////

        $scope.updateSymbol = function () {
            SelectionService.removeSelection($scope.symbol);
            SymbolResource.update($scope.symbol.project, $scope.symbol)
                .then(function (updatedSymbol) {
                    $modalInstance.close(updatedSymbol);
                })
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestDetailsController', [
            '$scope', '$modalInstance', 'modalData',
            TestDetailsController
        ]);

    function TestDetailsController($scope, $modalInstance, modalData) {

        $scope.test = modalData.test;

        //////////

        $scope.ok = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestSetupSettingsController', [
            '$scope', '$modalInstance', 'modalData', 'EqOraclesEnum', 'LearnAlgorithmsEnum', 'EqOracleService',
            TestSetupSettingsController
        ]);

    function TestSetupSettingsController($scope, $modalInstance, modalData, eqOracles, learnAlgorithms, EqOracleService) {

        $scope.eqOracles = eqOracles;
        $scope.learnAlgorithms = learnAlgorithms;
        $scope.learnConfiguration = modalData.learnConfiguration;

        //////////

        $scope.$watch('learnConfiguration.eqOracle.type', function(type){
            $scope.learnConfiguration.eqOracle = EqOracleService.create(type);
        });

        //////////

        $scope.ok = function () {
            $modalInstance.close($scope.learnConfiguration);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('actionFormRest', actionFormRest);

    /**
     * actionFormRest
     *
     * The directive that loads the forms that are necessary to create rest actions. The value of the parameter
     * actionModel should be an object that has at least the property 'type'.
     *
     * @return {{scope: {action: string}, templateUrl: string, controller: *[]}}
     */
    function actionFormRest() {

        // the directive
        var directive = {
            scope: {
                action: '=actionModel'
            },
            templateUrl: 'app/partials/directives/action-form-rest.html',
            controller: [
                '$scope', 'RestActionTypesEnum',
                ActionFormWebController
            ]
        };
        return directive;

        //////////

        /**
         * ActionFormWebController
         *
         * Actually this controller does nothing but setting a scope variable so that the template have access
         * to it
         *
         * @param $scope
         * @param RestActionTypesEnum
         * @constructor
         */
        function ActionFormWebController($scope, RestActionTypesEnum) {

            $scope.types = RestActionTypesEnum;
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('actionFormWeb', actionFormWeb);

    /**
     * actionFormWeb
     *
     * The directive that loads the forms that are necessary to create web actions. The value of the parameter
     * actionModel should be an object that has at least the property 'type'.
     *
     * @return {{scope: {action: string}, templateUrl: string, controller: *[]}}
     */
    function actionFormWeb() {

        var directive = {
            scope: {
                action: '=actionModel'
            },
            templateUrl: 'app/partials/directives/action-form-web.html',
            controller: [
                '$scope', 'WebActionTypesEnum',
                ActionFormWebController
            ]
        };
        return directive;

        //////////

        function ActionFormWebController($scope, WebActionTypesEnum) {
            $scope.types = WebActionTypesEnum;
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('appNavigation', appNavigation);

    function appNavigation() {

        var directive = {
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            var menuButton = angular.element(el[0].getElementsByClassName('navbar-menu'));
            var wrapper = angular.element(el[0].getElementsByClassName('app-navigation-wrapper'));
            var view = angular.element(document.getElementById('view'));
            var cssClass = 'has-off-screen-navigation';

            menuButton.on('click', toggleNavigation);

            function toggleNavigation(e) {
                e.stopPropagation();

                if (wrapper.hasClass(cssClass)) {
                    wrapper.removeClass(cssClass);
                } else {
                    wrapper.addClass(cssClass);
                    wrapper.on('click', hideNavigation);
                }
            }

            function hideNavigation(e) {
                if (e.target.tagName == 'A' && e.target.getAttribute('href') != '#') {
                    wrapper.removeClass(cssClass);
                    wrapper.off('click', hideNavigation);
                }
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadCanvasAsImage', downloadCanvasAsImage);

    /**
     * downloadCanvasAsImage
     *
     * The directive to download a given canvas as a png file. Add this directive as an attribute to any kind of
     * element, best on a button. The directive adds an click event to the element of the directive.
     *
     * @returns {{link: link}}
     */
    function downloadCanvasAsImage() {

        var directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope - the scope
         * @param el - the element of the directive
         * @param attrs - the attributes of the element
         */
        function link(scope, el, attrs) {

            el.on('click', download);

            //////////

            /**
             * Download the canvas whose id was passed as an attribute from this directive as png
             */
            function download() {



                // make sure the id was passed
                if (attrs.downloadCanvasAsImage) {

                    // find canvas
                    var canvas = document.getElementById(attrs.downloadCanvasAsImage);

                    if (canvas != null) {

                        // create image data with highest quality
                        var img = canvas.toDataURL('image/png', 1.0);

                        // create hidden link element with the data of the image and click on it
                        var a = document.createElement('a');
                        a.setAttribute('href', img);
                        a.setAttribute('download', 'chart.png');
                        a.setAttribute('target', '_blank');
                        a.click();
                    }
                }
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('fileDropzone', fileDropzone);

    /**
     * fileDropzone
     *
     * This directives makes any element a place to drop files from the local pc. Currently this directive only
     * supports to read files as a text.
     *
     * @return {{restrict: string, scope: {onLoaded: string}, link: link}}
     */
    function fileDropzone() {

        var directive = {
            restrict: 'A',
            scope: {
                onLoaded: '&'
            },
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            var _reader = new FileReader();

            //////////

            // call function that was passed as onLoaded with the result of the FileReader
            _reader.onload = function (e) {
                scope.onLoaded()(e.target.result);
            };

            // add dragover event
            el.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            // add drop event and read files
            el.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                readFiles(e.dataTransfer.files);
            });

            //////////

            /**
             * Read files as a text file
             * @param files
             */
            function readFiles(files) {
                _.forEach(files, function (file) {
                    _reader.readAsText(file);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('fitParentDimensions', [
            '$window',
            fitParentDimensions
        ]);

    /**
     * fitParentDimensions
     *
     * This directive changes the dimensions of an element to its parent element. Optionally you can trigger this
     * behaviour by passing the value 'true' to the parameter bindResize so that every time the window resizes,
     * the dimensions of the element will be updated.
     *
     * By setting 'asStyle' to 'true', the dimensions will be written in the style attribute of the element. Otherwise
     * this directive creates the width and height attribute.
     *
     * As Default, both options are disabled.
     *
     * @param $window
     * @return {{scope: {bindResize: string}, link: link}}
     */
    function fitParentDimensions($window) {

        // the directive
        var directive = {
            restrict: 'A',
            scope: {
                bindResize: '=',
                asStyle: '='
            },
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            var _parent = el.parent()[0];

            //////////

            if (scope.bindResize) {
                angular.element($window).on('resize', fitToParent)
            }

            fitToParent();

            //////////

            /**
             * Set the element to the dimensions of its parent
             */
            function fitToParent() {

                var width = _parent.offsetWidth;
                var height = _parent.offsetHeight;

                if (scope.asStyle) {
                    el[0].style.width = width + 'px';
                    el[0].style.height = height + 'px';
                } else {
                    el[0].setAttribute('width', width);
                    el[0].setAttribute('height', height);
                }
            }
        }
    }
}());;(function(){
	'use strict';
	
	angular
		.module('weblearner.directives')
		.directive('fixOnScroll', [
			'$window',
			fixOnScroll
		]);

	function fixOnScroll($window) {
	
		var directive = {
			link: link
		};
		return directive;
		
		//////////
		
		function link (scope, el, attrs) {
		
			// get settings from attribute (top & class)
			var settings = scope.$eval(attrs.fixOnScroll);
			if (angular.isUndefined(settings.top) || angular.isUndefined(settings.class)) {
				 return;
			}

			// get element height for the placeholder element
			var height = el[0].offsetHeight;

			// create, configure, hide & append the placeholder element after the element
			var placeholder = document.createElement('div');
			placeholder.style.height = height + 'px';
			placeholder.style.display = 'none';
			el.after(placeholder);

			// listen to window scroll event and add or remove the specified class to or from the element
			// and show or hide the placeholder for a smooth scrolling behaviour
			angular.element($window).on('scroll', function () {
				 if ($window.scrollY >= settings.top) {
					  if (!el.hasClass(settings.class)) {
							placeholder.style.display = 'block';
							el.addClass(settings.class);
					  }
				 } else {
					  if (el.hasClass(settings.class)) {
							placeholder.style.display = 'none';
							el.removeClass(settings.class);
					  }
				 }
			})
		}
	}
}());
;(function(){

    angular
        .module('weblearner.directives')
        .directive('hypothesis', [
            '$window',
            hypothesis
        ]);

    function hypothesis ($window) {

        var directive = {
            scope: {
                test: '=',
                counterExample: '='
            },
            templateUrl: 'app/partials/directives/hypothesis.html',
            link: link
        };
        return directive;

        //////////

        function link (scope, el, attrs) {

            var _svg;
            var _svgGroup;
            var _svgContainer;
            var _graph;
            var _renderer;

            //////////

            scope.$watch('test', function(test){
                if (angular.isDefined(test) && test != null) {
                    if (angular.isDefined(_svg)){
                        _svg.innerHTML = ''
                    }
                    createHypothesis();
                }
            });

            //////////

            function createHypothesis () {
                initGraph();
                layoutGraph();
                renderGraph();
            }

            function initGraph() {

                _svg = d3.select(el.find('svg')[0]);
                _svgGroup = _svg.append("g");
                _svgContainer = _svg.node().parentNode;

                _graph = new graphlib.Graph({
                    directed: true,
                    multigraph: true
                });
                _graph.setGraph({edgesep: 25});
            }

            function layoutGraph() {

                _.forEach(scope.test.hypothesis.nodes, function (node, i) {
                    _graph.setNode("" + i, {shape: 'circle', label: node.toString(), width: 25});
                });

                _.forEach(scope.test.hypothesis.edges, function (edge, i) {
                    var edgeName =  edge.from + "-" + edge.to + "|" + i;
                    _graph.setEdge(edge.from, edge.to, {label: edge.input + "/" + edge.output, labeloffset: 5}, edgeName);
                });

                dagreD3.dagre.layout(_graph, {});
            }

            function renderGraph() {

                _renderer = new dagreD3.render();
                _renderer(_svgGroup, _graph);

                _svg.selectAll('.edgeLabel').on('click', function(){

                    var el = this.getElementsByTagName('tspan')[0];
                    var label = el.innerHTML.split('/');

                    scope.counterExample.input += (label[0] + ',');
                    scope.counterExample.output += (label[1] + ',');
                    scope.$apply()
                });

                // Center graph
                var xCenterOffset = (_svgContainer.clientWidth - _graph.graph().width) / 2;
                _svgGroup.attr("transform", "translate(" + xCenterOffset + ", 100)");

                // Create and handle zoom event
                var zoom = d3.behavior.zoom()
                    .scaleExtent([0.1, 10])
                    .translate([xCenterOffset, 100])
                    .on("zoom", zoomHandler);

                function zoomHandler() {
                    _svgGroup.attr('transform', 'translate(' + zoom.translate() + ')' + ' scale(' + zoom.scale() + ')');
                }

                // attach zoom event to svg g
                zoom(_svg);

                function fitSize() {
                    _svg.attr("width", _svgContainer.clientWidth);
                    _svg.attr("height", _svgContainer.clientHeight);
                }

                fitSize();

                angular.element($window).on('resize', fitSize);
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('loadScreen', loadScreen);

    function loadScreen() {

        var directive = {
            scope: {},
            templateUrl: 'app/partials/directives/load-screen.html',
            controller: [
                '$scope',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope) {

            $scope.counter = 0;

            //////////

            $scope.$on('loadScreen.show', show);
            $scope.$on('loadScreen.hide', hide);

            //////////

            function show() {
                $scope.counter++;
            }

            function hide() {
                $scope.counter--;
                if ($scope.counter < 0) {
                    $scope.counter = 0;
                }
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openActionCreateModal', [
            '$modal', 'ngToast',
            openActionCreateModal
        ]);

    function openActionCreateModal($modal, toast) {

        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attr) {

            el.on('click', handleModal);

            function handleModal() {

                var modal = $modal.open({
                    templateUrl: 'app/partials/modals/modal-action-create.html',
                    controller: 'ActionCreateController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol)
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (action) {
                    scope.onCreated()(action);
                    toast.create({
                        class: 'success',
                        content: 'Action created'
                    });
                });
            }
        }
    }
}());;(function() {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openActionUpdateModal', [
            '$modal', 'ngToast',
            openActionUpdateModal
        ]);

    function openActionUpdateModal($modal, toast) {
        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                action: '=',
                onUpdated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attr) {

            el.on('click', handleModal);

            function handleModal() {

                if (angular.isUndefined(scope.action)) {
                    return;
                }

                var modal = $modal.open({
                    templateUrl: 'app/partials/modals/modal-action-update.html',
                    controller: 'ActionUpdateController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol),
                                action: angular.copy(scope.action)
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (action) {
                    toast.create({
                        class: 'success',
                        content: 'Action updated'
                    });
                    scope.onUpdated()(action);
                });
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openSymbolCreateModal', [
            '$modal',
            openSymbolCreateModal
        ]);

    function openSymbolCreateModal($modal) {
        var directive = {
            restrict: 'EA',
            scope: {
                symbolType: '@',
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: 'app/partials/modals/modal-symbol-create.html',
                    controller: 'SymbolCreateController',
                    resolve: {
                        config: function () {
                            return {
                                symbolType: scope.symbolType,
                                projectId: scope.projectId
                            }
                        }
                    }
                });
                modal.result.then(function (symbol) {
                    scope.onCreated()(symbol);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openSymbolUpdateModal', [
            '$modal',
            openSymbolUpdateModal
        ]);

    function openSymbolUpdateModal($modal) {

        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                onUpdated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {

                if (angular.isUndefined(scope.symbol)) {
                    return;
                }

                var modal = $modal.open({
                    templateUrl: 'app/partials/modals/modal-symbol-update.html',
                    controller: 'SymbolUpdateController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol)
                            };
                        }
                    }
                });
                modal.result.then(function (symbol) {
                    scope.onUpdated()(symbol);
                })
            }
        }
    }
}());;(function () {

    angular
        .module('weblearner.directives')
        .directive('openTestDetailsModal', [
            '$modal',
            openTestDetailsModal
        ]);

    function openTestDetailsModal($modal) {

        var directive = {
            scope: {
                test: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                if (angular.isDefined(scope.test)) {
                    $modal.open({
                        templateUrl: 'app/partials/modals/modal-test-details.html',
                        controller: 'TestDetailsController',
                        resolve: {
                            modalData: function () {
                                return {
                                    test: angular.copy(scope.test)
                                }
                            }
                        }
                    })
                }
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openTestSetupSettingsModal', [
            '$modal',
            openTestSetupSettingsModal
        ]);

    function openTestSetupSettingsModal($modal) {

        var directive = {
            restrict: 'EA',
            scope: {
                learnConfiguration: '=',
                onOk: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attr) {

            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: 'app/partials/modals/modal-test-setup-settings.html',
                    controller: 'TestSetupSettingsController',
                    resolve: {
                        modalData: function () {
                            return {
                                learnConfiguration: angular.copy(scope.learnConfiguration)
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (learnConfiguration) {
                    scope.onOk()(learnConfiguration);
                });
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openWebElementPicker', [
            'WebElementPickerService',
            openWebElementPicker
        ]);

    function openWebElementPicker(WebElementPickerService) {

        var directive = {
            scope: {
                url: '=',
                selector: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', WebElementPickerService.open);

            //////////

            scope.$on('webElementPicker.ok', ok);

            //////////

            function ok(event, data) {
                scope.url = data.url;
                scope.selector = data.selector;
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('selectAllItemsCheckbox', [
            'SelectionService',
            selectAllItemsCheckbox
        ]);

    function selectAllItemsCheckbox(SelectionService) {

        var directive = {
            scope: {
                items: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, selectionCtrl) {

            el.on('change', changeSelection);

            function changeSelection() {
                if (this.checked) {
                    SelectionService.selectAll(scope.items);
                } else {
                    SelectionService.deselectAll(scope.items);
                }
                scope.$apply();
            }
        }
    }


    angular
        .module('weblearner.directives')
        .directive('selectableList', selectableList);

    function selectableList() {

        var directive = {
            transclude: true,
            replace: true,
            require: 'ngModel',
            scope: {
                items: '=ngModel'
            },
            template: ' <table class="table" >' +
            '               <thead>' +
            '                   <tr>' +
            '                       <th style="width: 1px"></th>' +
            '                       <th></th>' +
            '                   </tr>' +
            '               </thead>' +
            '               <tbody ng-transclude>' +
            '               </tbody>' +
            '           </table>',
            controller: ['$scope', controller]
        };
        return directive;

        //////////

        function controller($scope) {

            this.getItems = function () {
                return $scope.items;
            };
        }
    }


    angular
        .module('weblearner.directives')
        .directive('selectableListItem', selectableListItem);

    function selectableListItem() {

        var directive = {
            require: '^selectableList',
            replace: true,
            transclude: true,
            template: ' <tr ng-class="item._selected ? \'active\' : \'\'">' +
            '               <td>' +
            '                   <input type="checkbox" ng-model="item._selected"><br>' +
            '               </td>' +
            '               <td>' +
            '                   <div ng-transclude></div>' +
            '               </td>' +
            '           </tr>',
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, ctrl) {
            scope.item = ctrl.getItems()[scope.$index];
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('widget', widget);

    function widget() {

        var template = '' +
            '<div class="panel panel-default">' +
            '   <div class="panel-heading">' +
            '       <div class="pull-right">' +
            '           <span class="panel-collapse-handle" ng-click="toggleCollapse()">' +
            '               <i class="fa" ng-class="collapsed? \'fa-plus-square\' : \'fa-minus-square\'"></i>' +
            '           </span>' +
            '       </div>' +
            '       <strong class="text-muted" ng-bind="title"></strong>' +
            '   </div>' +
            '   <div class="panel-body" ng-show="!collapsed" ng-transclude></div>' +
            '</div>';

        ///////////

        var directive = {
            scope: {
                collapsed: '='
            },
            template: template,
            transclude: true,
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            scope.title = attrs.widgetTitle || 'Untitled';
            scope.collapsed = scope.collapsed || false;

            scope.toggleCollapse = function () {
                scope.collapsed = !scope.collapsed;
            }
        }
    }


    angular
        .module('weblearner.directives')
        .directive('widgetCounterExamples', widgetCounterExamples);

    function widgetCounterExamples() {

        var directive = {
            templateUrl: 'app/partials/widgets/widget-counter-examples.html',
            scope: {
                counterExamples: '=',
                newCounterExample: '=counterExample'
            },
            controller: ['$scope', controller]
        }
        return directive;

        function controller($scope) {

            //$scope.newCounterExample = {
            //    input: '',
            //    output: ''
            //};

            console.log($scope.newCounterExample)

            //////////

            $scope.$watch('counterExamples.length', function (n, o) {
                console.log(n)
            });

            //////////

            $scope.addCounterExample = function () {

                var ce = {
                    input: [],
                    output: []
                };

                _.forEach($scope.newCounterExample.input.split(','), function (input) {
                    if (input.trim() != ''){
                        ce.input.push(input.trim())
                    }
                });

                _.forEach($scope.newCounterExample.output.split(','), function (output) {
                    if (output.trim() != ''){
                        ce.output.push(output.trim())
                    }
                });

                $scope.counterExamples.push(ce);
                $scope.newCounterExample.input = '';
                $scope.newCounterExample.output = '';
            };

            $scope.removeCounterExample = function (ce, index) {

                $scope.counterExamples.splice(index, 1);
            }
        }
    }


    angular
        .module('weblearner.directives')
        .directive('widgetTestResumeSettings', widgetTestResumeSettings);

    function widgetTestResumeSettings() {

        var directive = {
            templateUrl: 'app/partials/widgets/widget-test-resume-settings.html',
            scope: {
                configuration: '='
            },
            controller: ['$scope', 'EqOraclesEnum', 'EqOracleService', controller]
        };
        return directive;

        function controller($scope, EqOraclesEnum, EqOracleService) {

            $scope.eqOracles = EqOraclesEnum;

            //////////

            $scope.$watch('configuration.eqOracle.type', function(type){
                $scope.configuration.eqOracle = EqOracleService.create(type);
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChart', testResultsChart);

    /**
     * testResultsChart
     *
     * The directive that is placed somewhere in your html markup in order to display the charts for displaying
     * the statistics of some test results.
     *
     * Use the attribute 'chart-data' on the element of the directive to pass the data that should be plotted
     *
     * @return {{scope: {chartData: string}, controller: *[], template: string}}
     */
    function testResultsChart() {

        var template = '' +
            '<div>' +
            '   <canvas id="test-results-chart" width="800" height="400"></canvas>' +
            '   <hr>' +
            '   <div class="text-center">' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.DURATION ? \'active\' : \'\'" ng-click="showDuration()">Duration</button>' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.AMOUNT_OF_RESETS ? \'active\' : \'\'" ng-click="showResets()">#Resets</button>' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.AMOUNT_OF_SYMBOLS ? \'active\' : \'\'" ng-click="showSymbols()">#Symbols</button>' +
            '   </div>' +
            '</div>';

        //////////

        var directive = {
            scope: {
                chartData: '='
            },
            controller: [
                '$scope', '$element', 'TestResultsChartService',
                controller
            ],
            template: template
        };
        return directive;

        //////////

        /**
         * The controller for the directive testResultsChart that can be required by other directives
         *
         * @param $scope - the current scope
         * @param $element - the root element of the directive
         */
        function controller($scope, $element, TestResultsChartService) {

            // The canvas on which the charts will be drawn
            var canvas = $element.find('canvas')[0].getContext('2d');

            // The chart.js Chart object
            var chart;

            // The update method that is dynamically set by other directives in order to update the canvas
            var update;

            //////////

            $scope.chartProperties = TestResultsChartService.chartProperties;
            
            $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_SYMBOLS;

            //////////

            /**
             * Draw a bar chart on the canvas from data
             * @param data - the data in the format that is expected by chart.js
             */
            this.createBarChart = function (data) {
                chart = new Chart(canvas).Bar(data, {responsive: true});
            };

            /**
             * Draw a line chart on the canvas from data
             * @param data - the data in the format that is expected by chart.js
             */
            this.createLineChart = function (data) {
                chart = new Chart(canvas).Line(data, {responsive: true});
            };

            /**
             * Returns the data that was passed as an argument to the directive
             * @return {string|chartData}
             */
            this.getChartData = function () {
                return $scope.chartData;
            };

            /**
             * Set the method that is called to update the chart on the canvas
             * @param f - the update function with to params (chart, property)
             */
            this.setUpdate = function (f) {
                update = f;
            };

            //////////

            /**
             * Update the canvas and show the statistics for the duration of test results
             */
            $scope.showDuration = function () {
                update(chart, $scope.chartProperties.DURATION);
                $scope.visibleChartProperty = $scope.chartProperties.DURATION;
            };

            /**
             * Update the canvas and show the statistics for the number of resets of test results
             */
            $scope.showResets = function () {
                update(chart, $scope.chartProperties.AMOUNT_OF_RESETS);
                $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_RESETS
            };

            /**
             * Update the canvas and show the statistics for the number of symbols of test results
             */
            $scope.showSymbols = function () {
                update(chart, $scope.chartProperties.AMOUNT_OF_SYMBOLS);
                $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_SYMBOLS
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartMultipleFinal', testResultsChartMultipleFinal);

    /**
     * testResultsChartMultipleFinal
     *
     * The directive that should be applied to the element where the chart for the comparison of multiple final test
     * results should be displayed. Requires that the directive 'testResultsChart' is applied to the element as well
     * because it works with it.
     *
     * Displays a bar chart.
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartMultipleFinal() {

        var directive = {
            require: 'testResultsChart',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the controller from 'testResultsChart'
         */
        function link(scope, el, attrs, ctrl) {

            // The cache that holds all chart.js data sets for a set of results
            var datasets;

            // get the chart data from the parent directive controller and initialize this directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             *
             * @param data - the data in the format of a chart.js bar chart
             */
            function init(data) {
                if (angular.isDefined(data)) {
                    data = data[0];

                    // save all data sets for later manipulation
                    datasets = angular.copy(data.datasets);
                    // show a single value
                    data.datasets = [datasets[0]];

                    ctrl.createBarChart(data);
                    ctrl.setUpdate(update)
                }
            }

            /**
             * The method that updates the chart. It is called when the user wants to see another value of the test
             *
             * @param chart - the chart.js object
             * @param property - the property that should be plotted on the canvas
             */
            function update(chart, property) {
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
                });
                chart.update();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartSingleComplete', testResultsChartSingleComplete);

    /**
     * testResultsChartSingleComplete
     *
     * The directive that should be applied to the element where the chart for a single complete test result should be
     * displayed. Requires that the directive 'testResultsChart' is applied to the element as well because it works with
     * it.
     *
     * Displays a line chart if there are at least two steps from the test results to display, otherwise a bar chart
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartSingleComplete() {

        var directive = {
            require: 'testResultsChart',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the controller from 'testResultsChart'
         */
        function link(scope, el, attrs, ctrl) {

            var datasets;

            // get the chart data from the paren directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             * @param data
             */
            function init(data) {
                if (angular.isDefined(data)) {
                    data = data[0];

                    datasets = angular.copy(data.datasets);
                    data.datasets = [datasets[0]];

                    if (data.datasets[0].data.length == 1) {
                        ctrl.createBarChart(data);
                        ctrl.setUpdate(updateBarChart)

                    } else {
                        ctrl.createLineChart(data);
                        ctrl.setUpdate(updateLineChart)
                    }
                }
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a bar chart
             *
             * @param chart
             * @param property
             */
            function updateBarChart(chart, property) {
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
                });
                chart.update();
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a line chart
             *
             * @param chart
             * @param property
             */
            function updateLineChart(chart, property) {
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].points[i].value = value;
                });
                chart.update();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartTwoComplete', testResultsChartTwoComplete);

    /**
     * testResultsChartTwoComplete
     *
     * The directive that should be applied to the element where the chart for the comparison of two complete test
     * results should be displayed. Requires that the directive 'testResultsChart' is applied to the element as well
     * because it works with it.
     *
     * Displays a line chart if there are at least two steps from the test results to display, otherwise a bar chart
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartTwoComplete() {

        var directive = {
            require: 'testResultsChart',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the controller from 'testResultsChart'
         */
        function link(scope, el, attrs, ctrl) {

            var datasets0;
            var datasets1;

            // get chart data from the parent directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             * @param data
             */
            function init(data) {
                if (angular.isDefined(data)) {

                    // save the chart data for both complete test results separately
                    datasets0 = angular.copy(data[0].datasets);
                    datasets1 = angular.copy(data[1].datasets);

                    // remodel the data for the chart, take the one with most steps
                    if (data[1].labels.length > data[0].labels.length) {
                        data[0].labels = data[1].labels;
                    }
                    data = data[0];
                    // create the chart.js data sets for a single property for both tests
                    data.datasets = [
                        datasets0[0],
                        datasets1[0]
                    ];

                    // create a bar or a line chart
                    if (data.labels.length == 1) {
                        ctrl.createBarChart(data);
                        ctrl.setUpdate(updateBarChart);
                    } else if (data.labels.length > 1) {
                        ctrl.createLineChart(data);
                        ctrl.setUpdate(updateLineChart);
                    }
                }
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a bar chart
             *
             * @param chart
             * @param property
             */
            function updateBarChart(chart, property) {
                _.forEach(datasets0[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
                });
                _.forEach(datasets1[property].data, function (value, i) {
                    chart.datasets[1].bars[i].value = value;
                });
                chart.update();
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a line chart
             *
             * @param chart
             * @param property
             */
            function updateLineChart(chart, property) {
                _.forEach(datasets0[property].data, function (value, i) {
                    chart.datasets[0].points[i].value = value;
                });
                _.forEach(datasets1[property].data, function (value, i) {
                    chart.datasets[1].points[i].value = value;
                });
                chart.update();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webElementPicker', [
            '$window', 'WebElementPickerService',
            webElementPicker
        ]);


    function webElementPicker($window, WebElementPickerService) {

        var directive = {
            scope: {},
            templateUrl: 'app/partials/directives/web-element-picker.html',
            link: link,
            controller: [
                '$scope', 'SessionService', 'api',
                controller
            ]
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            var _iframe = el.find('iframe');
            var _lastTarget = null;

            //////////

            scope.url = '';
            scope.selector = null;

            //////////

            _iframe.on('load', iframeLoaded);

            //////////

            function iframeLoaded() {
                angular.element(_iframe.contents()[0].body.querySelectorAll('a')).on('click', function () {
                    // console.log(this.getAttribute('href'));
                });
            }

            /**
             * Get the unique CSS Path from selected Element
             * http://stackoverflow.com/questions/4588119/get-elements-css-selector-without-element-id
             * @param el  - The element to get the unique css path from
             * @returns {string} - The unique css path ot the element
             * @private
             */
            function getCssPath(el) {

                var names = [];
                while (el.parentNode) {
                    if (el.id) {
                        names.unshift('#' + el.id);
                        break;
                    } else {
                        if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
                        else {
                            for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
                            names.unshift(el.tagName + ":nth-child(" + c + ")");
                        }
                        el = el.parentNode;
                    }
                }
                return names.join(" > ");
            }

            function handleMouseMove(e) {
                if (_lastTarget == e.target) {
                    return false;
                } else {
                    if (_lastTarget != null) {
                        _lastTarget.style.outline = '0px'
                    }
                    _lastTarget = e.target;
                }
                _lastTarget.style.outline = '5px solid red';
                scope.selector = getCssPath(_lastTarget);
                scope.$apply();
            }

            function handleClick(e) {
                if (angular.isDefined(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                _lastTarget.style.outline = '0px';
                _lastTarget = null;

                angular.element(_iframe.contents()[0].body).off('mousemove', handleMouseMove);
                angular.element(_iframe.contents()[0].body).off('click', handleClick);
                angular.element(document.body).off('keyup', handleKeyUp);
            }

            function handleKeyUp(e) {
                if (e.keyCode == 17) { // strg
                    handleClick();
                }
            }

            //////////

            scope.loadUrl = function () {
                if (scope.url == '') {
                    _iframe[0].setAttribute('src', scope.proxyUrl);
                } else {
                    _iframe[0].setAttribute('src', scope.proxyUrl + '/' + scope.url);
                }
            };

            scope.enableSelection = function () {
                var iframeBody = angular.element(_iframe.contents()[0].body);
                iframeBody.on('mousemove', handleMouseMove);
                iframeBody.one('click', handleClick);
                angular.element(document.body).on('keyup', handleKeyUp);
            };
        }

        //////////

        function controller($scope, SessionService, api) {

            $scope.show = false;
            $scope.project = SessionService.project.get();
            $scope.proxyUrl = null;

            //////////

            if ($scope.project != null) {
                $scope.proxyUrl = $window.location.origin + api.PROXY_URL + $scope.project.baseUrl;
            }

            $scope.$on('webElementPicker.open', function () {
                $scope.show = true;
            });

            $scope.$on('project.opened', function () {
                $scope.project = SessionService.project.get();
                $scope.proxyUrl = $window.location.origin + '/rest/proxy?url=' + $scope.project.baseUrl;
            });

            //////////

            $scope.close = function () {
                $scope.show = false;
                WebElementPickerService.close();
            };

            $scope.ok = function () {
                WebElementPickerService.ok({
                    url: '',
                    selector: $scope.selector
                });
                $scope.show = false;
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('LearnerResource', [
            '$http', '$q', 'api', 'ngToast',
            Learner
        ]);

    /**
     * Learner
     * The resource that is used to communicate with the learner
     *
     * @param $http
     * @param $q
     * @param api
     * @param toast
     * @return {{start: startLearning, stop: stopLearning, resume: resumeLearning, status: getStatus, isActive: isActive}}
     * @constructor
     */
    function Learner($http, $q, api, toast) {

        var service = {
            start: startLearning,
            stop: stopLearning,
            resume: resumeLearning,
            status: getStatus,
            isActive: isActive
        };
        return service;

        //////////

        /**
         * Start the server side learning process of a project
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function startLearning(projectId, learnConfiguration) {
            return $http.post(api.URL + '/learner/start/' + projectId, learnConfiguration)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error);
                toast.create({
                    class: 'danger',
                    content: error,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
         * with the thread handling
         *
         * @return {*}
         */
        function stopLearning() {
            return $http.get(api.URL + '/learner/stop/')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
         * so that the ongoing process parameters could be defined
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function resumeLearning(projectId, testNo, learnConfiguration) {
            return $http.post(api.URL + '/learner/resume/' + projectId + '/' + testNo, learnConfiguration)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Gets the learner result that includes the hypothesis. make sure isActive() returns true before calling this
         * function
         *
         * @return {*}
         */
        function getStatus() {
            return $http.get(api.URL + '/learner/status/')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Check if the server is finished learning a project
         *
         * @param projectId
         * @return {*}
         */
        function isActive(projectId) {
            return $http.get(api.URL + '/learner/active')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data.active;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('ProjectResource', [
            '$http', '$q', 'api', 'ngToast',
            Project
        ]);

    /**
     * Project
     * The resource to do crud operations on a project
     *
     * @param $http
     * @param $q
     * @param api
     * @param toast
     * @return {{all: getAllProjects, get: getProject, create: createProject, update: updateProject,
     *          delete: deleteProject}}
     * @constructor
     */
    function Project($http, $q, api, toast) {

        var service = {
            all: getAllProjects,
            get: getProject,
            create: createProject,
            update: updateProject,
            delete: deleteProject
        };
        return service;

        //////////

        /**
         * Get all projects from the server
         *
         * @return {*}
         */
        function getAllProjects() {
            return $http.get(api.URL + '/projects')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Create a new project
         *
         * @param project
         * @return {*}
         */
        function createProject(project) {
            return $http.post(api.URL + '/projects', project)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Project "' + response.data.name + '" created'
                });
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Get a project by its id
         *
         * @param id
         * @return {*}
         */
        function getProject(id) {
            return $http.get(api.URL + '/projects/' + id)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Delete an existing project from the server
         *
         * @param project
         * @return {*}
         */
        function deleteProject(project) {
            return $http.delete(api.URL + '/projects/' + project.id)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Project deleted'
                });
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Updates an existing project
         *
         * @param project
         * @return {*}
         */
        function updateProject(project) {
            return $http.put(api.URL + '/projects/' + project.id, project)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Project Updated'
                });
                return response.data;
            }

            function fail(error) {
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('SymbolResource', [
            '$http', '$q', 'api', 'ngToast',
            SymbolResource
        ]);

    /**
     *
     * @param $http
     * @param $q
     * @param api
     * @param toast
     * @return {{all: getAllSymbols, allWeb: getAllWebSymbols, allRest: getAllRestSymbols, get: getSymbol,
     *          create: createSymbol, update: updateSymbol, delete: deleteSymbol}}
     * @constructor
     */
    function SymbolResource($http, $q, api, toast) {

        var service = {
            all: getAllSymbols,
            allWeb: getAllWebSymbols,
            allRest: getAllRestSymbols,
            get: getSymbol,
            create: createSymbol,
            update: updateSymbol,
            delete: deleteSymbol
        };
        return service;

        //////////

        /**
         * get all rest and web symbols of a project by the projects id
         * @param projectId
         * @return {*}
         */
        function getAllSymbols(projectId) {
            return $http.get(api.URL + '/projects/' + projectId + '/symbols')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * get all web symbols of a project by the projects id
         * @param projectId
         * @return {*}
         */
        function getAllWebSymbols(projectId) {
            return $http.get(api.URL + '/projects/' + projectId + '/symbols/?type=web')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * get all rest symbols of a project by the projects it
         * @param projectId
         * @return {*}
         */
        function getAllRestSymbols(projectId) {
            return $http.get(api.URL + '/projects/' + projectId + '/symbols/?type=rest')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * get a specific web or rest symbol by its id
         * @param projectId
         * @param symbolId
         * @return {*}
         */
        function getSymbol(projectId, symbolId) {
            return $http.get(api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * create a new symbol
         * @parem projectId
         * @param symbol
         * @return {*}
         */
        function createSymbol(projectId, symbol) {
            return $http.post(api.URL + '/projects/' + projectId + '/symbols', symbol)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Symbol "' + response.data.name + '" created'
                });
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * update an existing symbol
         * @param symbol
         * @return {*}
         */
        function updateSymbol(projectId, symbol) {
            return $http.put(api.URL + '/projects/' + projectId+ '/symbols/' + symbol.id, symbol)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Symbol "' + response.data.name + '" updated'
                });
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * delete an existing symbol
         * @param symbol
         * @return {*}
         */
        function deleteSymbol(projectId, symbolId) {
            return $http.delete(api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(success)
                .catch(fail);

            function success(response) {
                toast.create({
                    class: 'success',
                    content: 'Symbol deleted'
                });
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('TestResource', [
            '$http', '$q', 'api', 'ngToast',
            Test
        ]);

    /**
     * Test
     * The resource the get test results from the server
     *
     * @param $http
     * @param $q
     * @param api
     * @param toast
     * @return {{getGetAllFinal: getGetAllFinal, getFinal: getFinal, getComplete: getComplete, delete: deleteTest}}
     * @constructor
     */
    function Test($http, $q, api, toast) {

        // the service
        var service = {
            getAllFinal: getAllFinal,
            getFinal: getFinal,
            getComplete: getComplete,
            delete: deleteTest
        };
        return service;

        //////////

        /**
         * Get all final results from all tests that were run for a project. the results only include the final
         * hypothesis
         *
         * @param projectId
         * @return {*}
         */
        function getAllFinal(projectId) {
            return $http.get(api.URL + '/projects/' + projectId + '/results')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Get the final test result for a project that only includes the final hypothesis
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function getFinal(projectId, testNo) {
            return $http.get(api.URL + '/projects/' + projectId + '/results/' + testNo)
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Get all created hypotheses that were created during a learn process of a project
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function getComplete(projectId, testNo) {

            return $http.get(api.URL + '/projects/' + projectId + '/results/' + testNo + '/complete')
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }

        /**
         * Delete a complete test run, that also includes all hypotheses that were created
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function deleteTest(projectId, testNo) {
            return $http.delete(api.URL + '/projects/' + projectId + '/results/' + testNo, {})
                .then(success)
                .catch(fail);

            function success(response) {
                return response.data;
            }

            function fail(error) {
                console.error(error.data);
                toast.create({
                    class: 'danger',
                    content: error.data.message,
                    dismissButton: true
                });
                return $q.reject();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('EqOracleService', [
            'EqOraclesEnum',
            EqOracleService
        ]);

    function EqOracleService(EqOraclesEnum) {

        var _eqOracleComplete = {
            type: EqOraclesEnum.COMPLETE,
            minDepth: 1,
            maxDepth: 1
        };

        var _eqOracleRandom = {
            type: EqOraclesEnum.RANDOM,
            minLength: 1,
            maxLength: 1,
            maxNoOfTests: 1
        };

        var _eqOracleSample = {
            type: EqOraclesEnum.SAMPLE,
            counterExamples: []
        };

        //////////

        var service = {
            create: create
        };
        return service;

        //////////

        function create(eqOracleType) {
            switch (eqOracleType) {
                case EqOraclesEnum.COMPLETE:
                    return angular.copy(_eqOracleComplete);
                    break;
                case EqOraclesEnum.RANDOM:
                    return angular.copy(_eqOracleRandom);
                    break;
                case EqOraclesEnum.SAMPLE:
                    return angular.copy(_eqOracleSample);
                    break;
                default:
                    return angular.copy(_eqOracleRandom);
                    break;
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('LoadScreenService', [
            '$rootScope',
            LoadScreenService
        ]);

    /**
     * LoadScreenService
     *
     * The service that is used to communicate with the load screen directive in order to tell it to show or hide
     *
     * @param $rootScope
     * @return {{show: show, hide: hide}}
     * @constructor
     */
    function LoadScreenService($rootScope) {

        // the service
        var service = {
            show: show,
            hide: hide
        };
        return service;

        //////////

        /**
         * Emit the event that indicates that the load screen should be displayed
         */
        function show() {
            $rootScope.$broadcast('loadScreen.show');
        }

        /**
         * Emit the event that indicates that the load screen should not be displayed
         */
        function hide() {
            $rootScope.$broadcast('loadScreen.hide');
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('SelectionService', SelectionService);

    /**
     * SelectionService
     *
     * The Service that is used in this application to mark javascript objects as selected by the user. There are
     * filters, controllers & directives that make use of this service, but I don't want to list them all here... yet.
     *
     * @return {{getSelected: getSelected, select: select, deselect: deselect, selectAll: selectAll, deselectAll: deselectAll, removeSelection: removeSelection, isSelected: isSelected, getPropertyName: *}}
     * @constructor
     */
    function SelectionService() {

        /**
         * The property whose value determines whether an object is selected or not.
         *
         * @type {string}
         * @private
         */
        var _propertyName = "_selected";

        //////////

        // the service
        var service = {
            getSelected: getSelected,
            select: select,
            deselect: deselect,
            selectAll: selectAll,
            deselectAll: deselectAll,
            removeSelection: removeSelection,
            isSelected: isSelected,
            getPropertyName: getPropertyName()
        };
        return service;

        //////////

        /**
         * Filters all objects where the property '_selected' doesn't exists or is false.
         *
         * @param items
         * @return {Array}
         */
        function getSelected(items) {
            return _.filter(items, function (item) {
                return item[_propertyName] == true;
            });
        }

        /**
         * Sets the selected flag for an object to true.
         *
         * @param item
         */
        function select(item) {
            item[_propertyName] = true;
        }

        /**
         * Sets the selected flag for an object to false.
         *
         * @param item
         */
        function deselect(item) {
            item[_propertyName] = false
        }

        /**
         * Selects all items.
         *
         * @param items
         */
        function selectAll(items) {
            _.forEach(items, select)
        }

        /**
         * Deselects all items
         *
         * @param items
         */
        function deselectAll(items) {
            _.forEach(items, deselect)
        }

        /**
         * Removes the property '_selected' from all items.
         *
         * @param items
         */
        function removeSelection(items) {
            if (!angular.isArray(items)) {
                items = [items];
            }
            _.forEach(items, function (item) {
                delete item[_propertyName];
            })
        }

        /**
         * Checks if the property '_selected' exists and what value it has.
         *
         * @param item
         * @return boolean
         */
        function isSelected(item) {
            return angular.isUndefined(item._selected) ? false : item._selected;
        }

        /**
         * Get the name of the property whose value marks an object as selected.
         *
         * @return {string}
         */
        function getPropertyName() {
            return _propertyName;
        }
    }
}());;(function(){
    'use strict';

    angular
        .module('weblearner.services')
        .factory('SessionService', [
            '$rootScope',
            SessionService
        ]);

    /**
     * SessionService
     *
     * The session that is used in this application to save data in the session storage of the browser to store data in
     * between page refreshes in the same tab. So the project doesn't have to be fetched from the server every time the
     * page refreshes
     *
     * @param $rootScope
     * @return {{project: {get: getProject, save: saveProject, remove: removeProject}}}
     * @constructor
     */
    function SessionService($rootScope) {

        // the service
        var service = {
            project: {
                get: getProject,
                save: saveProject,
                remove: removeProject
            }
        };
        return service;

        //////////

        /**
         * Get the stored project object from the session storage
         *
         * @return {Object|Array|string|number|*}
         */
        function getProject() {
            return angular.fromJson(sessionStorage.getItem('project'));
        }

        /**
         * Save a project into the session storage end emit the 'project.opened' event
         *
         * @param project
         */
        function saveProject(project) {
            sessionStorage.setItem('project', angular.toJson(project));
            $rootScope.$broadcast('project.opened');
        }

        /**
         * Remove the stored project from session storage an emit the 'project.closed' event
         */
        function removeProject() {
            sessionStorage.removeItem('project');
            $rootScope.$broadcast('project.closed');
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .service('TestResultsChartService', TestResultsChartService);

    /**
     * @return {{createChartDataFromMultipleTestResults: createChartDataFromMultipleTestResults, createChartDataFromSingleCompleteTestResult: createChartDataFromSingleCompleteTestResult}}
     * @constructor
     */
    function TestResultsChartService() {

        var chartProperties = {
            AMOUNT_OF_SYMBOLS: 0,
            DURATION: 1,
            AMOUNT_OF_RESETS: 2
        };

        var service = {
            createChartDataFromMultipleTestResults: createChartDataFromMultipleTestResults,
            createChartDataFromSingleCompleteTestResult: createChartDataFromSingleCompleteTestResult,
            chartProperties: chartProperties
        };
        return service;

        //////////

        /**
         * Create a chart.js conform dataset for a line or a bar chart
         *
         * @param label
         * @param data
         * @return {{label: *, fillColor: string, strokeColor: string, pointColor: string, pointStrokeColor: string, pointHighlightFill: string, pointHighlightStroke: string, data: *}}
         * @private
         */
        function _createDataSet(label, data) {

            var dataSet = {
                label: label,
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: data
            };
            return dataSet;
        }

        //////////

        /**
         * @param results
         * @return {{labels: Array, datasets: *[]}}
         */
        function createChartDataFromMultipleTestResults(results) {

            var chartData = {
                labels: [],
                datasets: [
                    _createDataSet('Symbols', []),
                    _createDataSet('Duration', []),
                    _createDataSet('Resets', [])
                ]
            };

            _.forEach(results, function (result) {
                chartData.labels.push('Test ' + result.testNo);
                chartData.datasets[chartProperties.AMOUNT_OF_SYMBOLS]
                    .data.push(result.sigma.length);
                chartData.datasets[chartProperties.DURATION]
                    .data.push(result.duration);
                chartData.datasets[chartProperties.AMOUNT_OF_RESETS]
                    .data.push(result.amountOfResets);
            });

            return chartData;
        }

        /**
         * @param results
         * @return {{labels: Array, datasets: *[]}}
         */
        function createChartDataFromSingleCompleteTestResult(results) {

            var chartData = {
                labels: [],
                datasets: [
                    _createDataSet('Symbols', []),
                    _createDataSet('Duration', []),
                    _createDataSet('Resets', [])
                ]
            };

            _.forEach(results, function (result) {
                chartData.labels.push('Step ' + result.stepNo);
                chartData.datasets[chartProperties.AMOUNT_OF_SYMBOLS]
                    .data.push(result.sigma.length);
                chartData.datasets[chartProperties.DURATION]
                    .data.push(result.duration);
                chartData.datasets[chartProperties.AMOUNT_OF_RESETS]
                    .data.push(result.amountOfResets);
            });

            return chartData;
        }
    }
}());
;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('WebElementPickerService', [
            '$rootScope',
            WebElementPickerService
        ]);

    /**
     * WebElementPickerService
     *
     * The service that is used to communicate with the webElementPicker directive.
     *
     * @param $rootScope
     * @return {{open: open, close: close, ok: ok}}
     * @constructor
     */
    function WebElementPickerService($rootScope) {

        // the service
        var service = {
            open: open,
            close: close,
            ok: ok
        };
        return service;

        //////////

        /**
         * Tell the webElementPicker to be displayed. Listen to the 'webElementPicker.open' event to get notified when
         * the webElementPicker gets closed.
         */
        function open() {
            $rootScope.$broadcast('webElementPicker.open');
        }

        /**
         * Tell the webElementPicker to hide. Listen to the 'webElementPicker.close' event to get notified when the
         * webElementPicker gets closed.
         */
        function close() {
            $rootScope.$broadcast('webElementPicker.close');
        }

        /**
         * The webElementPicker calls this function with a parameter {url: .., selector: ...} when the user selected
         * an element and clicks on the 'ok' button.
         *
         * @param data
         */
        function ok(data) {
            $rootScope.$broadcast('webElementPicker.ok', data);
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('first', first);

    /**
     * Returns the first element of an array.
     *
     * @return {Function}
     */
    function first() {
        return function (items) {
            if (angular.isArray(items) && items.length > 0) {
                return _.first(items);
            } else {
                return undefined;
            }
        }
    }
}());;(function () {
    'use strict';

    // nice names for learnAlgorithms
    // nice names for web and rest actions

    angular
        .module('weblearner.filters')
        .filter('niceEqOracleName', [
            'EqOraclesEnum',
            niceEqOracleName
        ]);

    function niceEqOracleName(EqOraclesEnum) {
        return function (eqOracleType) {
            switch (eqOracleType) {
                case EqOraclesEnum.COMPLETE:
                    return 'Complete';
                    break;
                case EqOraclesEnum.RANDOM:
                    return 'Random';
                    break;
                case  EqOraclesEnum.SAMPLE:
                    return 'Manual';
                    break;
                default :
                    return '';
                    break;
            }
        }
    }

    angular
        .module('weblearner.filters')
        .filter('niceLearnAlgorithmName', [
            'LearnAlgorithmsEnum',
            niceLearnAlgorithmName
        ]);

    function niceLearnAlgorithmName(LearnAlgorithmsEnum) {
        return function (algorithm) {
            switch (algorithm) {
                case LearnAlgorithmsEnum.DHC:
                    return 'DHC';
                    break;
                case LearnAlgorithmsEnum.EXTENSIBLE_LSTAR:
                    return 'L*';
                    break;
                case LearnAlgorithmsEnum.DISCRIMINATION_TREE:
                    return 'Discrimination Tree';
                    break;
                default :
                    return '';
                    break;
            }
        }
    }

}());;(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('selected', [
            'SelectionService',
            selected
        ]);

    /**
     * Filters an array of items and returns the selected ones.
     *
     * @param SelectionService
     * @return {Function}
     */
    function selected(SelectionService) {
        return function (items) {
            return _.filter(items, function (item) {
                return SelectionService.isSelected(item);
            })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('typeOfRest', typeOfRest);

    /**
     * The filter that takes an array of objects and returns only those with a property 'type' with the value 'rest'
     *
     * @return {Function}
     */
    function typeOfRest() {
        return function (list) {
            return _.filter(list, {type: 'rest'})
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('typeOfWeb', typeOfWeb);

    /**
     * The filter that takes an array of objects and returns only those with a property 'type' with the value 'web'
     *
     * @return {Function}
     */
    function typeOfWeb() {
        return function (list) {
            return _.filter(list, {type: 'web'})
        }
    }
}());