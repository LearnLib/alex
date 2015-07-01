angular
    .module('ALEX')
    .factory('CounterMockData', CounterMockData)
    .run(run);

CounterMockData.$inject = ['_'];
run.$inject = ['$httpBackend', 'CounterMockData', 'paths', '_'];

function run($httpBackend, CounterMockData, paths, _) {
    var endpoint = paths.api.URL + '/projects/[0-9]+/counters';

    // get all counters
    $httpBackend.whenGET(new RegExp(endpoint + '$'))
        .respond(function (method, url, params) {
            return [200, CounterMockData.getAll()];
        });

    // delete a single counter
    $httpBackend.whenDELETE(new RegExp(endpoint + '/[a-z0-9]+$'))
        .respond(function (method, url, data) {
            var counterName = _.rest(url.match(endpoint + '/([a-z0-9]+)'))[0];
            var counter = CounterMockData.getByName(counterName);
            if (counter) {
                return [204];
            } else {
                return [404, {
                    message: 'Failed'
                }];
            }
        });

    // delete multiple counters
    $httpBackend.whenDELETE(new RegExp(endpoint + '/batch/[a-z0-9,]+'))
        .respond(function (method, url, data) {
            var counterNames = _.rest(url.match(endpoint + '/batch/([a-z0-9,]+)'))[0].split(',');
            var counters = CounterMockData.getByNames(counterNames);
            if (counters) {
                return [204];
            } else {
                return [404, {
                    message: 'Failed'
                }];
            }
        });
}

function CounterMockData(_) {
    var counters = [
        {name: 'i', value: 0, project: 1},
        {name: 'j', value: 10, project: 1},
        {name: 'k', value: 100, project: 1}
    ];

    return {
        getAll: function () {
            return counters;
        },

        getByName: function (name) {
            return _.findWhere(counters, {name: name});
        },

        getByNames: function (names) {
            var cs = [];
            for (var i = 0; i < names.length; i++) {
                var counter = _.findWhere(counters, {name: names[i]});
                if (counter) {
                    cs.push(counter);
                } else {
                    return null;
                }
            }
            return cs;
        }
    }
}