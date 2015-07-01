(function () {

    angular
        .module('ALEX')
        .factory('LearnerMockProperties', LearnerMockProperties)
        .run(run);

    run.$inject = ['$httpBackend', 'paths', 'LearnerMockProperties'];

    function run($httpBackend, paths, LearnerMockProperties) {
        var endpoint = paths.api.URL + '/learner/';

        // check if the learner is active
        $httpBackend.whenGET(new RegExp(endpoint + 'active/'))
            .respond(function (method, url, data) {
                if (LearnerMockProperties.active) {
                    return [200, {
                        "testNo": 1,
                        "active": true,
                        "project": 1
                    }]
                } else {
                    return [200, {
                        active: false
                    }]
                }
            });

        // get the current learner status object
        $httpBackend.whenGET(new RegExp(endpoint + 'status/'))
            .respond(function (method, url, data) {
            });

        // start a learning process with a project id start/:projectId
        $httpBackend.whenPOST(new RegExp(endpoint + 'start/[0-9]+/'))
            .respond(function (method, url, data) {
            });

        // stop the learning process
        $httpBackend.whenPOST(new RegExp(endpoint + 'stop/'))
            .respond(function (method, url, data) {
            });

        // resume the learning process resume/:projectId/:testNo
        $httpBackend.whenPOST(new RegExp(endpoint + 'resume/[0-9]+/[0-9]+/'))
            .respond(function (method, url, data) {
            });

        // read the outputs of an SUL outputs/:projectId
        $httpBackend.whenPOST(new RegExp(endpoint + 'outputs/[0-9]+/'))
            .respond(function (method, url, data) {
            });
    }

    function LearnerMockProperties() {
        var properties = {
            active: false
        };
        return properties;
    }
}());