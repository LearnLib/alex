(function () {
    'use strict';

    angular
        .module('weblearner.models')
        .factory('LearnConfiguration', LearnConfigurationModel);

    LearnConfigurationModel.$inject = ['learnAlgorithms', 'EqOracle'];

    function LearnConfigurationModel(learnAlgorithms, EqOracle) {

        function LearnConfiguration() {
            this.symbols = [];
            this.maxAmountOfStepsToLearn = 0;
            this.eqOracle = new EqOracle.Complete();
            this.algorithm = learnAlgorithms.EXTENSIBLE_LSTAR;
        }

        LearnConfiguration.build = function (data) {
            var learnConfiguration = new LearnConfiguration();
            learnConfiguration.symbols = data.symbols;
            learnConfiguration.maxAmountOfStepsToLearn = data.maxAmountOfStepsToLearn;
            learnConfiguration.algorithm = data.algorithm;
            learnConfiguration.eqOracle = data.eqOracle;
            return learnConfiguration;
        };

        return LearnConfiguration;
    }
}());