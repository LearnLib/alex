(function () {

    angular
        .module('weblearner.controller')
        .controller('LearnStartController', LearnStartController);

    LearnStartController.$inject = ['$scope', '$interval', 'SessionService', 'LearnerService'];

    /**
     * Shows a load screen and the hypothesis of a test.
     *
     * @param $scope
     * @param $interval
     * @param Session
     * @param Learner
     * @constructor
     */
    function LearnStartController($scope, $interval, Session, Learner) {

        var _project = Session.project.get();
        var _interval = null;
        var _intervalTime = 10000;

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

        $scope.layoutSettings;

        // initialize the controller
        (function init() {

            // start polling the server
            poll();

            // stop polling when you leave the page
            $scope.$on("$destroy", function () {
                $interval.cancel(_interval);
            });
        }());

        /**
         * Checks every x seconds if the server has finished learning and set the test if he did finish
         */
        function poll() {
            $scope.active = true;
            _interval = $interval(function () {
                Learner.isActive()
                    .then(function (data) {
                        if (!data.active) {
                            Learner.getStatus()
                                .then(function (test) {
                                    $scope.active = false;
                                    $scope.test = test;
                                    $scope.isEqOracleSample = test.configuration.eqOracle.type === 'sample';
                                    console.log(test);
                                });
                            $interval.cancel(_interval);
                        }
                    })
            }, _intervalTime);
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
            var copy = angular.copy($scope.test.configuration);
            delete copy.algorithm;
            delete copy.symbols;
            delete copy.resetSymbol;
            Learner.resume(_project.id, $scope.test.testNo, copy)
                .then(poll)
        };

        $scope.abort = function () {
            if ($scope.active) {
                Learner.stop()
                    .then(function (data) {
                        console.log(data)
                    })
            }
        };

        $scope.testCounterExample = function (counterExample) {
            return;
        }
    }
}());
