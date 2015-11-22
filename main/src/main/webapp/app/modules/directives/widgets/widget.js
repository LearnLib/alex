/**
 * Component for displaying a bootstrap panel with a title and a specific content
 *
 * Use: <widget title="..."></widget> where
 * 'title' is the text to display in the header of the panel
 */
class Widget {

    /** Constructor */
    constructor() {

        /**
         * The title of the widget
         * @type {string}
         */
        this.title = '&nbsp;';
    }
}

const widget = {
    controller: Widget,
    controllerAs: 'vm',
    bindings: {
        title: '@'
    },
    template: `
      <div class="panel panel-default">
          <div class="panel-heading">
            <strong class="text-muted" ng-bind="vm.title"></strong>
          </div>
          <div class="panel-body" ng-transclude></div>
      </div>
   `
};

export default widget;