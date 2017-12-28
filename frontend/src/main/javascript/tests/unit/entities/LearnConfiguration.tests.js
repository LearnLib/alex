import {AlphabetSymbol} from '../../../src/js/entities/AlphabetSymbol';
import {LearnConfiguration} from '../../../src/js/entities/LearnConfiguration';

describe('LearnConfiguration', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a default config', () => {

        const config = new LearnConfiguration();
        const expectedConfig = {
            symbols: [],
            maxAmountOfStepsToLearn: -1,
            eqOracle: {type: 'random_word', minLength: 1, maxLength: 10, maxNoOfTests: 20, seed: 42},
            algorithm: 'TTT',
            resetSymbol: null,
            comment: null,
            browser: 'htmlunitdriver'
        };

        expect(angular.toJson(config)).toEqual(angular.toJson(expectedConfig));
    });

    it('should correctly create a config from an object', () => {

        const expectedConfig = ENTITIES.learnConfigurations[0];
        const config = new LearnConfiguration(expectedConfig);

        expect(angular.toJson(config)).toEqual(angular.toJson(expectedConfig))
    });

    it('should add a symbol to the symbols list as id', () => {
        const config = new LearnConfiguration();
        const symbol = new AlphabetSymbol(ENTITIES.symbols[0]);

        const pre = config.symbols.length;
        config.addSymbol(symbol);
        expect(config.symbols.length).toBe(pre + 1);
        expect(config.symbols.find(p => p.id === symbol.id)).toEqual(symbol.id);
    });

    it('should set a symbols as id as reset symbol', () => {
        const config = new LearnConfiguration();
        const symbol = new AlphabetSymbol(ENTITIES.symbols[0]);

        config.setResetSymbol(symbol);
        expect(config.resetSymbol).toEqual(symbol.id)
    });
});