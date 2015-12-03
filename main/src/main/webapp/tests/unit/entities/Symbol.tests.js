describe('SymbolFormModel', () => {
    let SymbolFormModel;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        SymbolFormModel = $injector.get('SymbolFormModel');
    }));

    it('should correctly create a new SymbolFormModel', () => {
        const expected = {
            name: '',
            abbreviation: '',
            group: 0,
            actions: []
        };
        const model = new SymbolFormModel();

        expect(angular.toJson(model)).toEqual(angular.toJson(expected));
    })
});


describe('Symbol', () => {
    let Symbol, Action;
    let ActionService;
    let symbol;

    beforeEach(module('ALEX'));
    beforeEach(inject(($injector) => {
        Symbol = $injector.get('Symbol');
        ActionService = $injector.get('ActionService');
        symbol = new Symbol(ENTITIES.symbols[0]);
        Action = $injector.get('Action');
    }));

    it('should count all enabled actions', () => {
        expect(symbol.countEnabledActions()).toBe(0);
        symbol.actions.push(new Action(null, {disabled: true}));
        symbol.actions.push(new Action(null, {disabled: false}));
        symbol.actions.push(new Action(null, {disabled: true}));
        expect(symbol.countEnabledActions()).toBe(1);
    });

    it('should get the id revision pair of the symbol', () => {
        const expected = {
            id: symbol.id,
            revision: symbol.revision
        };
        expect(symbol.getIdRevisionPair()).toEqual(expected);
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