(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('selectable', selectable)
        .directive('selectableList', selectableList)
        .directive('selectableListItem', selectableListItem)
        .directive('selectableItemCheckbox', selectableItemCheckbox);
    
    function selectable() {

        var directive = {
            scope: {
                items: '='
            },
            controller: ['$scope', controller]
        };
        return directive;

        function controller($scope) {
            this.getItems = function () {
                return $scope.items;
            }
        }
    }

    function selectableList() {

        var directive = {
            transclude: true,
            replace: true,
            template: '<div class="selectable-list" ng-transclude></div>'
        };
        return directive;
    }

    function selectableListItem() {

        var directive = {
            require: '^selectable',
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

        function link(scope, el, attrs, ctrl) {
            scope.item = ctrl.getItems()[scope.$index];
        }
    }

    function selectableItemCheckbox() {

        var directive = {
            require: '^selectable',
            link: link
        };
        return directive;

        function link(scope, el, attrs, ctrl) {

            var items;
            var _this;

            el.on('change', function () {
                items = ctrl.getItems();
                _this = this;

                scope.$apply(function () {
                    for (var i = 0; i < items.length; i++) {
                        items[i]._selected = _this.checked;
                    }
                });
            })
        }
    }
}());