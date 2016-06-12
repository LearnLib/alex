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
    private Map<Class<? extends Connector>, Connector> connectors;

    /**
     * Default constructor.
     */
    public ConnectorManager() {
        this.connectors = new HashMap<>();
    }

    /**
     * Adds a new connector to the manager.
     *
     * @param type      The class of the connector to add.
     * @param connector The instance of the connector to add.
     */
    public void addConnector(Class<? extends Connector> type, Connector connector) {
        this.connectors.put(type, connector);
    }

    /**
     * Get the connector specified by a connector class.
     *
     * @param type The class of the connector.
     * @param <T>  The type of the connector.
     * @return The connector that matches the specified class.
     */
    public <T> T getConnector(Class<T> type) {
        return (T) this.connectors.get(type);
    }

    @Override
    public Iterator<Connector> iterator() {
        return connectors.values().iterator();
    }

    /**
     * Disposes all connectors and clear the list of managed connectors.
     * This method is idempotent.
     */
    public void dispose() {
        connectors.forEach((t, u) -> u.dispose());
    }

}
