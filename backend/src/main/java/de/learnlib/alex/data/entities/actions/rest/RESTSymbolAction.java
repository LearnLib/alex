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

package de.learnlib.alex.data.entities.actions.rest;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Base class for all the REST specific actions.
 */
@Entity
@DiscriminatorValue("rest")
@JsonTypeName("rest")
public abstract class RESTSymbolAction extends SymbolAction {

    private static final long serialVersionUID = -897337751104947135L;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        return execute(connector.getConnector(WebServiceConnector.class));
    }

    /**
     * Execute a REST action, i.e. a action that interacts with an web service interface.
     *
     * @param connector
     *         The connector to connect to web services.
     * @return An indicator of the action was executed successfully or not.
     */
    protected abstract ExecuteResult execute(WebServiceConnector connector);

}
