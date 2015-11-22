/**
 * The directive that loads an action template by its type. E.g. type: 'web_click' -> load 'web_click.html'
 *
 * Attribute 'action' should contain the action object
 * Attribute 'symbols' should contain the list of symbols so that they are available by the action
 *
 * Use: <action-form-fields action="..." symbols="..."></action-form-fields>
 * @returns {{scope: {action: string}, template: string}}
 */
function actionFormFields() {
    return {
        scope: {
            action: '=',
            symbols: '='
        },
        controller: ['$scope', ($scope) => {
            $scope.map = {};

            $scope.getActionTemplate = function () {
                return 'views/actions/' + $scope.action.type + '.html';
            }
        }],
        template: `
            <div ng-include="getActionTemplate()"></div>
            <div ng-if="action !== null">
                <hr>
                <p>
                    <a href="" ng-click="advancedOptions = !advancedOptions"><i class="fa fa-gear fa-fw"></i> Advanced Options</a>
                </p>
                <div collapse="!advancedOptions">
                    <div class="checkbox">
                        <label><input type="checkbox" ng-model="action.negated"> Negate </label>
                    </div>
                    <div class="checkbox">
                        <label><input type="checkbox" ng-model="action.ignoreFailure"> Ignore Failure </label>
                    </div>
                </div>
            </div>
        `
    }
}

export default actionFormFields;