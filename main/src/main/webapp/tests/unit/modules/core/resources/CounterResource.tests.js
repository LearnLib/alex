describe('CounterResource', function () {

    var CounterResource;
    var $httpBackend;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.module('ALEX.core'));

    beforeEach(angular.mock.inject(function (_$httpBackend_, _CounterResource_) {
        CounterResource = _CounterResource_;
        $httpBackend = _$httpBackend_;
    }));

    it('should make a GET request to /project/:projectId/counters and return a promise with a list of all counters',
        function () {
            var counters;
            var promise = CounterResource.getAll(1);
            expect(angular.isFunction(promise.then)).toBeTruthy();
            promise.then(function (c) {
                counters = c;
            });
            $httpBackend.flush();
            expect(counters instanceof Array).toBeTruthy();
        });

    it('should make a DELETE request to /project/:projectId/counters/:counterName and return a promise',
        function () {
            var promise = CounterResource.delete(1, 'i');
            expect(angular.isFunction(promise.then)).toBeTruthy();
            $httpBackend.flush();
            promise.then(function (c) {
                expect(c).toBeUndefined();
            })
        });

    it('should make a DELETE request to /project/:projectId/counters/batch/:counterNames and return a promise',
        function () {
            var promise = CounterResource.deleteSome(1, ['i', 'j']);
            expect(angular.isFunction(promise.then)).toBeTruthy();
            $httpBackend.flush();
            promise.then(function (c) {
                expect(c).toBeUndefined();
            })
        })
});