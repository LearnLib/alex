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

package de.learnlib.alex.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.SymbolAction;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

/**
 * Action to set a variable to the value of an attribute of an HTML node
 */
@Entity
@DiscriminatorValue("setVariableByNodeAttribute")
@JsonTypeName("setVariableByNodeAttribute")
public class SetVariableByNodeAttributeAction extends SymbolAction {

    /** Use the learner logger. */
    @Transient
    @JsonIgnore
    private static final Logger LOGGER = LogManager.getLogger("learner");

    /** The name of the variable */
    @NotBlank
    protected String name;

    /** The node to look for */
    @NotNull
    @Column(columnDefinition = "CLOB")
    protected String node;

    /** The attribute name of the node to look for */
    @NotNull
    protected String attribute;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        try {
            String value = webSiteConnector.getElement(node).getAttribute(attribute);
            storeConnector.set(name, value);

            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info("Could not set the variable '" + name + "' to the value of the attribute of the HTML node '" + node + "'.");
            return getFailedOutput();
        }
    }

    // auto generated getter & setter

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNode() {
        return node;
    }

    public void setNode(String node) {
        this.node = node;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }
}
