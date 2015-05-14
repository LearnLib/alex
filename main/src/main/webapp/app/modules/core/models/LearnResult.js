(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .factory('LearnResult', LearnResultFactory);

    LearnResultFactory.$inject = ['LearnConfiguration', '_'];

    /**
     * The factory for the model of a learn result
     *
     * @param LearnConfiguration - The factory for LearnConfiguration
     * @param _ - Lodash
     * @returns {LearnResult}
     * @constructor
     */
    function LearnResultFactory(LearnConfiguration, _) {

        /**
         * The model of a learn result
         *
         * @constructor
         */
        function LearnResult() {
        }

        /**
         * Creates a new instance of a LearnResult from an object
         *
         * @param {Object} data - The object the learn result should be build from
         * @returns {LearnResult} - The instance of LearnResult from the data
         */
        LearnResult.build = function (data) {
            var result = new LearnResult();
            result.configuration = LearnConfiguration.build(data.configuration);
            result.hypothesis = data.hypothesis;
            result.project = data.project;
            result.sigma = data.sigma;
            result.stepNo = data.stepNo;
            result.testNo = data.testNo;
            result.algorithmInformation = data.algorithmInformation;
            result.statistics = data.statistics;
            result.error = data.error;
            result.errorText = data.errorText;
            return result;
        };

        LearnResult.transformApiResponse = function(response){
            if (angular.isArray(response.data)) {
                if (angular.isArray(response.data[0])){
                    return _.forEach(response.data, function(completeResult){
                        _.map(completeResult, LearnResult.build);
                    })
                }else {
                    return _.map(response.data, LearnResult.build);
                }
            } else {
                return LearnResult.build(response.data);
            }
        };

        return LearnResult;
    }
}());