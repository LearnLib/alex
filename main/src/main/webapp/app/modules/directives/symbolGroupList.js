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
                        <div class="flex-item">
                            <checkbox-multiple model="group.symbols"></checkbox-multiple>
                        </div>
                        <div class="flex-item">
                            <h3 class="symbol-group-title" ng-bind="group.name"></h3><br>
                            <span class="text-muted">
                                <span ng-bind="group.symbols.length"></span> Symbols
                            </span>
                        </div>
                        <div class="flex-item" ng-if="editable">
                            <a href="" symbol-group-edit-modal-handle group="group"
                               tooltip="Edit this group" tooltip-placement="left">
                                 <i class="fa fa-fw fa-gear"></i>
                            </a>
                        </div>
                    </div>
                    <div class="symbol-group-list-item-body" ng-transclude></div>
                </div>
            `,
        link: function (scope, el, attrs) {
            scope.editable = attrs.editable === 'true';
        }
    };
}

export {symbolGroupList, symbolGroupListItem};