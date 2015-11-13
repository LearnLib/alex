import {_} from '../../libraries';
import {events} from '../../constants';
import LearnConfiguration from '../../entities/LearnConfiguration';

/**
 * The controller that handles the preparation of a learn process. Lists all symbol groups and its visible symbols.
 *
 * @param $scope - The controllers scope
 * @param $state - The ui.router $state service
 * @param SymbolGroupResource - The API resource for symbol groups
 * @param SessionService - The SessionService
 * @param LearnerResource - The API service for the learner
 * @param ToastService - The ToastService
 * @param LearnResultResource - The API resource for learn results
 * @param EventBus
 * @constructor
 */
// @ngInject
function LearnSetupController($scope, $state, SymbolGroupResource, SessionService, LearnerResource, ToastService,
                              LearnResultResource, EventBus) {

    // the project that is stored in the session
    const project = SessionService.project.get();

    /**
     * All symbol groups that belong the the sessions project
     * @type {SymbolGroup[]}
     */
    $scope.groups = [];

    /**
     * The learn results of previous learn processes
     * @type {learnResult[]}
     */
    $scope.learnResults = [];

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

    /**
     * Indicates whether there is a learning process that can be continued (the last one)
     * @type {boolean}
     */
    $scope.canContinueLearnProcess = false;

    EventBus.on(events.LEARN_CONFIG_UPDATED, (evt, data) => {
        $scope.learnConfiguration = data.learnConfiguration;
    });

    // make sure that there isn't any other learn process active
    // redirect to the load screen in case there is an active one
    LearnerResource.isActive()
        .then(data => {
            if (data.active) {
                if (data.project == project.id) {
                    ToastService.info('There is currently running a learn process.');
                    $state.go('learn.start');
                } else {
                    ToastService.danger('There is already running a test from another project.');
                    $state.go('project')
                }
            } else {

                // load all symbols in case there isn't any active learning process
                SymbolGroupResource.getAll(project.id, {embedSymbols: true})
                    .then(groups => {
                        $scope.groups = groups;
                        $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
                    });

                // load learn results so that their configuration can be reused
                LearnResultResource.getAllFinal(project.id)
                    .then(learnResults => {
                        $scope.learnResults = learnResults;
                    })
            }
        });

    // get the status to check if there is a learn process that can be continued
    LearnerResource.getStatus()
        .then(data => {
            $scope.canContinueLearnProcess = data !== null;
        });

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
            ToastService.danger('You <strong>must</strong> selected a reset symbol in order to start learning!');
            return;
        }

        selectedSymbols = _.filter($scope.allSymbols, '_selected');

        if (selectedSymbols.length > 0) {
            _.forEach(selectedSymbols, function (symbol) {
                $scope.learnConfiguration.addSymbol(symbol)
            });

            $scope.learnConfiguration.setResetSymbol($scope.resetSymbol);

            LearnerResource.start(project.id, $scope.learnConfiguration)
                .success(function () {
                    ToastService.success('Learn process started successfully.');
                    $state.go('learn.start');
                })
                .catch(function (response) {
                    ToastService.danger('<p><strong>Start learning failed</strong></p>' + response.data.message);
                });
        } else {
            ToastService.danger('You <strong>must</strong> at least select one symbol to start learning');
        }
    };

    $scope.reuseConfigurationFromResult = function (result) {
        var config = result.configuration;
        $scope.learnConfiguration.algorithm = config.algorithm;
        $scope.learnConfiguration.eqOracle = config.eqOracle;
        $scope.learnConfiguration.maxAmountOfStepsToLearn = config.maxAmountOfStepsToLearn;

        var ids = _.pluck(config.symbols, 'id');
        _.forEach($scope.groups, function (group) {
            _.forEach(group.symbols, function (symbol) {
                symbol._selected = _.indexOf(ids, symbol.id) > -1;
                if (symbol.id === config.resetSymbol.id) {
                    $scope.resetSymbol = symbol;
                }
            })
        })
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

export default LearnSetupController;