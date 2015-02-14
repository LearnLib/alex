(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('ResourceResponseService', [
            '$q', 'ngToast',
            ResourceResponseService
        ]);

    function ResourceResponseService($q, ngToast) {

        var service = {
            success: success,
            successWithToast: successWithToast,
            fail: fail,
            failWithoutToast: failWithoutToast,
            failWithToast: failWithToast
        };
        return service;

        //////////

        function success(response) {
            return response.data;
        }

        function successWithToast(response, message) {
            ngToast.create({
                class: 'success',
                content: message
            });
            return response.data;
        }

        function fail(response) {
            console.error(response.data);
            return failWithToast(response, response.data);
        }

        function failWithToast(response, message) {
            console.error(response.data);
            ngToast.create({
                class: 'danger',
                content: message,
                dismissButton: true
            });
            return $q.reject();
        }

        function failWithoutToast(response) {
            console.error(response.data);
            return $q.reject();
        }
    }
}());