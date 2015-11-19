/**
 * The components of the load screen
 */
// @ngInject
class LoadScreen {

    /**
     * Constructor
     * @param $scope
     * @param $http
     */
    constructor($scope, $http) {

        /**
         * If the load screen is visible or not
         * @type {boolean}
         */
        this.visible = false;

        // watch for pending http requests and make the load screen visible
        $scope.$watch(() => $http.pendingRequests.length > 0, value => {
            this.visible = value ? true : false;
        });
    }
}

// the component definition
const loadScreen = {
    bindings: {},
    controller: LoadScreen,
    controllerAs: 'loadScreen',
    template: `
        <div id="load-screen" ng-if="loadScreen.visible">
            <p class="text-center" id="load-screen-indicator">
                <i class="fa fa-spin fa-3x fa-circle-o-notch"></i>
            </p>
        </div>
    `
};

export default loadScreen;