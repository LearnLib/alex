import {AlphabetSymbol} from '../../../src/js/entities/alphabet-symbol';
import {Action} from '../../../src/js/entities/actions/action';

describe('AlphabetSymbol', () => {
    let ActionService;
    let symbol;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        ActionService = $injector.get('ActionService');
        symbol = new AlphabetSymbol(ENTITIES.symbols[0]);
    }));

    it('should count all enabled actions', () => {
        expect(symbol.countEnabledActions()).toBe(0);
        symbol.actions.push(new Action(null, {disabled: true}));
        symbol.actions.push(new Action(null, {disabled: false}));
        symbol.actions.push(new Action(null, {disabled: true}));
        expect(symbol.countEnabledActions()).toBe(1);
    });

    it('should get the representation of the symbol that is needed to export it', () => {
        const expected = {
            name: symbol.name,
            abbreviation: symbol.abbreviation,
            actions: symbol.actions
        };
        expect(symbol.getExportableSymbol()).toEqual(expected);
    });
});
