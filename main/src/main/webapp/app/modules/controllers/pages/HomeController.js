/** The controller of the index page. */
// @ngInject
class HomeController {

    /**
     * Constructor
     * @param $state
     * @param SessionService
     */
    constructor($state, SessionService) {
        const user = SessionService.user.get();
        const project = SessionService.project.get();

        if (user !== null) {
            if (project !== null) {
                $state.go('dashboard');
            } else {
                $state.go('projects');
            }
        }
    }
}

export default HomeController;