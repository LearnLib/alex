describe('SymbolGroup', function () {

    var Symbol,
        SymbolGroup;

    var groups;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));
    beforeEach(angular.mock.inject(function (_Symbol_, _SymbolGroup_) {
        Symbol = _Symbol_;
        SymbolGroup = _SymbolGroup_;

        groups = TestDataProvider.symbolGroups;
    }));

    it('should create a SymbolGroup', function () {
        var g = new SymbolGroup();
        expect(g.name).toBeNull();
        g = new SymbolGroup('groupName');
        expect(g.name).toEqual('groupName');
    });

    it('should create a SymbolGroup from an object representation', function () {
        var g = SymbolGroup.build(groups[0]);
        expect(typeof g.id).toEqual("number");
        expect(typeof g.project).toEqual("number");
        expect(g.symbols.length).toBeDefined();
        for (var i = 0, symbol = g.symbols[i]; i < g.symbols.length; i++) {
            expect(symbol instanceof Symbol).toBeTruthy();
        }
    });

    it('should create SymbolGroup instance[s] from an http response', function () {
        var response = {data: groups};
        var gs = SymbolGroup.transformApiResponse(response);
        expect(gs.length).toBe(groups.length);
        for (var i = 0, g = gs[i]; i < gs.length; i++) {
            expect(g instanceof SymbolGroup).toBeTruthy();
            for (var j = 0, s = g.symbols[j]; j < g.symbols.length; j++) {
                expect(s.hidden).toBeFalsy();
            }
        }
        response.data = groups[0];
        gs = SymbolGroup.transformApiResponse(response);
        expect(gs instanceof SymbolGroup).toBeTruthy();
    });
});