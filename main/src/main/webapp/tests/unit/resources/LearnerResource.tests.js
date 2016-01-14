describe('LearnerResource', () => {
    const testNo = 1;

    let $http;
    let $httpBackend;
    let LearnerResource;
    let project;
    let config;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {

        $http = $injector.get('$http');
        $httpBackend = $injector.get('$httpBackend');
        LearnerResource = $injector.get('LearnerResource');

        project = ENTITIES.projects[0];
        config = ENTITIES.learnConfigurations[0];
    }));

    it('should correctly initialize the resource', () => {
        expect(LearnerResource.$http).toEqual($http);
    });

    it('should start a learn process', () => {
        spyOn($http, 'post').and.callThrough();
        const uri = `/rest/learner/start/${project.id}`;

        $httpBackend.whenPOST(uri).respond(200, {});
        const promise = LearnerResource.start(project.id, config);
        $httpBackend.flush();

        expect($http.post).toHaveBeenCalledWith(uri, config);
        expect(promise.then).toBeDefined();
    });

    it('should stop a learn process', () => {
        spyOn($http, 'get').and.callThrough();
        const uri = `/rest/learner/stop`;

        $httpBackend.whenGET(uri).respond(200, {});
        const promise = LearnerResource.stop();
        $httpBackend.flush();

        expect($http.get).toHaveBeenCalledWith(uri);
        expect(promise.then).toBeDefined();
    });

    it('should resume a learn process', () => {
        spyOn($http, 'post').and.callThrough();
        const uri = `/rest/learner/resume/${project.id}/${testNo}`;

        $httpBackend.whenPOST(uri).respond(200, {});
        const promise = LearnerResource.resume(project.id, testNo, config);
        $httpBackend.flush();

        expect($http.post).toHaveBeenCalledWith(uri, config);
        expect(promise.then).toBeDefined();
    });

    it('should get the current status of the learner', () => {
        // TODO
    });

    it('should check if the learner is active', () => {
        spyOn($http, 'get').and.callThrough();
        const uri = `/rest/learner/active`;

        $httpBackend.whenGET(uri).respond(200, {});
        const promise = LearnerResource.isActive();
        $httpBackend.flush();

        expect($http.get).toHaveBeenCalledWith(uri);
        expect(promise.then).toBeDefined();
    });

    it('should check if a given sequence is a counterexample', () => {
        // TODO
    });
});