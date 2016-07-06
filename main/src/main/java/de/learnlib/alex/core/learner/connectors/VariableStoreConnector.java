/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.core.learner.connectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Map;

/**
 * Connector to hold and manage variables.
 */
public class VariableStoreConnector implements Connector {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The variable store. */
    private Map<String, String> store;

    /**
     * Default constructor.
     */
    public VariableStoreConnector() {
        this.store = new HashMap<>();
    }

    @Override
    public void reset() {
        store = new HashMap<>();
    }

    @Override
    public void dispose() {
        // nothing to do here
    }

    /**
     * Set a variable to a certain value.
     *
     * @param name
     *         The name of the variable to set.
     * @param value
     *         The value to set.
     */
    public void set(String name, String value) {
        store.put(name, value);
        LOGGER.debug("Set the variable '{}' to the value '{}'.", name, value);
    }

    /**
     * Check if a variable with a specific name exists.
     *
     * @param name
     *         The name to check.
     * @return true if the variable exists; false otherwise.
     */
    public boolean contains(String name) {
        return store.containsKey(name);
    }

    /**
     * Get the value of a variable.
     *
     * @param name
     *         The variable to get the value from.
     * @return The value of the variable.
     * @throws IllegalStateException
     *         If the variable was not set before.
     */
    public String get(String name) throws IllegalStateException {
        String result = store.get(name);
        if (result == null) {
            throw new IllegalStateException("The variable '" + name + "' was not set and has no value!");
        }

        LOGGER.debug("Got the variable '{}' with the value '{}'.", name, result);

        return result;
    }
}
