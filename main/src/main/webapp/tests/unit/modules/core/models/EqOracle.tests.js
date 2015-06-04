describe('EqOracle', function () {

    var EqOracle;

    var eq1, eq2, eq3, eq4;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_EqOracle_) {
        EqOracle = _EqOracle_;

        eq1 = {type: EqOracle.types.RANDOM, minLength: 2, maxLength: 5, maxNoOfTests: 10};
        eq2 = {type: EqOracle.types.COMPLETE, minDepth: 2, maxDepth: 5};
        eq3 = {type: EqOracle.types.SAMPLE, counterExamples: [{input: 's1', output: 'OK'}]};
        eq4 = {type: 'someString'};
    }));

    it('should create a sample eq oracle', function () {
        var eq = new EqOracle.Sample();
        expect(eq.counterExamples).toEqual([]);

        eq = new EqOracle.Sample([{input: '', output: ''}]);
        expect(eq.counterExamples.length).toBe(1);
    });

    it('should create a complete eq oracle', function () {
        var eq = new EqOracle.Complete();
        expect(eq.maxDepth).toBe(1);
        expect(eq.minDepth).toBe(1);

        eq = new EqOracle.Complete(2, 5);
        expect(eq.maxDepth).toBe(5);
        expect(eq.minDepth).toBe(2);

        eq = new EqOracle.Complete(0, -5);
        expect(eq.maxDepth).toBe(1);
        expect(eq.minDepth).toBe(1);
    });

    it('should create a random eq oracle', function () {
        var eq = new EqOracle.Random();
        expect(eq.minLength).toBe(1);
        expect(eq.maxLength).toBe(1);
        expect(eq.maxNoOfTests).toBe(1);

        eq = new EqOracle.Random(2, 5, 10);
        expect(eq.minLength).toBe(2);
        expect(eq.maxLength).toBe(5);
        expect(eq.maxNoOfTests).toBe(10);

        eq = new EqOracle.Random(0, -5, null);
        expect(eq.minLength).toBe(1);
        expect(eq.maxLength).toBe(1);
        expect(eq.maxNoOfTests).toBe(1);
    });

    it('should create an instance of an eq oracle from an object', function () {
        expect(EqOracle.build(eq1) instanceof EqOracle.Random).toBeTruthy();
        expect(EqOracle.build(eq2) instanceof EqOracle.Complete).toBeTruthy();
        expect(EqOracle.build(eq3) instanceof EqOracle.Sample).toBeTruthy();
        expect(EqOracle.build(eq4)).toBeNull();
    });

    it('should create an instance of an eq oracle from an string type', function () {
        var eq1 = EqOracle.build(EqOracle.types.COMPLETE);
        var eq2 = EqOracle.build(EqOracle.types.RANDOM);
        var eq3 = EqOracle.build(EqOracle.types.SAMPLE);
        var eq4 = EqOracle.build('someString');

        expect(eq1 instanceof EqOracle.Complete).toBeTruthy();
        expect(eq2 instanceof EqOracle.Random).toBeTruthy();
        expect(eq3 instanceof EqOracle.Sample).toBeTruthy();
        expect(eq4).toBeNull();
    });
});