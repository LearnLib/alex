describe('Counter', () => {
    let Counter;

    beforeEach(module('ALEX'));
    beforeEach(inject((_Counter_) => {
        Counter = _Counter_;
    }));

    it('should correctly create a counter from given data', () => {
        const c = ENTITIES.counters[0];
        const counter = new Counter(c);
        expect(Object.keys(counter).length).toEqual(4);

        for (const prop in counter) {
            expect(counter[prop]).toEqual(c[prop]);
        }
    });
});