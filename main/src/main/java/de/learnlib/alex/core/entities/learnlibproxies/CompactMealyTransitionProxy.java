package de.learnlib.alex.core.entities.learnlibproxies;

import java.io.Serializable;

/**
 * Proxy around a CompactMealyTransition
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 *
 * @see net.automatalib.automata.transout.impl.compact.CompactMealyTransition
 */
public class CompactMealyTransitionProxy implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = -5676454094797505993L;

    /** The number of the state on which the transition starts. */
    private int from;

    /** The input that triggers the transition. */
    private String input;

    /** The number of the state on which the transition ends. */
    private int to;

    /** The output that happens during the transition. */
    private String output;

    /**
     * Default constructor.
     */
    public CompactMealyTransitionProxy() {
        // this constructor only exists so one has not to use the advanced constructor.
    }

    /**
     * Constructor that initialises all fields.
     *
     * @param from
     *         The start of the transition.
     * @param input
     *         The input that triggers the transition.
     * @param to
     *         The end of the transition.
     * @param output
     *         The output during the transition.
     */
    public CompactMealyTransitionProxy(int from, String input, int to, String output) {
        this.from = from;
        this.to = to;
        this.input = input;
        this.output = output;
    }

    /**
     * Get the number of the state this transition starts.
     *
     * @return The start state of the transition.
     */
    public int getFrom() {
        return from;
    }

    /**
     * Set a new start state for the transition.
     *
     * @param from
     *         The new start state.
     */
    public void setFrom(int from) {
        this.from = from;
    }

    /**
     * Get the input that triggers the transition.
     *
     * @return The input that will cause the transition.
     */
    public String getInput() {
        return input;
    }

    /**
     * Set a new input that will trigger the transition.
     *
     * @param input
     *         The new input to trigger the tranistion.
     */
    public void setInput(String input) {
        this.input = input;
    }

    /**
     * Get the number of the state the transition ends.
     *
     * @return The end state of the transition.
     */
    public int getTo() {
        return to;
    }

    /**
     * Set a new end state for the transition.
     *
     * @param to
     *         The new end state.
     */
    public void setTo(int to) {
        this.to = to;
    }

    /**
     * Get the output that happens during the transition.
     *
     * @return The output of the transition.
     */
    public String getOutput() {
        return output;
    }

    /**
     * Set a new output for the transition.
     *
     * @param output
     *         The output that happens during the transition.
     */
    public void setOutput(String output) {
        this.output = output;
    }

}
