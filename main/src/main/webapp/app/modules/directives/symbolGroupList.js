(function () {
    'use strict';

    angular
        .module('ALEX.directives')
        .directive('symbolGroupList', symbolGroupList)
        .directive('symbolGroupListItem', symbolGroupListItem)
        .directive('symbolGroupListItemHeader', symbolGroupListItemHeader)
        .directive('symbolGroupListItemContent', symbolGroupListItemContent);

    function symbolGroupList() {
        return {
            transclude: true,
            template: '<div class="symbol-group-list" ng-transclude></div>'
        }
    }

    function symbolGroupListItem() {
        return {
            transclude: true,
            scope: {
                group: '='
            },
            template: ' <div class="symbol-group-list-item" ' +
            '               ng-class="group._collapsed ? \'collapsed\' : \'\'">' +
            '               <div ng-transclude></div>' +
            '           </div>',
            controller: ['$scope', function (scope) {
                this.getGroup = function () {
                    return scope.group
                }
            }]
        }
    }

    function symbolGroupListItemHeader() {
        return {
            require: '^symbolGroupListItem',
            transclude: true,
            template: ' <div class="symbol-group-list-item-header">' +
            '               <checkbox-multiple model="group.symbols" class="pull-left"></checkbox-multiple>' +
            '               <span class="cursor-pointer pull-right collapse-button" ng-click="group._collapsed = !group._collapsed">' +
            '                   <i class="fa fa-fw" ng-class="group._collapsed ? \'fa-chevron-down\' : \'fa-chevron-right\'"></i>' +
            '               </span>' +
            '               <div class="buttons pull-right" ng-transclude></div>' +
            '               <div class="content">' +
            '                   <h3 class="symbol-group-title" ng-bind="group.name"></h3><br>' +
            '                   <span class="text-muted">' +
            '                       <span ng-bind="group.symbols.length"></span> Symbols' +
            '                   </span>' +
            '               </div>' +
            '           </div>',
            link: function (scope, el, attrs, ctrl) {
                scope.group = ctrl.getGroup();
            }
        }
    }

    function symbolGroupListItemContent() {
        return {
            transclude: true,
            template: '<div class="symbol-group-list-item-content" collapse="group._collapsed" ng-transclude></div>'
        }
    }
}());