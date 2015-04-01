(function () {
    'use strict';

    describe('SelectionService', function () {
        var SelectionService;
        var _;

        var case1;
        var case2;
        var case3;
        var case4;

        beforeEach(angular.mock.module('weblearner'));
        beforeEach(angular.mock.module('weblearner.services'));

        beforeEach(angular.mock.inject(function (_SelectionService_, ___) {
            SelectionService = _SelectionService_;
            _ = ___;

            case1 = [
                {id: 1, _selected: false},
                {id: 2, _selected: true},
                {id: 3, _selected: true}
            ];

            case2 = [
                {id: 1, _selected: false},
                {id: 2, _selected: false},
                {id: 3, _selected: false}
            ];

            case3 = [];

            case4 = {id: 4, _selected: true};
        }));

        it('should get all selected items from arrays', function () {
            expect(SelectionService.getSelected(case1).length).toBe(2)
            expect(SelectionService.getSelected(case2).length).toBe(0)
            expect(SelectionService.getSelected(case3).length).toBe(0)
        })

        it('should remove selection from all object of an array', function () {
            SelectionService.removeSelection(case1);
            SelectionService.removeSelection(case2);
            SelectionService.removeSelection(case3);
            SelectionService.removeSelection(case4);

            _.forEach(case1, function (c1) {
                expect(c1._selected).not.toBeDefined()
            })

            _.forEach(case2, function (c2) {
                expect(c2._selected).not.toBeDefined()
            })

            _.forEach(case3, function (c3) {
                expect(c3._selected).not.toBeDefined()
            })

            expect(case4._selected).not.toBeDefined()
        })

        it('should correctly check if an object is selected or not', function () {
            expect(SelectionService.isSelected(case4)).toBe(true);
            case4._selected = false;
            expect(SelectionService.isSelected(case4)).toBe(false);
            SelectionService.removeSelection(case4);
            expect(SelectionService.isSelected(case4)).toBe(false);
        })
    });
}());