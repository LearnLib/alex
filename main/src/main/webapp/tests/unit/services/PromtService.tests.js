(function(){
    'use strict';

    describe('PromptService', function(){
        var service;

        beforeEach(angular.mock.module('ALEX'));
        beforeEach(angular.mock.module('ALEX.services'));

        beforeEach(angular.mock.inject(function (_PromptService_) {
            service = _PromptService_;
        }));

        it('should return a promise object on prompt', function(){
            expect(service.prompt('test', 'qweqweqwe').then).toBeDefined();
        });

        it('should return a promise object on confirm', function(){
            expect(service.confirm('test').then).toBeDefined();
        })
    })
}());