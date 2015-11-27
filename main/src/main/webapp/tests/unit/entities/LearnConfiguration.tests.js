describe('LearnConfiguration', () => {
    let LearnConfiguration, Symbol;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        LearnConfiguration = $injector.get('LearnConfiguration');
        Symbol = $injector.get('Symbol');
    }));

    it('should correctly create a default config', () => {

        const config = new LearnConfiguration();
        const expectedConfig = {
            symbols: [],
            maxAmountOfStepsToLearn: 0,
            eqOracle: {type: 'random_word', minLength: 1, maxLength: 10, maxNoOfTests: 20},
            algorithm: 'TTT',
            resetSymbol: null,
            comment: null
        };

        expect(angular.toJson(config)).toEqual(angular.toJson(expectedConfig));
    });

    it('should correctly create a config from an object', () => {

        const expectedConfig = ENTITIES.learnConfigurations[0];
        const config = new LearnConfiguration(expectedConfig);

        expect(angular.toJson(config)).toEqual(angular.toJson(expectedConfig))
    });

    it('should add a symbol to the symbols list as id revision pair', () => {
        const config = new LearnConfiguration();
        const symbol = new Symbol(ENTITIES.symbols[0]);
        const pair = symbol.getIdRevisionPair();

        const pre = config.symbols.length;
        config.addSymbol(symbol);
        expect(config.symbols.length).toBe(pre + 1);
        expect(config.symbols.find(p => p.id === pair.id)).toEqual(pair);
    });

    it('should set a symbols as id revision pair as reset symbol', () => {
        const config = new LearnConfiguration();
        const symbol = new Symbol(ENTITIES.symbols[0]);
        const pair = symbol.getIdRevisionPair();

        config.setResetSymbol(symbol);
        expect(config.resetSymbol).toEqual(symbol.getIdRevisionPair())
    });

    it('should create a learn resume config from the config', () => {
        const config = new LearnConfiguration();
        const resumeConfig = {
            eqOracle: config.eqOracle,
            maxAmountOfStepsToLearn: config.maxAmountOfStepsToLearn
        };

        expect(config.getLearnResumeConfiguration()).toEqual(resumeConfig);
    });
});