(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('actionFormGroupsRest', actionFormGroupsRest);

    /**
     * actionFormGroupsRest
     *
     * The directive that loads the forms that are necessary to create rest actions. The value of the parameter
     * actionModel should be an object that has at least the property 'type'.
     *
     * @return {{scope: {action: string}, templateUrl: string, controller: *[]}}
     */
    function actionFormGroupsRest() {

        // the directive
        var directive = {
            scope: {
                action: '=actionModel'
            },
            templateUrl: 'app/partials/directives/action-form-rest.html',
            controller: [
                '$scope', 'RestActionTypesEnum',
                ActionFormWebController
            ]
        };
        return directive;

        //////////

        /**
         * ActionFormWebController
         *
         * Actually this controller does nothing but setting a scope variable so that the template have access
         * to it
         *
         * @param $scope
         * @param RestActionTypesEnum
         * @constructor
         */
        function ActionFormWebController($scope, RestActionTypesEnum) {

            $scope.types = RestActionTypesEnum;
        }
    }
}());