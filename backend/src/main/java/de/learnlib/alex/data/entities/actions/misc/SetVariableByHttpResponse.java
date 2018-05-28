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

package de.learnlib.alex.data.entities.actions.misc;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to set a variable to the body of the last HTTP response.
 */
@Entity
@DiscriminatorValue("setVariableByHttpResponse")
@JsonTypeName("setVariableByHttpResponse")
public class SetVariableByHttpResponse extends SymbolAction {

    private static final long serialVersionUID = -1062817486843997759L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The name of the variable. */
    @NotEmpty
    private String name;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        final WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);
        final VariableStoreConnector variableStore = connector.getConnector(VariableStoreConnector.class);

        try {
            final String body = webServiceConnector.getBody();
            variableStore.set(name, body);

            LOGGER.info(LEARNER_MARKER, "Set variable '{}' to HTTP body. (ignoreFailure: {}, negated: {}).",
                    name, ignoreFailure, negated);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info(LEARNER_MARKER, "Could not set variable '{}' to HTTP body. (ignoreFailure: {}, negated: {}).",
                    name, ignoreFailure, negated);
            return getFailedOutput();
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
