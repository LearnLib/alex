angular
    .module('ALEX')
    .factory('ProjectMockData', ProjectMockData)
    .run(run);

ProjectMockData.$inject = ['_'];
run.$inject = ['$httpBackend', 'ProjectMockData', 'paths', '_'];

function run($httpBackend, ProjectMockData, paths, _) {
    var endpoint = paths.api.URL + '/projects';

    // get all projects
    $httpBackend.whenGET(new RegExp(endpoint + '$'))
        .respond(function (method, url, data) {
            return [200, ProjectMockData.getAll()];
        });

    // get a single project
    $httpBackend.whenGET(new RegExp(endpoint + '/[0-9]+'))
        .respond(function (method, url, data) {
            var id = parseInt(_.rest(url.match(endpoint + '/([0-9]+)'))[0]);
            var project = ProjectMockData.getById(id);
            if (project) {
                return [200, project]
            } else {
                return [404, {message: 'Failed'}]
            }
        });

    // create a new project
    $httpBackend.whenPOST(new RegExp(endpoint + '$'))
        .respond(function (method, url, data) {
            var newProject = angular.fromJson(data);
            var p = ProjectMockData.getByName(newProject.name);
            if (p) {
                return [400, {message: 'not created'}];
            } else {
                return [201, angular.extend(newProject, {id: 3})];
            }
        });

    // update a project
    $httpBackend.whenPUT(new RegExp(endpoint + '/[0-9]+'))
        .respond(function (method, url, data) {
            var updatedProject = angular.fromJson(data);
            var p = ProjectMockData.getById(updatedProject.id);
            if (p) {
                return [200, updatedProject];
            } else {
                return [400, {message: 'not updated'}]
            }
        });

    // delete a project
    $httpBackend.whenDELETE(new RegExp(endpoint + '/[0-9]+'))
        .respond(function (method, url, data) {
            var id = parseInt(_.rest(url.match(endpoint + '/([0-9]+)'))[0]);
            var project = ProjectMockData.getById(id);
            if (project) {
                return [204, {}];
            } else {
                return [404, {message: 'notFound'}]
            }
        });
}

function ProjectMockData(_) {
    var projects = [
        {
            name: 'Project1',
            baseUrl: 'http://localhost:8080',
            description: null,
            id: 1
        },
        {
            name: 'Project2',
            baseUrl: 'http://localhost:8080',
            description: null,
            id: 2
        }
    ];

    return {
        getAll: function () {
            return projects;
        },

        getById: function (id) {
            return _.findWhere(projects, {id: id});
        },

        getByName: function (name) {
            return _.findWhere(projects, {name: name})
        }
    }
}