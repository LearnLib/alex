function symbolGroupList() {
    return {
        transclude: true,
        template: `
            <div class="symbol-group-list" ng-transclude></div>
        `
    };
}

function symbolGroupListItem() {
    return {
        transclude: true,
        scope: {
            group: '='
        },
        template: `
                <div class="symbol-group-list-item" ng-class="{'collapsed':group._collapsed}">
                    <div class="symbol-group-list-item-header">
                        <checkbox-multiple model="group.symbols" class="pull-left"></checkbox-multiple>
                        <span class="cursor-pointer pull-right collapse-button" ng-click="group._collapsed = !group._collapsed">
                            <i class="fa fa-fw" ng-class="group._collapsed ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                        </span>
                        <div class="pull-right" ng-if="editable" style="margin-right: 6px;">
                            <a href="" symbol-group-edit-modal-handle group="group"
                               tooltip="Edit this group" tooltip-placement="left">
                                 <i class="fa fa-fw fa-gear"></i>
                            </a>
                        </div>
                        <div class="content">
                            <h3 class="symbol-group-title" ng-bind="group.name"></h3><br>
                            <span class="text-muted">
                                <span ng-bind="group.symbols.length"></span> Symbols
                            </span>
                        </div>
                    </div>
                    <div class="symbol-group-list-item-content" collapse="group._collapsed" ng-transclude></div>
                </div>
            `,
        link: function (scope, el, attrs) {
            scope.editable = attrs.editable === 'true';
        }
    };
}

export {symbolGroupList, symbolGroupListItem};