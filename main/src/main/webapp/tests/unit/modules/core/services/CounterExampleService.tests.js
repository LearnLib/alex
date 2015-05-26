describe('CounterExampleService', function(){

    var CounterExampleService;

    var counterexample;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function(_CounterExampleService_){
        CounterExampleService = _CounterExampleService_;

        counterexample = [
            {input: 's1', output: 'OK'},
            {input: 's2', output: 'FAILED'}
        ];
    }));

    it ('should be initialized with an empty counterexample',
        function(){
            expect(CounterExampleService.getCurrentCounterexample()).toEqual([]);
        });

    it ('should correctly set a counterexample',
        function(){
            CounterExampleService.setCurrentCounterexample(counterexample);
            expect(CounterExampleService.getCurrentCounterexample()).toEqual(counterexample);
        });

    it ('should empty the current counterexample',
        function(){
            CounterExampleService.setCurrentCounterexample(counterexample);
            CounterExampleService.resetCurrentCounterexample();
            expect(CounterExampleService.getCurrentCounterexample()).toEqual([]);
        });

    it ('should add a symbol to the counterexample',
        function(){
            var length = CounterExampleService.getCurrentCounterexample().length;
            CounterExampleService.addIOPairToCurrentCounterexample('s3', 'OK');
            expect(CounterExampleService.getCurrentCounterexample().length).toBe(length + 1);
            expect(CounterExampleService.getCurrentCounterexample()[length]).toEqual({input: 's3', output: 'OK'});
        });
});