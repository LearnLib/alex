(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('selectionCheckboxAll', selectionCheckboxAll)
        .directive('selectableListItem', selectableListItem);

    /**
     * Directive to select multiple items at once. Can only be used as an attribute to a input[type=checkbox] element.
     * On change, toggles property '_selected' of each item.
     *
     * Attribute 'items' should be the list of selectable items or a function that returns this list.
     *
     * Use: '<input type="checkbox" selection-checkbox-all items="..."/>'
     *
     * @returns {{restrict: string, scope: {items: string}, link: link}}
     */
    function selectionCheckboxAll() {
        return {
            restrict: 'A',
            scope: {
                items: '&'
            },
            link: link
        };
        function link(scope, el, attrs) {
            el.on('change', function () {
                var _this = this;
                var items = scope.items();

                // if attribute was function get items
                if (angular.isFunction(items)) {
                    items = items();
                }

                // select or deselect all items
                scope.$apply(function () {
                    for (var i = 0; i < items.length; i++) {
                        items[i]._selected = _this.checked;
                    }
                });
            })
        }
    }

    /**
     * The directive serves only as a template to reduce HTML code. Use it to display a selectable item and fill it with
     * stuff you want.
     *
     * Use: '<div selectable-list-item> ... </div>';
     *
     * @returns {{transclude: boolean, template: string}}
     */
    function selectableListItem() {
        return {
            transclude: true,
            template: ' <div class="selectable-list-item">' +
            '               <div class="selectable-list-control">' +
            '                   <input type="checkbox">' +
            '               </div>' +
            '               <div class="selectable-list-content" ng-transclude></div>' +
            '           </div>'
        };
    }
}());