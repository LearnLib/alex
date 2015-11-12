/** The controller of the prompt dialog */
// @ngInject
class PromptDialogController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     */
    constructor($modalInstance, modalData) {
        this.$modalInstance = $modalInstance;

        /** The model for the input field for the user input **/
        this.userInput = null;

        /** The text to be displayed **/
        this.text = modalData.text;

        /** The regex the user input has to match **/
        this.inputPattern = modalData.regexp || '';

        /** the message that is shown when the user input doesn't match the regex **/
        this.errorMsg = modalData.errorMsg || 'Unknown validation error';
    }

    /** Close the modal dialog and pass the user input */
    ok() {
        this.$modalInstance.close(this.userInput);
    }

    /** Close the modal dialog */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default PromptDialogController;