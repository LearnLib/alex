/**
 * The directive for displaying a widget without content. Use is a a wrapper for any content you like.
 *
 * Attribute 'title' {string} can be applied for displaying a widget title.
 *
 * Use: '<widget title="..."></widget>'
 *
 * @returns {{scope: {title: string}, template: string, transclude: boolean, link: link}}
 */
function widget() {
    return {
        scope: {
            title: '@'
        },
        template: `
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <strong class="text-muted" ng-bind="::title"></strong>
                    </div>
                    <div class="panel-body" ng-transclude></div>
                </div>
            `,
        transclude: true,
        link: link
    };

    function link(scope) {

        /**
         * The title that should be displayed in the widget header
         * @type {string}
         */
        scope.title = scope.title || 'Untitled';
    }
}

export default widget;