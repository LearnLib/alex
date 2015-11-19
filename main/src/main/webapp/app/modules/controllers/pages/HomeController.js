/** The controller of the index page. */
// @ngInject
class HomeController {

    /**
     * Constructor
     * @param $state
     * @param SessionService
     */
    constructor($state, SessionService) {
        this.user = SessionService.user.get();
        this.project = SessionService.project.get();

        if (this.user !== null) {
            if (this.project !== null) {
                $state.go('dashboard');
            } else {
                $state.go('projects');
            }
        }
    }
}

export default HomeController;