/** The controller that handles the confirm modal dialog. */
// @ngInject
class ConfirmDialogController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     */
    constructor($modalInstance, modalData) {
        this.$modalInstance = $modalInstance;

        /**
         * The text to display
         * @type {string}
         */
        this.text = modalData.text || null;
    }

    /** Close the modal dialog */
    ok() {
        this.$modalInstance.close();
    }

    /** Close the modal dialog */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default ConfirmDialogController;