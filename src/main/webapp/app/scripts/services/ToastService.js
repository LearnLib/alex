(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .service('ToastService', ToastService);

    ToastService.$inject = ['ngToast'];

    function ToastService(ngToast) {

        return {
            success: success,
            danger: danger,
            info: info
        };

        function success(message) {
            ngToast.create({
                class: 'success',
                content: message,
                dismissButton: true
            });
        }

        function danger(message) {
            ngToast.create({
                class: 'danger',
                content: message,
                dismissButton: true
            });
        }

        function info(message) {
            ngToast.create({
                class: 'info',
                content: message,
                dismissButton: true
            });
        }
    }
}());