/** The service for handling promt and confirm dialogs */
// @ngInject
class PromptService {

    /**
     * Constructor
     * @param $modal
     */
    constructor($modal) {
        this.$modal = $modal;
    }

    /**
     * Opens the prompt dialog.
     *
     * @param {string} text - The text to display
     * @param {{regexp: string, errorMsg: string}} options}
     * @return {*} - The modal result promise
     */
    prompt(text, options) {
        return this.$modal.open({
            templateUrl: 'views/modals/prompt-dialog.html',
            controller: 'PromptDialogController',
            controllerAs: 'vm',
            resolve: {
                modalData: function () {
                    return {
                        text: text,
                        regexp: options.regexp,
                        errorMsg: options.errorMsg
                    };
                }
            }
        }).result;
    }

    /**
     * Opens the confirm dialog
     *
     * @param {string} text - The text to be displayed in the confirm dialog
     * @returns {*} - The modal result promise
     */
    confirm(text) {
        return this.$modal.open({
            templateUrl: 'views/modals/confirm-dialog.html',
            controller: 'ConfirmDialogController',
            controllerAs: 'vm',
            resolve: {
                modalData: function () {
                    return {text: text};
                }
            }
        }).result;
    }
}

export default PromptService;