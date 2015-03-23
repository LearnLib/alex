(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('widget', widget)
        .directive('counterExamplesWidget', counterExamplesWidget)
        .directive('learnResumeSettingsWidget', learnResumeSettingsWidget);

    counterExamplesWidget.$inject = ['paths', 'CounterExampleService', 'LearnerService', 'ToastService', '_', 'outputAlphabet'];
    learnResumeSettingsWidget.$inject = ['paths'];


    function widget() {

        var template = '' +
            '<div class="panel panel-default">' +
            '   <div class="panel-heading">' +
            '       <div class="pull-right">' +
            '           <span class="panel-collapse-handle" ng-click="toggleCollapse()">' +
            '               <i class="fa" ng-class="collapsed? \'fa-plus-square\' : \'fa-minus-square\'"></i>' +
            '           </span>' +
            '       </div>' +
            '       <strong class="text-muted" ng-bind="title"></strong>' +
            '   </div>' +
            '   <div class="panel-body" ng-show="!collapsed" ng-transclude></div>' +
            '</div>';

        var directive = {
            scope: {
                collapsed: '='
            },
            template: template,
            transclude: true,
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            scope.title = attrs.widgetTitle || 'Untitled';
            scope.collapsed = scope.collapsed || false;

            scope.toggleCollapse = function () {
                scope.collapsed = !scope.collapsed;
            }
        }
    }


    function counterExamplesWidget(paths, CounterExampleService, Learner, Toast, _, outputAlphabet) {

        return {
            scope: {
                counterExamples: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/counter-examples-widget.html',
            controller: ['$scope', controller]
        };

        function controller($scope) {

            $scope.counterExample = [];
            $scope.tmpCounterExamples = [];

            function init() {
                $scope.counterExample = CounterExampleService.getCurrentCounterexample();
            }

            function renewCounterexamples() {
                $scope.counterExamples = {
                    input: _.pluck($scope.tmpCounterExamples, 'input'),
                    output: _.pluck($scope.tmpCounterExamples, 'output')
                }
            }

            $scope.removeInputOutputAt = function (i) {
                $scope.counterExample.splice(i, 1);
            };

            $scope.toggleOutputAt = function (i) {
                if ($scope.counterExample[i].output === outputAlphabet.OK) {
                    $scope.counterExample[i].output = outputAlphabet.FAILED
                } else {
                    $scope.counterExample[i].output = outputAlphabet.OK
                }
            };

            $scope.addCounterExample = function () {
                $scope.tmpCounterExamples.push($scope.counterExample);
                CounterExampleService.resetCurrentCounterexample();
                renewCounterexamples();
                init();
            };

            $scope.removeCounterExampleAt = function (i) {
                $scope.tmpCounterExamples.splice(i, 1);
                renewCounterexamples();
            };

            $scope.selectCounterExampleAt = function (i) {
                CounterExampleService.setCurrentCounterexample($scope.tmpCounterExamples[i]);
                $scope.removeCounterExampleAt(i);
                init();
            };

            $scope.testCounterExample = function () {
                Learner.isCounterexample($scope.counterExample)
                    .then(function (isCounterexample) {
                        if (isCounterexample) {
                            Toast.success('The selected path is a counterexample');
                        } else {
                            Toast.danger('The selected path is not a counterexample');
                        }
                    })
            };

            init();
        }
    }


    function learnResumeSettingsWidget(paths) {

        return {
            templateUrl: paths.views.DIRECTIVES + '/learn-resume-settings-widget.html',
            scope: {
                configuration: '='
            },
            controller: ['$scope', 'eqOracles', 'EqOracle', controller]
        };

        function controller($scope, eqOracles, EqOracle) {

            $scope.eqOracles = eqOracles;

            $scope.selectedEqOracle = $scope.configuration.eqOracle.type;

            $scope.setEqOracle = function () {
                $scope.configuration.eqOracle = EqOracle.createFromType($scope.selectedEqOracle);
            };
        }
    }
}());