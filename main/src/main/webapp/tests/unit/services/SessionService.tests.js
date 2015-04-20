(function () {
    'use strict';

    describe('SessionService', function () {

        // mocks
        var SessionService;
        var Project;
        var $rootScope;

        // variables
        var project;

        beforeEach(angular.mock.module('ALEX'));
        beforeEach(angular.mock.module('ALEX.services'));

        beforeEach(angular.mock.inject(function (_$rootScope_, _Project_, _SessionService_) {
            Project = _Project_;
            SessionService = _SessionService_;
            $rootScope = _$rootScope_;
            project = new Project('Test', 'http://localhost:8080')
        }));

        afterEach(function () {
            sessionStorage.clear();
        });

        it('should get no project from storage', function () {
            expect(SessionService.project.get()).toBeNull();
        });

        it('should save a project in sessionStorage and emit event project.opened after storing', function () {
            var eventEmitted = false;
            $rootScope.$on("project.opened", function () {
                eventEmitted = true;
            });

            SessionService.project.save(project);
            expect(SessionService.project.get()).not.toBeNull();
            expect(eventEmitted).toBe(true);
        });

        it('should get a Project instance from session storage after storing', function () {
            SessionService.project.save(project);
            expect(SessionService.project.get() instanceof Project).toBe(true);
        })

        it('should remove a project from session storage emit event project.closed', function () {
            var eventEmitted = false;
            $rootScope.$on("project.closed", function () {
                eventEmitted = true;
            });

            SessionService.project.save(project);
            SessionService.project.remove();
            expect(SessionService.project.get()).toBeNull();
            expect(eventEmitted).toBe(true);
        })
    });
}());