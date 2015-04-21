(function () {
    'use strict';

    angular
        .module('ALEX.models')
        .factory('LearnConfiguration', LearnConfigurationModel);

    LearnConfigurationModel.$inject = ['learnAlgorithms', 'EqOracle'];

    /**
     * The model for setting parameters for a learn process.
     *
     * @param learnAlgorithms
     * @param EqOracle
     * @returns {LearnConfiguration}
     * @constructor
     */
    function LearnConfigurationModel(learnAlgorithms, EqOracle) {

        /**
         * @constructor
         */
        function LearnConfiguration() {
            this.symbols = [];
            this.maxAmountOfStepsToLearn = 0;
            this.eqOracle = new EqOracle.Random(1, 10, 20);
            this.algorithm = learnAlgorithms.LSTAR;
            this.resetSymbol = null;
        }

        LearnConfiguration.prototype.toLearnResumeConfiguration = function () {
            delete this.symbols;
            delete this.algorithm;
            delete this.resetSymbol;
            return this;
        }

        /**
         *
         * @param symbol
         */
        LearnConfiguration.prototype.setResetSymbol = function (symbol) {
            this.resetSymbol = {
                id: symbol.id,
                revision: symbol.revision
            };
        };

        /**
         *
         * @param symbol
         */
        LearnConfiguration.prototype.addSymbol = function (symbol) {
            this.symbols.push({
                id: symbol.id,
                revision: symbol.revision
            });
        };

        /**
         *
         * @returns {*}
         */
        LearnConfiguration.prototype.copy = function () {
            return LearnConfiguration.build(angular.copy(this));
        };


        /**
         *
         * @param data
         * @returns {LearnConfigurationModel.LearnConfiguration}
         */
        LearnConfiguration.build = function (data) {
            var learnConfiguration = new LearnConfiguration();
            learnConfiguration.symbols = data.symbols;
            learnConfiguration.maxAmountOfStepsToLearn = data.maxAmountOfStepsToLearn;
            learnConfiguration.algorithm = data.algorithm;
            learnConfiguration.eqOracle = EqOracle.build(data.eqOracle);
            learnConfiguration.resetSymbol = data.resetSymbol;
            return learnConfiguration;
        };

        return LearnConfiguration;
    }
}());