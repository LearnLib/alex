(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('selectAllItemsCheckbox', [
            'SelectionService',
            selectAllItemsCheckbox
        ]);

    function selectAllItemsCheckbox(SelectionService) {

        var directive = {
            scope: {
                items: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, selectionCtrl) {

            el.on('change', changeSelection);

            function changeSelection() {
                if (this.checked) {
                    SelectionService.selectAll(scope.items);
                } else {
                    SelectionService.deselectAll(scope.items);
                }
                scope.$apply();
            }
        }
    }


    angular
        .module('weblearner.directives')
        .directive('selectableList', selectableList);

    function selectableList() {

        var directive = {
            transclude: true,
            replace: true,
            require: 'ngModel',
            scope: {
                items: '=ngModel'
            },
            template: '<div class="selectable-list" ng-transclude></div>',
            controller: ['$scope', 'SelectionService', controller]
        };
        return directive;

        //////////

        function controller($scope, SelectionService) {

            this.getItems = function () {
                return $scope.items;
            };
        }
    }


    angular
        .module('weblearner.directives')
        .directive('selectableListItem', selectableListItem);

    function selectableListItem() {

        var directive = {
            require: '^selectableList',
            replace: true,
            transclude: true,
            template: ' <div class="selectable-list-item" ng-class="item._selected ? \'active\' : \'\'">' +
            '               <div class="selectable-list-control">' +
            '                   <input type="checkbox" ng-model="item._selected">' +
            '               </div>' +
            '               <div class="selectable-list-content" ng-transclude></div>' +
            '           </div>',
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, ctrl) {

            scope.item = ctrl.getItems()[scope.$index];
        }
    }
}());