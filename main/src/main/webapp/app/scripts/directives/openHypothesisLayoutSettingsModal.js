(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openHypothesisLayoutSettingsModal', openHypothesisLayoutSettingsModal);

    openHypothesisLayoutSettingsModal.$inject = ['$modal', 'paths'];

    function openHypothesisLayoutSettingsModal($modal, paths) {

        var directive = {
            scope: {
                layoutSettings: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            //////////

            function handleModal() {

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/hypothesis-layout-settings-modal.html',
                    controller: 'HypothesisLayoutSettingsController',
                    resolve: {
                        modalData: function () {
                            return {
                                layoutSettings: scope.layoutSettings
                            }
                        }
                    }
                });

                modal.result.then(function (layoutSettings) {
                    scope.layoutSettings = layoutSettings
                })
            }
        }
    }
}());