(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('actionFormWeb', actionFormWeb);

    /**
     * actionFormWeb
     *
     * The directive that loads the forms that are necessary to create web actions. The value of the parameter
     * actionModel should be an object that has at least the property 'type'.
     *
     * @return {{scope: {action: string}, templateUrl: string, controller: *[]}}
     */
    function actionFormWeb() {

        var directive = {
            scope: {
                action: '=actionModel'
            },
            templateUrl: 'app/partials/directives/action-form-web.html',
            controller: [
                '$scope', 'WebActionTypesEnum',
                ActionFormWebController
            ]
        };
        return directive;

        //////////

        function ActionFormWebController($scope, WebActionTypesEnum) {
            $scope.types = WebActionTypesEnum;
        }
    }
}());