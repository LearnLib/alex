angular
    .module('ALEX')
    .factory('FilesMockData', FilesMockData)
    .run(run);

run.$inject = ['$httpBackend', 'paths', 'FilesMockData', '_'];
FilesMockData.$inject = ['_'];

function run($httpBackend, paths, FilesMockData, _) {
    var endpoint = paths.api.URL + '/projects/[0-9]+/files';

    // get all files
    $httpBackend.whenGET(new RegExp(endpoint + '$'))
        .respond(function (method, url, data) {
            return [200, FilesMockData.getAll()];
        });

    // upload a file
    $httpBackend.whenPOST(new RegExp(endpoint + '$'))
        .respond(function (method, url, data) {
            console.log(data);
        });

    // delete a file
    $httpBackend.whenDELETE(new RegExp(endpoint + '.*?$'))
        .respond(function (method, url, data) {
            var name = _.rest(url.match(endpoint + '(.*?)$'))[0];
            if (FilesMockData.exists(name)) {
                return [204, {}];
            } else {
                return [404, {
                    "message": "Could not find the file in the project.",
                    "statusCode": 404,
                    "statusText": "Not Found"
                }]
            }
        });
}

function FilesMockData(_) {
    var files = [
        {"name": "file1", "project": 1},
        {"name": "file2", "project": 1},
        {"name": "file3", "project": 1}
    ];

    return {
        getAll: function () {
            return files;
        },
        exists: function (name) {
            return _.findWhere(files, {name: name}) ? true : false;
        }
    }
}