describe('EqOracleService', () => {
    let eqOracleType;
    let RandomEqOracle;
    let CompleteEqOracle;
    let SampleEqOracle;
    let WMethodEqOracle;
    let EqOracleService;

    beforeEach(module('ALEX'));
    beforeEach(inject((_eqOracleType_, _RandomEqOracle_, _CompleteEqOracle_, _SampleEqOracle_, _WMethodEqOracle_,
                       _EqOracleService_) => {

        eqOracleType = _eqOracleType_;
        RandomEqOracle = _RandomEqOracle_;
        CompleteEqOracle = _CompleteEqOracle_;
        SampleEqOracle = _SampleEqOracle_;
        WMethodEqOracle = _WMethodEqOracle_;
        EqOracleService = _EqOracleService_;
    }));

    it('should correctly create eq oracles from a given type', () => {
        expect(EqOracleService.createFromType(eqOracleType.RANDOM) instanceof RandomEqOracle);
        expect(EqOracleService.createFromType(eqOracleType.COMPLETE) instanceof CompleteEqOracle);
        expect(EqOracleService.createFromType(eqOracleType.SAMPLE) instanceof SampleEqOracle);
        expect(EqOracleService.createFromType(eqOracleType.WMETHOD) instanceof WMethodEqOracle);
    });

    it('should correctly create eq oracles from a given object', () => {
        const expectedRandom = ENTITIES.eqOracles.random;
        const expectedComplete = ENTITIES.eqOracles.complete;
        const expectedSample = ENTITIES.eqOracles.sample;
        const expectedWMethod = ENTITIES.eqOracles.wmethod;

        expect(angular.toJson(EqOracleService.create(expectedRandom))).toEqual(angular.toJson(expectedRandom));
        expect(angular.toJson(EqOracleService.create(expectedComplete))).toEqual(angular.toJson(expectedComplete));
        expect(angular.toJson(EqOracleService.create(expectedSample))).toEqual(angular.toJson(expectedSample));
        expect(angular.toJson(EqOracleService.create(expectedWMethod))).toEqual(angular.toJson(expectedWMethod));
    });

    it('should return null if it should create an oracle from an unknown type', () => {
        expect(EqOracleService.createFromType('unknownOracle')).toBeNull();
    });

    it('should return null if it should create an oracle from an unknown object', () => {
        expect(EqOracleService.create({type: 'unknownOracle'})).toBeNull();
    })
});