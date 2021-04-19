/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.data.entities.ProjectEnvironment;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Manager to manage a set of connectors.
 */
public class ConnectorManager implements Iterable<Connector> {

    /**
     * Map of all the connectors by their type.
     */
    private final Map<Class<? extends Connector>, Connector> connectors;

    /** The environment the connectors are used in. */
    private final ProjectEnvironment environment;

    /**
     * Default constructor.
     */
    public ConnectorManager(ProjectEnvironment environment) {
        this.environment = environment;
        this.connectors = new HashMap<>();
    }

    /**
     * Adds a new connector to the manager.
     *
     * @param connector
     *         The instance of the connector to add.
     */
    public void addConnector(Connector connector) {
        this.connectors.put(connector.getClass(), connector);
    }

    /**
     * Get the connector specified by a connector class.
     *
     * @param type
     *         The class of the connector.
     * @param <T>
     *         The type of the connector.
     * @return The connector that matches the specified class.
     */
    public <T> T getConnector(Class<T> type) {
        return (T) this.connectors.get(type);
    }

    @Override
    public Iterator<Connector> iterator() {
        return connectors.values().iterator();
    }

    /** Disposes all connectors. */
    public void dispose() {
        connectors.values().forEach(Connector::dispose);
    }

    /** Clean up all connectors after the learner finished. */
    public void post() {
        connectors.values().forEach(Connector::post);
    }

    public ProjectEnvironment getEnvironment() {
        return environment;
    }
}
