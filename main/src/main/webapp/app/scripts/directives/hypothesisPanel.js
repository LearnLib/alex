(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('panelManager', panelManager);

    function panelManager() {

        var template = '' +
            '<div style="position: absolute; top: 0; bottom: 0; width: 100%;">' +
            '   <div ng-click="addPanel()" style="position: absolute; right: 0; top: 0; bottom: 0; width: 40px; background: #f2f2f2; border-left: 1px solid #e7e7e7"></div>' +
            '   <div style="position: absolute; left: 0; top: 0; bottom: 0; right: 40px; background: #fff" ng-transclude></div>' +
            '</div>';

        var directive = {
            template: template,
            transclude: true,
            scope: {
                panels: '=panelManager'
            },
            controller: [
                '$scope',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope) {

            this.getPanels = function () {
                return $scope.panels;
            };

            this.closePanelAt = function (index) {
                $scope.panels.splice(index, 1);
                $scope.$apply();

                // has to call resize so that the hypothesis svg is rezsied properly
                window.dispatchEvent(new Event('resize'));
            };

            //////////

            $scope.addPanel = function () {
                $scope.panels.push(null)
            }
        }
    }


    angular
        .module('weblearner.directives')
        .directive('panel', panel);

    function panel() {

        var template = '<div class="panel" style="position: absolute; top: 0; bottom: 0; width: 100%;" ng-transclude></div>';

        var directive = {
            require: '^panelManager',
            template: template,
            transclude: true,
            link: link,
            scope: {
                index: '=panelIndex'
            }
        };
        return directive;

        //////////

        function link(scope, el, attrs, ctrl) {

            var panel = el.children()[0];
            scope.panels = ctrl.getPanels();

            //////////

            scope.$watch('panels.length', init);
            init();

            //////////

            function init() {
                panel.style.width = (100 / scope.panels.length) + '%';
                panel.style.left = ((100 / scope.panels.length) * (scope.index)) + '%';
            }
        }
    }
}());