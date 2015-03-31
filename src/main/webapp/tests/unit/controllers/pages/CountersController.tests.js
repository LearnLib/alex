(function(){
    'use strict';

    describe('CountersController', function(){
        var $scope, SessionService, Project, $httpBackend, paths, createController;

        var project = {
            id: 1
        };

        beforeEach(angular.mock.module('weblearner'));
        beforeEach(angular.mock.module('weblearner.controller'));

        beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _Project_, _SessionService_, _$httpBackend_, _paths_) {
            $scope = _$rootScope_.$new();
            SessionService = _SessionService_;
            Project = _Project_;
            $httpBackend = _$httpBackend_;
            paths = _paths_;

            $httpBackend.when('GET', paths.api.URL + '/projects/' + project.id + '/counters')
                .respond({test: 'asd'});

            createController = function(){
                return _$controller_('HomeController', {
                    $scope: $scope
                });
            }
        }));

        beforeEach(function(){
            SessionService.project.save(project);
        });

        afterEach(function(){
            SessionService.project.remove();
        });

        it('should do something', function(){
            $httpBackend.expectGET('GET', (paths.api.URL + '/projects/' + project.id + '/counters'));
            var controller = createController();
            $httpBackend.flush();
        })
    })
}());