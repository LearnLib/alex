(function () {

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
        
        $scope.layoutSettings;

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
                    .then(function (data) {
                        if (!data.active) {
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

        $scope.abort = function () {

            if ($scope.active) {
                LearnerResource.stop()
                    .then(function(data){

                        console.log(data)
                    })
            }
        }
    }

}());
