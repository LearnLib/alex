(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .controller('LearnSetupController', LearnSetupController);

    LearnSetupController.$inject = [
        '$scope', '$state', 'SymbolGroupResource', 'SessionService', 'LearnConfiguration', 'LearnerService',
        'ToastService', '_', 'FaviconService'
    ];

    /**
     * The controller that handles the preparation of a learn process. Lists all symbol groups and its visible symbols.
     *
     * Template 'views/learn-setup.html'
     *
     * @param $scope - The controllers scope
     * @param $state - The ui.router $state service
     * @param SymbolGroupResource - The API resource for symbol groups
     * @param Session - The SessionService
     * @param LearnConfiguration
     * @param Learner - The API service for the learner
     * @param Toast - The ToastService
     * @param _ - Lodash
     * @param Favicon - The FaviconService
     * @constructor
     */
    function LearnSetupController($scope, $state, SymbolGroupResource, Session, LearnConfiguration, Learner, Toast, _,
                                  Favicon) {

        // the project that is stored in the session
        var project = Session.project.get();

        /**
         * All symbol groups that belong the the sessions project
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * A list of all symbols of all groups that is used in order to select them
         * @type {Symbol[]}
         */
        $scope.allSymbols = [];

        /**
         * The configuration that is send to the server for learning
         * @type {LearnConfiguration}
         */
        $scope.learnConfiguration = new LearnConfiguration();

        /**
         * The symbol that should be used as a reset symbol
         * @type {Symbol|null}
         */
        $scope.resetSymbol = null;

        (function init() {

            // make sure that there isn't any other learn process active
            // redirect to the load screen in case there is an active one
            Learner.isActive()
                .then(function (data) {
                    if (data.active) {
                        if (data.project == project.id) {
                            Toast.info('There is currently running a learn process.');
                            $state.go('learn.start');
                        } else {
                            Toast.danger('There is already running a test from another project.');
                            $state.go('project')
                        }
                    } else {

                        // load all symbols in case there isn't any active learning process
                        SymbolGroupResource.getAll(project.id, {embedSymbols: true})
                            .then(function (groups) {
                                $scope.groups = groups;
                                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
                            });
                    }
                });
        }());

        /**
         * Sets the reset symbol
         *
         * @param {Symbol} symbol - The symbol that will be used to reset the sul
         */
        $scope.setResetSymbol = function (symbol) {
            $scope.resetSymbol = symbol;
        };

        /**
         * Starts the learning process if symbols are selected and a reset symbol is defined. Redirects to the
         * learning load screen on success.
         */
        $scope.startLearning = function () {
            var selectedSymbols;

            if ($scope.resetSymbol === null) {
                Toast.danger('You <strong>must</strong> selected a reset symbol in order to start learning!');
                return;
            }

            selectedSymbols = _.filter($scope.allSymbols, '_selected');

            if (selectedSymbols.length > 0) {
                _.forEach(selectedSymbols, function (symbol) {
                    $scope.learnConfiguration.addSymbol(symbol)
                });

                $scope.learnConfiguration.setResetSymbol($scope.resetSymbol);

                Learner.start(project.id, $scope.learnConfiguration)
                    .success(function () {
                        Toast.success('Learn process started successfully.');
                        //Favicon.changeTo(Favicon.LEARNING);
                        $state.go('learn.start');
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Start learning failed</strong></p>' + response.data.message);
                    });
            } else {
                Toast.danger('You <strong>must</strong> at least select one symbol to start learning');
            }
        };

        /**
         * Updates the learn configuration
         *
         * @param {LearnConfiguration} config
         */
        $scope.updateLearnConfiguration = function (config) {
            $scope.learnConfiguration = config;
        };
    }
}());