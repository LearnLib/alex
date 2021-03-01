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

package de.learnlib.alex.data.entities.actions.misc;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.NoSuchElementException;

/**
 * Counts elements that match a given selector and stores the result into a variable.
 */
@Entity
@DiscriminatorValue("setVariableByNodeCount")
@JsonTypeName("setVariableByNodeCount")
public class SetVariableByNodeCountAction extends SymbolAction {

    private static final long serialVersionUID = 8693471212825524162L;

    private static final Logger LOGGER = LogManager.getLogger();

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
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            nodeCount = connector.getConnector(WebSiteConnector.class)
                    .getElements(nodeWithVariables)
                    .size();
        } catch (NoSuchElementException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not find elements with the selector '{}'.",
                    nodeWithVariables);
        }

        connector.getConnector(VariableStoreConnector.class)
                .set(name, String.valueOf(nodeCount));

        return getSuccessOutput();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

}
