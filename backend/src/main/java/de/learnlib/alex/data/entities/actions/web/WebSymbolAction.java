/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.data.entities.actions.web;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Base for the different action a test could do. This action layer is basically a wrapper around Selenium to be more OO
 * and can be (de-)serialized in JSON.
 */
@Entity
@DiscriminatorValue("web")
@JsonTypeName("web")
public abstract class WebSymbolAction extends SymbolAction {

    private static final long serialVersionUID = -1990239222213631726L;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        return execute(connector.getConnector(WebSiteConnector.class));
    }

    /**
     * Execute a Web action, i.e. an action that interacts with a web site over an browser.
     *
     * @param connector
     *         The connector to connect to web site (via Selenium).
     * @return An indicator of the action was executed successfully or not.
     */
    protected abstract ExecuteResult execute(WebSiteConnector connector);

    @Override
    public String toString() {
        return "WebSymbolsAction[" + id + "] " + getClass().getName();
    }

}
