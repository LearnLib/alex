(function () {
    'use strict';

    angular
        .module('ALEX.core')
        .directive('panelManager', panelManager);

    function panelManager() {

        var template = '' +
            '<div style="position: absolute; top: 0; bottom: 0; width: 100%;">' +
            '   <div class="add-panel-button text-center" ng-click="addPanel()" tooltip="Add Panel" tooltip-placement="left">' +
            '       <i class="fa fa-2x fa-plus"></i>' +
            '   </div>' +
            '   <div style="position: absolute; left: 0; top: 0; bottom: 0; right: 0; background: #fff" ng-transclude></div>' +
            '</div>';

        return {
            template: template,
            transclude: true,
            scope: {
                panels: '=panelManager'
            },
            controller: [
                '$scope', '$timeout',
                controller
            ]
        };

        function controller($scope, $timeout) {

            this.getPanels = function () {
                return $scope.panels;
            };

            this.closePanelAt = function (index) {

                // this is a little odd ...
                // but otherwise some scope values are transferred to the element with index + 1 that takes the place
                // in the list after a normal splice
                $scope.panels[index] = null;
                $timeout(function(){
                    $scope.panels.splice(index, 1);
                }, 0);

                // has to call resize so that the hypothesis svg is resized properly
                $timeout(function(){
                    window.dispatchEvent(new Event('resize'));
                }, 100)
            };

            $scope.addPanel = function () {
                $scope.panels.push(null)
            }
        }
    }


    angular
        .module('ALEX.core')
        .directive('panel', panel);

    function panel() {

        var template = '<div class="panel" style="position: absolute; top: 0; bottom: 0; width: 100%;" ng-transclude></div>';

        return {
            require: '^panelManager',
            template: template,
            transclude: true,
            link: link,
            scope: {
                index: '=panelIndex'
            }
        };

        function link(scope, el, attrs, ctrl) {

            var panel = el.children()[0];
            scope.panels = ctrl.getPanels();

            scope.$watch('panels.length', init);
            init();

            function init() {
                panel.style.width = (100 / scope.panels.length) + '%';
                panel.style.left = ((100 / scope.panels.length) * (scope.index)) + '%';
            }
        }
    }
}());