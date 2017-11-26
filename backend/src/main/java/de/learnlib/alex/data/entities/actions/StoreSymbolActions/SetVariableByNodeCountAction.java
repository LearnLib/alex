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

package de.learnlib.alex.data.entities.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Counts elements that match a given selector and stores the result into a variable.
 */
@Entity
@DiscriminatorValue("setVariableByNodeCount")
@JsonTypeName("setVariableByNodeCount")
public class SetVariableByNodeCountAction extends SymbolAction {

    private static final long serialVersionUID = 8693471212825524162L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The name of the variable. */
    @NotBlank
    private String name;

    /** The selector of the elements. */
    @NotNull
    @Embedded
    private WebElementLocator node;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        int nodeCount = 0;
        node.setSelector(insertVariableValues(node.getSelector()));

        try {
            nodeCount = connector.getConnector(WebSiteConnector.class)
                    .getElements(node)
                    .size();
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "Could not find elements with the selector '{}' "
                        + "(ignoreFailure: {}, negated: {}).",
                    node, ignoreFailure, negated);
        }

        connector.getConnector(VariableStoreConnector.class)
                .set(name, String.valueOf(nodeCount));

        return getSuccessOutput();
    }

    /** @return {@link #name}. */
    public String getName() {
        return name;
    }

    /** @param name {@link #name}. */
    public void setName(String name) {
        this.name = name;
    }

    /** @return {@link #node}. */
    public WebElementLocator getNode() {
        return node;
    }

    /** @param node {@link #node}. */
    public void setNode(WebElementLocator node) {
        this.node = node;
    }
}
