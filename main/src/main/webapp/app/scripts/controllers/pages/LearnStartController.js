(function () {

    angular
        .module('weblearner.controller')
        .controller('LearnStartController', LearnStartController);

    LearnStartController.$inject = [
        '$scope', '$interval', 'SessionService', 'LearnerService', 'LearnResult', 'ToastService'
    ];

    /**
     * The controller for showing a load screen during the learning and shows all learn results from the current test
     * in the intermediate steps.
     *
     * The template can be found at 'views/pages/learn-start.html'.
     *
     * @param $scope
     * @param $interval
     * @param Session
     * @param Learner
     * @param LearnResult
     * @param Toast
     * @constructor
     */
    function LearnStartController($scope, $interval, Session, Learner, LearnResult, Toast) {

        // The project that is stored in the session
        var project = Session.project.get();

        // The interval object
        var interval = null;

        // The time for the polling interval
        var intervalTime = 10000;

        /**
         * The complete learn result until the most recent learned one
         * @type {LearnResult[]}
         */
        $scope.results = [];

        /**
         * Indicates if polling the server for a test result is still active
         * @type {boolean}
         */
        $scope.active = false;

        /**
         *
         * @type {{input: string, output: string}}
         */
        $scope.counterExample = {
            input: '',
            output: ''
        };

        // initialize the controller
        (function init() {

            // start polling the server
            poll();

            // stop polling when you leave the page
            $scope.$on("$destroy", function () {
                $interval.cancel(interval);
            });
        }());

        /**
         * Checks every x seconds if the server has finished learning and set the test if he did finish
         */
        function poll() {
            $scope.active = true;
            interval = $interval(function () {
                Learner.isActive()
                    .then(function (data) {
                        if (!data.active) {
                            Learner.getStatus().then(loadComplete);
                            $interval.cancel(interval);
                            $scope.active = false;
                        }
                    })
            }, intervalTime);

            // load the complete set of steps for the learn result
            function loadComplete(result) {
                LearnResult.Resource.getComplete(project.id, result.testNo)
                    .then(function (results) {
                        $scope.results = results;
                    });
            }
        }

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
         */
        $scope.resumeLearning = function () {
            var copy = angular.copy(_.last($scope.results).configuration);
            delete copy.algorithm;
            delete copy.symbols;
            delete copy.resetSymbol;
            Learner.resume(project.id, _.last($scope.results).testNo, copy)
                .then(poll)
        };

        /**
         * Tell the learner to stop learning at the next possible time, when the next hypothesis is generated
         */
        $scope.abort = function () {
            if ($scope.active) {
                Toast.info('The learner will stop with the next hypothesis');
                Learner.stop()
            }
        };

        /**
         * Test if a counter example really is one
         *
         * @param counterExample
         */
        $scope.testCounterExample = function (counterExample) {
            
        }
    }
}());
