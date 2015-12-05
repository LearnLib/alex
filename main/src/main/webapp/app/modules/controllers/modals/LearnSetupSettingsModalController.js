import {events, webBrowser, learnAlgorithm, eqOracleType} from '../../constants';
import LearnConfiguration from '../../entities/LearnConfiguration';

/**
 * The controller for the modal dialog where you can set the settings for an upcoming test run.
 * Passes the edited instance of a LearnConfiguration on success.
 */
// @ngInject
class LearnSetupSettingsModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param ToastService
     * @param EventBus
     * @param EqOracleService
     */
    constructor($modalInstance, modalData, ToastService, EventBus, EqOracleService) {
        this.$modalInstance = $modalInstance;
        this.ToastService = ToastService;
        this.EventBus = EventBus;
        this.EqOracleService = EqOracleService;

        /** The constants for eqOracles types */
        this.eqOracles = eqOracleType;

        /**
         * The model for the select input that holds a type for an eqOracle
         * @type {string}
         */
        this.selectedEqOracle = modalData.learnConfiguration.eqOracle.type;

        /**
         * The constants for learnAlgorithm names
         */
        this.learnAlgorithms = learnAlgorithm;

        /**
         * The web driver enum
         */
        this.webBrowser = webBrowser;

        /**
         * The LearnConfiguration to be edited
         * @type {LearnConfiguration}
         */
        this.learnConfiguration = modalData.learnConfiguration;
    }


    /** Sets the Eq Oracle of the learn configuration depending on the selected value */
    setEqOracle() {
        this.learnConfiguration.eqOracle = this.EqOracleService.createFromType(this.selectedEqOracle);
    }

    /** Close the modal dialog and pass the edited learn configuration instance. */
    ok() {
        this.ToastService.success('Learn coniguration updated');
        this.EventBus.emit(events.LEARN_CONFIG_UPDATED, {
            learnConfiguration: this.learnConfiguration
        });
        this.$modalInstance.dismiss();
    }

    /** Close the modal dialog. */
    close() {
        this.$modalInstance.dismiss();
    }
}

export default LearnSetupSettingsModalController;