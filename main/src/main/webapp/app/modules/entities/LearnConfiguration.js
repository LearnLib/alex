import {learnAlgorithm, webBrowser} from '../constants';
import {RandomEqOracle} from '../entities/EqOracle';

/** The model for a learn configuration */
class LearnConfiguration {

    /**
     * Constructor
     * @param obj - The object to create a learn configuration from
     */
    constructor(obj = {}) {

        /**
         * The list of id/revision pairs of symbols to learn
         * @type {{id:number, revision:number}[]}
         */
        this.symbols = obj.symbols || [];

        /**
         * The max amount of hypotheses to generate
         * @type {number}
         */
        this.maxAmountOfStepsToLearn = obj.maxAmountOfStepsToLearn || 0;

        /**
         * The EQ oracle to user
         * @type {*|RandomEqOracle}
         */
        this.eqOracle = obj.eqOracle || new RandomEqOracle(1, 10, 20);

        /**
         * The algorithm to use for learning
         * @type {string}
         */
        this.algorithm = obj.learnAlgorithm || learnAlgorithm.TTT;

        /**
         * The id/revision pair of the reset symbol
         * @type {{id:number,revision:number}|null}
         */
        this.resetSymbol = obj.resetSymbol || null;

        /**
         * A comment
         * @type {string|null}
         */
        this.comment = obj.comment || null;
    }

    /**
     * Adds a symbol to the configuration
     * @param {Symbol} symbol - The symbol to add to the config
     */
    addSymbol(symbol) {
        this.symbols.push(symbol.getIdRevisionPair());
    }

    /**
     * Sets the reset symbols for the configuration
     * @param {Symbol} symbol - The reset symbol to use
     */
    setResetSymbol(symbol) {
        this.resetSymbol = symbol.getIdRevisionPair();
    }

    /**
     * Get the configuration as required to resume a learn process
     * @returns {{eqOracle: (*|RandomEqOracle), maxAmountOfStepsToLearn: number}}
     */
    getLearnResumeConfiguration() {
        return {
            eqOracle: this.eqOracle,
            maxAmountOfStepsToLearn: this.maxAmountOfStepsToLearn
        };
    }
}

export default LearnConfiguration;
