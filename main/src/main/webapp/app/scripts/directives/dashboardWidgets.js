(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('dashboardWidget', dashboardWidget)
        .directive('learnerStatusWidget', learnerStatusWidget)
        .directive('latestLearnResultWidget', latestLearnResultWidget)
        .directive('projectDetailsWidget', projectDetailsWidget);

    learnerStatusWidget.$inject = ['LearnerService', 'ToastService'];
    latestLearnResultWidget.$inject = ['SessionService', 'LearnResult'];
    projectDetailsWidget.$inject = ['SessionService', 'SymbolGroup', 'LearnResult'];

    function dashboardWidget() {

        var template = '' +
            '<div class="panel" ng-class="panelClass ? panelClass : \'panel-default\'">' +
            '   <div class="panel-heading" ng-show="title !== undefined">' +
            '       <strong ng-bind="title"></strong>' +
            '   </div>' +
            '   <div class="panel-body" ng-transclude></div>' +
            '</div>';

        return {
            scope: {},
            transclude: true,
            template: template,
            controller: ['$scope', function ($scope) {

                $scope.panelClass = null;
                $scope.title = null;

                this.setWidgetClass = function (cssClass) {
                    $scope.panelClass = cssClass;
                };

                this.setWidgetTitle = function (title) {
                    $scope.title = title;
                }
            }]
        }
    }

    function learnerStatusWidget(Learner, Toast) {

        var template = '' +
            '<div class="alert alert-info no-margin-bottom" ng-show="!isActive && !hasFinished">The Learner is not active. <a ui-sref="learn.setup">Start learning</a> your application!</div>' +
            '<div class="alert alert-info no-margin-bottom" ng-show="!isActive && hasFinished">The Learner is not active and created a model. ' +
            '   <a ui-sref="learn.start">Refine it</a> or <a ui-sref="learn.results.compare({testNos: [result.testNo]})">have a look at it!</a></div>' +
            '<div class="alert alert-warning no-margin-bottom clearfix" ng-show="isActive">The Learner is currently learning an application. <hr>' +
            '   <button class="btn btn-xs btn-warning pull-right" ng-click="abort()">Abort</button>' +
            '</div>';

        return {
            require: '^dashboardWidget',
            link: link,
            template: template
        };

        function link(scope, el, attrs, ctrl) {
            ctrl.setWidgetTitle('Learner Status');

            scope.isActive = false;
            scope.hasFinished = false;
            scope.result = null;

            Learner.isActive().then(function (data) {
                scope.isActive = data.active;

                if (!data.active) {
                    Learner.getStatus()
                        .then(function(data){
                            scope.hasFinished = data !== '';
                            scope.result = data;
                        });
                }
            });

            scope.abort = function () {
                Learner.stop().then(function () {
                    Toast.info('The Learner stops with the next hypothesis');
                })
            }
        }
    }

    function latestLearnResultWidget(Session, LearnResult) {
        var template = '' +
            '<div class="text-muted" ng-show="!result"><em>There are no learn results in the database</em></div>' +
            '<div ng-show="result">' +
            '   <p>The latest learning process started at <strong ng-bind="::(result.statistics.startTime | date : \'EEE, dd.MM.yyyy, HH:mm\')"></strong>' +
            '       with EQ-oracle <strong ng-bind="::(result.configuration.eqOracle.type | formatEqOracle)"></strong>' +
            '       and the <strong ng-bind="::(result.configuration.algorithm | formatAlgorithm)"></strong> algorithm.' +
            '   </p>' +
            '   <a class="btn btn-xs btn-default" ui-sref="learn.results.compare({testNos: [result.testNo]})">Check it out</a>' +
            '</div>';

        return {
            require: '^dashboardWidget',
            link: link,
            template: template
        };

        function link(scope, el, attrs, ctrl) {
            ctrl.setWidgetTitle('Latest Learn Result');

            scope.result = null;

            LearnResult.Resource.getAllFinal(Session.project.get().id)
                .then(function (results) {
                    if (results.length > 0) {
                        scope.result = results[results.length - 1];
                    }
                })
        }
    }

    function projectDetailsWidget(Session, SymbolGroup, LearnResult){
        var template = '' +
            '<table class="table table-condensed">' +
            '   <tbody>' +
            '       <tr>' +
            '           <td><strong>Name</strong></td>' +
            '           <td ng-bind="::project.name"></td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td><strong>URL</strong></td>' +
            '           <td><a href="{{::project.baseUrl}}" target="_blank" ng-bind="::project.baseUrl"></a></td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td><strong>#Groups</strong></td>' +
            '           <td ng-bind="::numberOfGroups"></td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td><strong>#Symbols</strong></td>' +
            '           <td ng-bind="::numberOfSymbols"></td>' +
            '       </tr>' +
            '       <tr>' +
            '           <td><strong>#Tests</strong></td>' +
            '           <td ng-bind="::numberOfTests"></td>' +
            '       </tr>' +
            '   </tbody>' +
            '</table>';

        return {
            require: '^dashboardWidget',
            link: link,
            template: template
        };

        function link(scope, el, attrs, ctrl) {
            ctrl.setWidgetTitle('About this Project');

            scope.project = Session.project.get();
            scope.numberOfGroups;
            scope.numberOfSymbols;
            scope.numberOfTests;

            SymbolGroup.Resource.getAll(scope.project.id)
                .then(function(groups){
                    scope.numberOfGroups = groups.length;
                    var counter = 0;
                    for (var i = 0; i < groups.lenght; i++) {
                        counter += groups[i].symbols.length;
                    }
                    scope.numberOfSymbols = counter;
                });

            LearnResult.Resource.getAllFinal(scope.project.id)
                .then(function(results){
                    scope.numberOfTests = results.length;
                })
        }
    }
}());