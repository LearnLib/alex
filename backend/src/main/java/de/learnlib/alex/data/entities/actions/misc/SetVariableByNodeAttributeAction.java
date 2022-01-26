/*
 * Copyright 2015 - 2022 TU Dortmund
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
import org.openqa.selenium.NoSuchElementException;

/**
 * Action to set a variable to the value of an attribute of an HTML node.
 */
@Entity
@DiscriminatorValue("setVariableByNodeAttribute")
@JsonTypeName("setVariableByNodeAttribute")
public class SetVariableByNodeAttributeAction extends SymbolAction {

    /** The name of the variable. */
    @NotBlank
    protected String name;

    /** The node to look for. */
    @NotNull
    @Embedded
    protected WebElementLocator node;

    /** The attribute name of the node to look for. */
    @NotBlank
    protected String attribute;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            String value = webSiteConnector.getElement(nodeWithVariables).getAttribute(attribute);
            storeConnector.set(name, value);

            logger.info(LoggerMarkers.LEARNER, "Set variable '{}' to attribute '{}' of element '{}'.",
                    name, attribute, nodeWithVariables);

            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            logger.info(LoggerMarkers.LEARNER, "Could not set variable '{}' to attribute '{}' of element '{}'.",
                    name, attribute, nodeWithVariables);

            return getFailedOutput();
        }
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

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

}
