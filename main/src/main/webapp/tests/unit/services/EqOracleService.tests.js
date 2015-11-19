describe('EqOracleService', () => {
    let eqOracleType;
    let RandomEqOracle;
    let CompleteEqOracle;
    let SampleEqOracle;
    let WMethodEqOracle;

    beforeEach(module('AELX'));
    beforeEach(inject((_eqOracleType_, _RandomEqOracle_, _CompleteEqOracle_, _SampleEqOracle_, _WMethodEqOracle_) => {
        eqOracleType = _eqOracleType_;
        RandomEqOracle = _RandomEqOracle_;
        CompleteEqOracle = _CompleteEqOracle_;
        SampleEqOracle = _SampleEqOracle_;
        WMethodEqOracle = _WMethodEqOracle_;
    }))
});