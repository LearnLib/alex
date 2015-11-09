(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('learnResumeSettingsWidget', learnResumeSettingsWidget);

    /**
     * The directive for the widget of the sidebar where learn resume configurations can be edited. Should be included
     * into a <div widget></div> directive for visual appeal.
     *
     * Expects an attribute 'learnConfiguration' attached to the element whose value should be a LearnConfiguration
     * object.
     *
     * Use: <div learn-resume-settings-widget learn-configuration="..."></div>
     *
     * @param EqOracle
     * @returns {{scope: {learnConfiguration: string}, templateUrl: string, link: link}}
     */
    // @ngInject
    function learnResumeSettingsWidget(EqOracle) {
        return {
            scope: {
                learnConfiguration: '='
            },
            templateUrl: 'views/directives/learn-resume-settings-widget.html',
            link: link
        };

        function link(scope) {

            /**
             * The dictionary for eq oracle types
             * @type {Object}
             */
            scope.eqOracles = EqOracle.types;

            /**
             * The selected eq oracle type from the select box
             * @type {string}
             */
            scope.selectedEqOracle = scope.learnConfiguration.eqOracle.type;

            /**
             * Creates a new eq oracle object from the selected type and assigns it to the configuration
             */
            scope.setEqOracle = function () {
                scope.learnConfiguration.eqOracle = EqOracle.build(scope.selectedEqOracle);
            };
        }
    }
}());