(function () {

    angular
        .module('weblearner.resources')
        .factory('SymbolGroupResource', Resource);

    Resource.$inject = ['$http', 'paths'];

    function Resource($http, paths) {

        function SymbolGroupResource() {

        }

        SymbolGroupResource.prototype.get = function (projectId, groupId, options) {
            var _this = this;
            var query = '';

            if (options && options.embedSymbols && options.embedSymbols === true) {
                query = '?embed=symbols';
            }

            return $http.get(paths.api.URL + '/projects/' + projectId + '/groups/' + groupId + query)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.getAll = function (projectId, options) {
            var _this = this;
            var query = '';

            if (options && options.embedSymbols && options.embedSymbols === true) {
                query = '?embed=symbols';
            }

            return $http.get(paths.api.URL + '/projects/' + projectId + '/groups' + query)
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        SymbolGroupResource.prototype.getSymbols = function (projectId, groupId) {
            var _this = this;

            $http.get(paths.api.URL + '/projects/' + projectId + '/groups/' + groupId + '/symbols')
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.create = function (projectId, group) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/groups', group)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.update = function (projectId, group) {
            var _this = this;

            return $http.put(paths.api.URL + '/projects/' + projectId + '/groups', group)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.delete = function (projectId, groupId) {
            var _this = this;

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/groups')
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.build = function (data) {
            return data;
        };

        SymbolGroupResource.prototype.buildSome = function (data) {
            return data;
        };

        return SymbolGroupResource;
    }
}());