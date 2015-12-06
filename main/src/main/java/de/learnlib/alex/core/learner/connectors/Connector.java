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

    /**
     * Dispose the connector.
     * This method will be called after the learning and allow to do necessary clean ups.
     * After this method is called, the connector should not work anymore.
     */
    void dispose();

}
