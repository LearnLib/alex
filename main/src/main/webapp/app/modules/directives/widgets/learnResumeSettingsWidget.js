import {eqOracleType} from '../../constants';

/**
 * The directive for the widget of the sidebar where learn resume configurations can be edited. Should be included
 * into a <div widget></div> directive for visual appeal.
 *
 * Expects an attribute 'learnConfiguration' attached to the element whose value should be a LearnConfiguration
 * object.
 *
 * Use: <widget title="...">
 *          <learn-resume-settings-widget learn-configuration="..."></learn-resume-settings-widget>
 *      </widget>
 */
// @ngInject
class LearnResumeSettingsWidget {

    /**
     * Constructor
     * @param EqOracleService
     */
    constructor(EqOracleService) {
        this.EqOracleService = EqOracleService;

        /**
         * The dictionary for eq oracle types
         * @type {Object}
         */
        this.eqOracles = eqOracleType;

        /**
         * The selected eq oracle type from the select box
         * @type {string}
         */
        this.selectedEqOracle = this.learnConfiguration.eqOracle.type;
    }

    /** Creates a new eq oracle object from the selected type and assigns it to the configuration */
    setEqOracle() {
        this.learnConfiguration.eqOracle = this.EqOracleService.createFromType(this.selectedEqOracle);
    }
}

const learnResumeSettingsWidget = {
    bindings: {
        learnConfiguration: '='
    },
    controller: LearnResumeSettingsWidget,
    controllerAs: 'vm',
    templateUrl: 'views/directives/learn-resume-settings-widget.html'
};

export default learnResumeSettingsWidget;