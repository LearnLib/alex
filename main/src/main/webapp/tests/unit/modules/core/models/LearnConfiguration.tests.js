describe('Project', function () {

    var LearnConfiguration,
        EqOracle,
        learnAlgorithms,
        Symbol;

    var symbols,
        learnConfigs;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_LearnConfiguration_, _EqOracle_, _learnAlgorithms_, _Symbol_) {
        LearnConfiguration = _LearnConfiguration_;
        EqOracle = _EqOracle_;
        learnAlgorithms = _learnAlgorithms_;
        Symbol = _Symbol_;

        symbols = [
            angular.extend(new Symbol('s1', 's1'), {id: 1, revision: 1}),
            angular.extend(new Symbol('s2', 's2'), {id: 2, revision: 1})
        ];
        learnConfigs = TestDataProvider.learnConfigurations;
    }));

    it('should create a learning configuration', function () {
        var conf = new LearnConfiguration();
        expect(conf.eqOracle instanceof EqOracle.Random);
        expect(conf.algorithm).toEqual(learnAlgorithms.TTT);
    });

    it('should add a reset symbol', function () {
        var conf = new LearnConfiguration();
        expect(conf.resetSymbol).toBeNull();
        conf.setResetSymbol(symbols[0]);
        expect(conf.resetSymbol).toEqual({id: symbols[0].id, revision: symbols[0].revision});
    });

    it('should add a symbol to sigma', function () {
        var conf = new LearnConfiguration();
        expect(conf.symbols).toEqual([]);
        conf.addSymbol(symbols[0]);
        conf.addSymbol(symbols[1]);
        expect(conf.symbols.length).toBe(2);
        expect(conf.symbols).toEqual([
            {id: symbols[0].id, revision: symbols[0].revision},
            {id: symbols[1].id, revision: symbols[1].revision}
        ])
    });

    it('should build a learningConfiguration instance from an object', function () {
        var conf = LearnConfiguration.build(learnConfigs[0]);
        expect(conf instanceof LearnConfiguration).toBeTruthy();
    });

    it('create a learnResumeConfiguration from an existing learningConfiguration', function () {
        var conf = new LearnConfiguration();
        conf.toLearnResumeConfiguration();
        expect(conf.symbols).toBeUndefined();
        expect(conf.algorithm).toBeUndefined();
        expect(conf.resetSymbol).toBeUndefined();
        expect(conf.comment).toBeUndefined();
    });
});