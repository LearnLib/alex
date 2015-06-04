describe('LearnResult', function () {

    var LearnResult,
        LearnConfiguration;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_LearnResult_, _LearnConfiguration_) {
        LearnResult = _LearnResult_;
        LearnConfiguration = _LearnConfiguration_;
    }));

    it ('should create a LearnResult', function(){});

    it ('should create a LearnResult from an object representation', function(){});

    it ('should create LearnResult instance[s] from an http response', function(){});
});