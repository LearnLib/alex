(function () {
    'use strict';

    angular
        .module('weblearner.models')
        .factory('LearnResult', LearnResultModel);

    LearnResultModel.$inject = ['LearnConfiguration', 'LearnResultResource'];

    /**
     * The factory for the model of a learn result
     *
     * @param LearnConfiguration
     * @param LearnResultResource
     * @returns {LearnResult}
     * @constructor
     */
    function LearnResultModel(LearnConfiguration, LearnResultResource) {

        /**
         * The model of a learn result
         *
         * @constructor
         */
        function LearnResult() {
            this.amountOfResets;
            this.configuration;
            this.hypothesis;
            this.duration;
            this.project;
            this.sigma;
            this.startTime;
            this.stepNo;
            this.testNo;
            this.algorithmInformation;
        }

        /**
         * Creates a new instance of a LearnResult from an object
         *
         * @param {Object} data - The object the learn result should be build from
         * @returns {LearnResultModel.LearnResult} - The instance of LearnResult from the data
         */
        LearnResult.build = function (data) {
            var result = new LearnResult();
            result.amountOfResets = data.amountOfResets;
            result.configuration = LearnConfiguration.build(data.configuration);
            result.hypothesis = data.hypothesis;
            result.duration = data.duration;
            result.project = data.project;
            result.startTime = data.startTime;
            result.stepNo = data.stepNo;
            result.testNo = data.testNo;
            result.algorithmInformation = data.algorithmInformation;
            return result;
        };

        /**
         * Creates a list of new instances of LearnResult from a list of objects
         *
         * @param {Object[]} data - The list of objects the list of learn results should be build from
         * @returns {LearnResultModel.LearnResult[]} - The list of learn results
         */
        LearnResult.buildSome = function (data) {
            var results = [];
            for (var i = 0; i < data.length; i++) {
                results.push(LearnResult.build(data[i]));
            }
            return results;
        };

        /**
         * The resource for learn results for communication with the API
         * @type {LearnResultResource}
         */
        LearnResult.Resource = new LearnResultResource();

        // overwrite the build methods of the resource so that the API returns instances of
        // learn results instead of plain objects
        LearnResult.Resource.build = LearnResult.build;
        LearnResult.Resource.buildSome = LearnResult.buildSome;

        return LearnResult;
    }
}());