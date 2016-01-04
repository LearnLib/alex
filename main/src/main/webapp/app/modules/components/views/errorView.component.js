/** The controller of the error page */
// @ngInject
class ErrorViewComponent {

    /**
     * Constructor
     * @param $state
     * @param ErrorService
     */
    constructor($state, ErrorService) {

        /**
         * The error message
         * @type{string|null}
         */
        this.errorMessage = null;

        const message = ErrorService.getErrorMessage();
        if (message !== null) {
            this.errorMessage = message;
        } else {
            $state.go('home');
        }
    }
}

export const errorViewComponent = {
    controller: ErrorViewComponent,
    controllerAs: 'vm',
    template: `
        <div class="alx-container">
            <div class="text-center alert-container">
                <div class="alert alert-danger">
                    <i class="fa fa-5x fa-warning"></i>
                    <h3>Something went wrong!</h3>
                    <p ng-bind="::vm.errorMessage"></p>
                </div>
            </div>
        </div>
    `
};