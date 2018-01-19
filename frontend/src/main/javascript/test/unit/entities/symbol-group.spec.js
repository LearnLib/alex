import {SymbolGroup} from '../../../src/js/entities/symbol-group';
import {AlphabetSymbol} from '../../../src/js/entities/alphabet-symbol';

describe('SymbolGroup', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a new SymbolGroup from given data', () => {
        const g = ENTITIES.groups[0];
        const group = new SymbolGroup(g);

        expect(Object.keys(group).length).toEqual(5);

        group.symbols.forEach(s => expect(s instanceof AlphabetSymbol).toBe(true));
    })
});
