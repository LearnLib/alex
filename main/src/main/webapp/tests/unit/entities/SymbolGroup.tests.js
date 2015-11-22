describe('SymbolGroupFormModel', () => {
    let SymbolGroupFormModel;

    beforeEach(module('ALEX'));
    beforeEach(inject((_SymbolGroupFormModel_) => {
        SymbolGroupFormModel = _SymbolGroupFormModel_;
    }));

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
    let SymbolGroup;
    let Symbol;

    beforeEach(module('ALEX'));
    beforeEach(inject((_SymbolGroup_, _Symbol_) => {
        SymbolGroup = _SymbolGroup_;
        Symbol = _Symbol_;
    }));

    it('should correctly create a new SymbolGroup from given data', () => {
        const g = ENTITIES.groups[0];
        const group = new SymbolGroup(g);

        expect(Object.keys(group).length).toEqual(5);

        group.symbols.forEach(s => expect(s instanceof Symbol).toBe(true));
    })
});