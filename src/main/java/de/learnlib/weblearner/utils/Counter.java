package de.learnlib.weblearner.utils;

/**
 * Interface to describe a simple, positive integer counter.
 */
public interface Counter {

    /**
     * Get the current value of the counter.
     *
     * @return The current counter value.
     */
    int getCounter();

    /**
     * Reset the counter to 0.
     */
    void resetCounter();

    /**
     * Increment the counter by 1.
     *
     * @return The new value of the counter.
     */
    int incrementCounter();

}
