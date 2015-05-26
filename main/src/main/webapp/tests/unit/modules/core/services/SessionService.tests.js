describe('SessionService', function () {

    var $rootScope,
        Project,
        SessionService;

    var project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_$rootScope_, _Project_, _SessionService_) {

        $rootScope = _$rootScope_;
        Project = _Project_;
        SessionService = _SessionService_;

        project = new Project('Test', 'http://localhost:8080');
    }));

    afterEach(function () {
        sessionStorage.clear();
    });

    function saveProject() {
        SessionService.project.save(project);
    }

    it('should save a project in sessionStorage and emit an event',
        function () {
            var eventEmitted = false;
            $rootScope.$on("project.opened", function () {
                eventEmitted = true;
            });

            saveProject();
            expect(SessionService.project.get()).not.toBeNull();
            expect(SessionService.project.get() instanceof Project).toBeTruthy();
            expect(eventEmitted).toBe(true);
        });

    it('should remove the project the project from sessionStorage and emit an event',
        function () {
            var eventEmitted = false;
            $rootScope.$on("project.closed", function () {
                eventEmitted = true;
            });

            saveProject();
            SessionService.project.remove();
            expect(SessionService.project.get()).toBeNull();
            expect(eventEmitted).toBe(true);
        })
});