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
            template: ' <table class="table" >' +
            '               <thead>' +
            '                   <tr>' +
            '                       <th style="width: 1px"></th>' +
            '                       <th></th>' +
            '                   </tr>' +
            '               </thead>' +
            '               <tbody ng-transclude>' +
            '               </tbody>' +
            '           </table>',
            controller: ['$scope', controller]
        };
        return directive;

        //////////

        function controller($scope) {

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
            template: ' <tr ng-class="item._selected ? \'active\' : \'\'">' +
            '               <td>' +
            '                   <input type="checkbox" ng-model="item._selected"><br>' +
            '               </td>' +
            '               <td>' +
            '                   <div ng-transclude></div>' +
            '               </td>' +
            '           </tr>',
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, ctrl) {
            scope.item = ctrl.getItems()[scope.$index];
        }
    }
}());