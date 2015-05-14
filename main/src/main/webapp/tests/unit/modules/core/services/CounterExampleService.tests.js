(function () {
    'use strict';

    describe('CounterExampleService', function () {
        var service;

        var counterexample = [
            {input: 'a', output: 'b'},
            {input: 'c', output: 'd'}
        ];

        beforeEach(angular.mock.module('ALEX'));
        beforeEach(angular.mock.module('ALEX.services'));

        beforeEach(angular.mock.inject(function (_CounterExampleService_) {
            service = _CounterExampleService_;
        }));

        it('should start with an empty counterexample', function(){
            expect(service.getCurrentCounterexample()).toEqual([]);
        });

        it('should set a counterexample', function(){
            service.setCurrentCounterexample(counterexample);
            expect(service.getCurrentCounterexample().length).toBe(2);
        });

        it('should remove all pairs from the counterexample', function(){
            service.setCurrentCounterexample(counterexample);
            service.resetCurrentCounterexample();
            expect(service.getCurrentCounterexample().length).toBe(0)
        });

        it('should add input output pairs to the counter example', function(){
            var length = service.getCurrentCounterexample().length;
            var ce;

            service.addIOPairToCurrentCounterexample('e', 'f');
            ce = service.getCurrentCounterexample();

            expect(ce.length).toBe(length + 1);
            expect(ce[length].input).toBe('e');
            expect(ce[length].output).toBe('f');
        })
    })
}());