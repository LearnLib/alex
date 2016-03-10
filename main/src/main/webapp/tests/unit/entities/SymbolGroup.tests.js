import {SymbolGroup, SymbolGroupFormModel} from '../../../src/js/entities/SymbolGroup';
import {Symbol} from '../../../src/js/entities/Symbol';

describe('SymbolGroupFormModel', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a new SymbolGroupFormModel', () => {
        let group = new SymbolGroupFormModel();
        expect(Object.keys(group).length).toEqual(1);
        expect(group.name).toEqual('');

        group = new SymbolGroupFormModel('newGroup');
        expect(Object.keys(group).length).toEqual(1);
        expect(group.name).toEqual('newGroup');
    });
});

describe('SymbolGroup', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a new SymbolGroup from given data', () => {
        const g = ENTITIES.groups[0];
        const group = new SymbolGroup(g);

        expect(Object.keys(group).length).toEqual(5);

        group.symbols.forEach(s => expect(s instanceof Symbol).toBe(true));
    })
});