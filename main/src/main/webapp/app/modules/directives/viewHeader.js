/**
 * The controller for the view header component that is displayed in almost all views
 * Use it like '<view-heading title="..."> ... </view-heading>' where 'title' should be a string
 */
class ViewHeader {

    /** Constructor */
    constructor() {

        /**
         * The title that is displayed in the header
         * @type {null|string}
         */
        this.title = null;
    }
}

const viewHeader = {
    bindings: {
        title: '@'
    },
    controller: ViewHeader,
    controllerAs: 'vm',
    template: `
        <div class="view-header">
            <div class="alx-container-fluid">
                <div class="view-header-title-pre" ng-transclude></div>
                <h2 class="view-header-title" ng-bind="::vm.title"></h2>
            </div>
        </div>
    `
};

export default viewHeader;