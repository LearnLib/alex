/**
 * The controller that is used to display the details of a learn result in a modal dialog. The data that is passed
 * to this controller should be an object with a property 'result' which contains a learn result object. If none is
 * given, nothing will be displayed.
 *
 * @constructor
 */
// @ngInject
class LearnResultDetailsModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param LearnResultResource
     */
    constructor($modalInstance, modalData, LearnResultResource) {
        this.$modalInstance = $modalInstance;

        /**
         * The data of the tabs that are displayed
         * @type {*[]}
         */
        this.tabs = [
            {heading: 'Current', result: modalData.result}
        ];

        if (modalData.result.stepNo > 0) {
            LearnResultResource.getFinal(modalData.result.project, modalData.result.testNo)
                .then(res => {
                    this.tabs.push({
                        heading: 'Cumulated',
                        result: res
                    });
                });
        } else {
            this.tabs[0].heading = 'Cumulated';
        }
    }

    /** Close the modal window  */
    ok() {
        this.$modalInstance.dismiss();
    }
}

export default LearnResultDetailsModalController;