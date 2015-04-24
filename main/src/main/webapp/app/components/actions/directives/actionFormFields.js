(function () {
    'use strict';

    var template = '    <div ng-include="getActionTemplate()"></div>' +
        '               <div ng-if="action !== null"><hr>' +
        '                   <p>' +
        '                       <a href ng-click="advancedOptions = !advancedOptions"><i class="fa fa-gear fa-fw"></i> Advanced Options</a>' +
        '                   </p>' +
        '                   <div collapse="!advancedOptions">' +
        '                       <div class="checkbox"><label><input type="checkbox" ng-model="action.negated"> Negate </label></div>' +
        '                       <div class="checkbox"><label><input type="checkbox" ng-model="action.ignoreFailure"> Ignore Failure </label></div>' +
        '                   </div>' +
        '               </div>';

    angular
        .module('ALEX.actions')
        .directive('actionFormFields', function () {
            return {
                scope: {
                    action: '='
                },
                template: template,
                link: function (scope) {
                    scope.getActionTemplate = function () {
                        return 'app/components/actions/views/' + scope.action.type + '.html';
                    }
                }
            }
        })
}());