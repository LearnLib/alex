describe('CountersController', function () {
    var $rootScope, $scope, $httpBackend, SessionService, ProjectMockData, _;
    var createController;
    var project;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $scope = $rootScope.$new();
        SessionService = $injector.get('SessionService');
        ProjectMockData = $injector.get('ProjectMockData');
        _ = $injector.get('_');

        project = ProjectMockData.getById(1);

        createController = function () {
            $injector.get('$controller')('CountersController', {
                $scope: $scope
            });
        }
    }));

    beforeEach(function () {
        SessionService.project.save(project);
        createController();
        $httpBackend.flush();
    });

    afterEach(function () {
        SessionService.project.remove();
    });

    it('should initialize the controller by fetching all counters from the server', function () {
        expect($scope.counters.length > 0).toBeTruthy();
        expect($scope.selectedCounters.length).toBe(0);
    });

    it('should delete a single counter from the scope', function () {
        var length = $scope.counters.length;
        var counter = $scope.counters[1];
        $scope.deleteCounter(counter);
        $httpBackend.flush();

        expect($scope.counters.length).toBe(length - 1);
        expect(_.findWhere($scope.counters, {name: counter.name})).toBeUndefined();
    });

    it('should fail to delete a single counter from the scope', function () {
        var counters = $scope.counters;
        $scope.deleteCounter({name: 'nonExistentCounter'});
        $httpBackend.flush();

        expect($scope.counters).toEqual(counters);
    });

    it('should delete multiple selected counters from the scope', function () {
        $scope.counters[0]._selected = true;
        $scope.counters[1]._selected = true;

        $scope.selectedCounters.push($scope.counters[0]);
        $scope.selectedCounters.push($scope.counters[1]);

        var length = $scope.counters.length;
        var counters = angular.copy($scope.counters);
        $scope.deleteSelectedCounters();
        $httpBackend.flush();

        expect($scope.counters.length).toBe(length - 2);
        expect(_.findWhere($scope.counters, {name: counters[0].name})).toBeUndefined();
        expect(_.findWhere($scope.counters, {name: counters[1].name})).toBeUndefined();
    });

    it('should fail to delete multiple selected counters from the scope', function () {
        $scope.counters[0]._selected = true;
        $scope.counters[1]._selected = true;
        $scope.counters[1].name = 'nonExistentCounter';

        $scope.selectedCounters.push($scope.counters[0]);
        $scope.selectedCounters.push($scope.counters[1]);

        var counters = angular.copy($scope.counters);
        $scope.deleteSelectedCounters();
        $httpBackend.flush();

        expect($scope.counters.length).toBe(3);
        expect($scope.counters).toEqual(counters);
    });
});