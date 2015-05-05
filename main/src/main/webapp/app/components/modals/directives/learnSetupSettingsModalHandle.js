(function () {
    'use strict';

    angular
        .module('ALEX.modals')
        .directive('learnSetupSettingsModalHandle', learnSetupSettingsModalHandle);

    learnSetupSettingsModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the opening of the modal dialog for manipulating a learn configuration. Can only be
     * used as an attribute and attaches a click event to the source element that opens the modal.
     *
     * Attribute 'learnConfiguration' should be the model with a LearnConfiguration object instance.
     * Attribute 'onOk' should be a callback function with one parameter where the modified config is passed.
     *
     * @param $modal - The ui.boostrap $modal service
     * @param paths - The applications path constant
     * @returns {{restrict: string, scope: {learnConfiguration: string, onOk: string}, link: link}}
     */
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
                    templateUrl: paths.COMPONENTS + '/modals/views/learn-setup-settings-modal.html',
                    controller: 'LearnSetupSettingsModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                learnConfiguration: scope.learnConfiguration
                            };
                        }
                    }
                });
                modal.result.then(function (learnConfiguration) {
                    if (angular.isDefined(scope.onOk)) {
                        scope.onOk()(learnConfiguration);
                    }
                });
            });
        }
    }
}());