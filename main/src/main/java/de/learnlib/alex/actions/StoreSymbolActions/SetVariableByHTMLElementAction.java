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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.ConnectorManager;
import de.learnlib.alex.core.learner.connectors.VariableStoreConnector;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to set a variable to a value received from an element of the DOM tree.
 */
@Entity
@DiscriminatorValue("setVariableByHTML")
@JsonTypeName("setVariableByHTML")
public class SetVariableByHTMLElementAction extends SetVariableAction {

    /** to be serializable. */
    private static final long serialVersionUID = -7654754471208209824L;

    /** Use the learner logger. */
    private static final Logger LOGGER = LogManager.getLogger("learner");

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebSiteConnector webSiteConnector = connector.getConnector(WebSiteConnector.class);

        try {
            String valueInTheNode = webSiteConnector.getElement(value).getText();
            storeConnector.set(name, valueInTheNode);
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info("Could not set the variable '" + name + "' to the value of the  HTML node '" + value + "'.");
            return getFailedOutput();
        }
    }
}
