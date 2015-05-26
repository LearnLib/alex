describe('LearnerService', function () {

    var $httpBackend,
        paths,
        LearnerService,
        LearnConfiguration,
        LearnResult,
        Project;

    var startRequestHandler,
        stopRequestHandler,
        resumeRequestHandler,
        getStatusRequestHandler,
        isActiveRequestHandler,
        isCounterexampleRequestHandler;

    var url,
        testNo,
        project,
        config,
        result;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_$httpBackend_, _paths_, _LearnerService_, _Project_, _LearnResult_,
                                             _LearnConfiguration_) {
        $httpBackend = _$httpBackend_;
        paths = _paths_;
        LearnerService = _LearnerService_;
        LearnConfiguration = _LearnConfiguration_;
        Project = _Project_;
        LearnResult = _LearnResult_;

        url = paths.api.URL + '/learner';
        testNo = 1;
        project = new Project('testProject', 'http://localhost:8080');
        project.id = 1;
        config = new LearnConfiguration();
        config.symbols = [{id: 1, revision: 1}, {id: 2, revision: 1}];
        config.resetSymbol = {id: 1, revision: 1};
        result = TestDataProvider.learnResults[0];

        startRequestHandler = $httpBackend
            .when('POST', url + '/start/' + project.id);
        resumeRequestHandler = $httpBackend
            .when('POST', url + '/resume/' + project.id + '/' + testNo);
        stopRequestHandler = $httpBackend
            .when('GET', url + '/stop');
        getStatusRequestHandler = $httpBackend
            .when('GET', url + '/status');
        isActiveRequestHandler = $httpBackend
            .when('GET', url + '/active');
        isCounterexampleRequestHandler = $httpBackend
            .when('POST', url + '/outputs/' + project.id);
    }));

    it('should start a new learning process and return a promise',
        function () {
            var promise;
            startRequestHandler.respond(200, {});
            $httpBackend.expectPOST(url + '/start/' + project.id);
            promise = LearnerService.start(project.id, config);
            $httpBackend.flush();

            expect(promise.success).toBeDefined();
        });

    it('should stop a learning process',
        function () {
            var promise;
            stopRequestHandler.respond(200, {});
            $httpBackend.expectGET(url + '/stop');
            promise = LearnerService.stop();
            $httpBackend.flush();

            expect(promise.success).toBeDefined();
        });

    it('should resume a learning process',
        function () {
        });

    it('should read the status of a learning process and return a LearnResult on 200',
        function () {
            var promise;
            getStatusRequestHandler.respond(200, result);
            $httpBackend.expectGET(url + '/status');
            promise = LearnerService.getStatus();
            $httpBackend.flush();

            expect(promise.then).toBeDefined();
            promise.then(function(r){
                expect(r instanceof LearnResult).toBeTruthy();
            })
        });

    it('should read the status of a learning process and return null on 404',
        function () {
            var promise;
            getStatusRequestHandler.respond(404, {});
            $httpBackend.expectGET(url + '/status');
            promise = LearnerService.getStatus();
            $httpBackend.flush();

            expect(promise.then).toBeDefined();
            promise.then(function(r){
                expect(r).toBeNull();
            })
        });

    it('should check if a learning process is active',
        function () {
            var promise;
            isActiveRequestHandler.respond(200, {active: true});
            $httpBackend.expectGET(url + '/active');
            promise = LearnerService.isActive();
            $httpBackend.flush();

            expect(promise.then).toBeDefined();
            promise.then(function(data){
                expect(data.active).toBeDefined();
            })
        });

    it('should check if a word is a counterexample',
        function () {
        });
});