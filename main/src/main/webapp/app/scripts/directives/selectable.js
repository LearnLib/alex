(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('selectionCheckboxAll', selectionCheckboxAll)
        .directive('selectableListItem', selectableListItem);

    function selectionCheckboxAll() {

        var directive = {
            scope: {
                items: '&'
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs, ctrl) {
            el.on('change', function () {
                var _this = this;
                var items = scope.items();

                if (angular.isFunction(items)) {
                    items = items();
                }

                scope.$apply(function () {
                    for (var i = 0; i < items.length; i++) {
                        items[i]._selected = _this.checked;
                    }
                });
            })
        }
    }

    function selectableListItem() {

        var directive = {
            transclude: true,
            template: ' <div class="selectable-list-item">' +
            '               <div class="selectable-list-control">' +
            '                   <input type="checkbox">' +
            '               </div>' +
            '               <div class="selectable-list-content" ng-transclude></div>' +
            '           </div>'
        };
        return directive;
    }
}());