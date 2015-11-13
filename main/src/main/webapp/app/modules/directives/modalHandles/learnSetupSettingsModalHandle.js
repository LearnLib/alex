import LearnConfiguration from '../../entities/LearnConfiguration';

/**
 * The directive that handles the opening of the modal dialog for manipulating a learn configuration. Can only be
 * used as an attribute and attaches a click event to the source element that opens the modal.
 *
 * Attribute 'learnConfiguration' should be the model with a LearnConfiguration object instance.
 *
 * @param $modal - The ui.boostrap $modal service
 * @returns {{restrict: string, scope: {learnConfiguration: string}, link: link}}
 */
// @ngInject
function learnSetupSettingsModalHandle($modal) {
    return {
        restrict: 'A',
        scope: {
            learnConfiguration: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/learn-setup-settings-modal.html',
                controller: 'LearnSetupSettingsModalController',
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {
                            learnConfiguration: new LearnConfiguration(scope.learnConfiguration)
                        };
                    }
                }
            });
        });
    }
}

export default learnSetupSettingsModalHandle;