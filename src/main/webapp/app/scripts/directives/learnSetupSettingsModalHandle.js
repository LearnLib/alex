(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('learnSetupSettingsModalHandle', learnSetupSettingsModalHandle);

    learnSetupSettingsModalHandle.$inject = ['$modal', 'paths'];

    function learnSetupSettingsModalHandle($modal, paths) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                learnConfiguration: '=',
                onOk: '&'
            },
            link: link
        };

        // the directives behaviour
        function link(scope, el, attr) {
            el.on('click', function () {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/learn-setup-settings-modal.html',
                    controller: 'LearnSetupSettingsModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                learnConfiguration: scope.learnConfiguration
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (learnConfiguration) {
                    scope.onOk()(learnConfiguration);
                });
            });
        }
    }
}());