/** The controller of the index page. */
// @ngInject
class HomeController {

    /**
     * Constructor
     * @param $state
     * @param SessionService
     */
    constructor($state, SessionService) {
        this.user = SessionService.getUser();
        this.project = SessionService.getProject();

        if (this.user !== null) {
            if (this.project !== null) {
                $state.go('projectsDashboard');
            } else {
                $state.go('projects');
            }
        }
    }
}

export default HomeController;