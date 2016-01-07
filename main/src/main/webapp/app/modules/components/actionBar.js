/**
 * The component that is used for the sticky sub navigation that mostly contains call to action buttons for the
 * current view
 *
 * Use: '<action-bar></action-bar>'
 */
// @ngInject
class ActionBar {

    /**
     * Constructor
     * @param $scope
     * @param $window
     * @param $element
     */
    constructor($scope, $window, $element) {
        this.$window = $window;

        /** The document.body */
        this.body = angular.element(document.body);

        /** The root element of the component **/
        this.rootEl = angular.element($element.children()[0]);

        $window.addEventListener('scroll', this.handleResize.bind(this));

        $scope.$on('$destroy', () => {
            $window.removeEventListener('scroll', this.handleResize.bind(this));
            this.body.removeClass('has-fixed-action-bar');
        });
    }

    /** Depending on the scroll y value, toggles classes for fixing the action bar on the top */
    handleResize() {
        if (this.$window.scrollY >= 42) {
            this.rootEl.addClass('fixed');
            this.body.addClass('has-fixed-action-bar');
        } else {
            this.rootEl.removeClass('fixed');
            this.body.removeClass('has-fixed-action-bar');
        }
    }
}

export const actionBar = {
    controller: ActionBar,
    template: `
        <div class="action-bar">
            <div class="alx-container-fluid" ng-transclude></div>
        </div>
    `
};