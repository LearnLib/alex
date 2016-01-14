import Counter from '../../../app/modules/entities/Counter';

describe('Counter', () => {
    beforeEach(angular.mock.module('ALEX'));

    it('should correctly create a counter from given data', () => {
        const c = ENTITIES.counters[0];
        const counter = new Counter(c);
        expect(Object.keys(counter).length).toEqual(4);

        for (const prop in counter) {
            expect(counter[prop]).toEqual(c[prop]);
        }
    });
});