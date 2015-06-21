package de.learnlib.alex.core.learner.connectors;

/**
 * Interface that describes the basics of a Connector.
 */
public interface Connector {

    /**
     * Method called during the reset of the SUL.
     * Set the connector back to init. state.
     */
    void reset();

    void dispose();
}
