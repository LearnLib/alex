(function () {

    angular
        .module('weblearner.models')
        .factory('EqOracle', EqOracleModel);

    EqOracleModel.$inject = ['eqOracles'];

    function EqOracleModel(eqOracles) {

        var EqOracle = {
            Random: Random,
            Complete: Complete,
            Sample: Sample,
            build: build
        };
        return EqOracle;

        function Random(minLength, maxLength) {
            this.type = eqOracles.RANDOM;
            this.minLength = minLength || 1;
            this.maxLength = maxLength || 1;
        }

        function Complete(minDepth, maxDepth) {
            this.type = eqOracles.COMPLETE;
            this.minDepth = minDepth || 1;
            this.maxDepth = maxDepth || 1;
        }

        function Sample() {
            this.type = eqOracles.SAMPLE;
        }

        function build(data) {
            var eqOracle;

            switch (data.type) {
                case eqOracles.RANDOM:
                    eqOracle = new Random(data.minLength, data.maxLength);
                    break;
                case eqOracles.COMPLETE:
                    eqOracle = new Complete(data.minDepth, data.maxDepth);
                    break;
                case eqOracles.SAMPLE:
                    eqOracle = new Sample();
                    break;
                default :
                    break;
            }
        }
    }
}());