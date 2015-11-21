/**
 * The directive that is used for the sticky sub navigation that mostly contains call to action buttons for the
 * current view
 *
 * Use: '<action-bar></action-bar>'
 *
 * @param $window - angular $window
 * @returns {{transclude: boolean, template: string, link: link}}
 */
// @ngInject
function actionBar($window) {
    return {
        transclude: true,
        template: `
                <div class="action-bar" layout-toggle-element>
                    <div class="alx-container-fluid" ng-transclude></div>
                </div>
            `,
        link: link
    };

    function link(scope, el) {
        const body = angular.element(document.body);
        const rootEl = angular.element(el.children()[0]);

        $window.addEventListener('scroll', handleResize);

        scope.$on('$destroy', () => {
            $window.removeEventListener('scroll', handleResize);
            body.removeClass('has-fixed-action-bar');
        });

        function handleResize() {
            if ($window.scrollY >= 42) {
                rootEl.addClass('fixed');
                body.addClass('has-fixed-action-bar');
            } else {
                rootEl.removeClass('fixed');
                body.removeClass('has-fixed-action-bar');
            }
        }
    }
}

export default actionBar;