package de.learnlib.weblearner.learner;

import de.learnlib.mapper.ContextExecutableInputSUL.ContextHandler;
import de.learnlib.weblearner.utils.Counter;

/**
 * An base class for ContextHandler with an reset counter, used e.g. for the meta data in the LearnerResult.
 *
 * @param <C>
 *         The Context to use.
 */
public abstract  class AbstractContextHandlerWithCounter<C> implements ContextHandler<C>, Counter {

    /** Keep track of the amount of learn iterations. Could also be used for a virtual reset. */
    protected int counter;

    @Override
    public int getCounter() {
        return counter;
    }

    @Override
    public void resetCounter() {
        counter = 0;
    }

    @Override
    public int incrementCounter() {
        return ++counter;
    }

}
