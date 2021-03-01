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

package de.learnlib.alex.data.entities.actions.web;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Action to clear on a specific element.
 */
@Entity
@DiscriminatorValue("web_clear")
@JsonTypeName("web_clear")
public class ClearAction extends WebSymbolAction {

    private static final long serialVersionUID = -255670058811890900L;

    private static final Logger LOGGER = LogManager.getLogger();

    /** The node to look for. */
    @NotNull
    @Embedded
    private WebElementLocator node;

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            connector.getElement(nodeWithVariables).clear();

            LOGGER.info(LoggerMarkers.LEARNER, "Cleared element '{}'.", nodeWithVariables);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not clear element '{}'.", nodeWithVariables, e);
            return getFailedOutput();
        }
    }

    public WebElementLocator getNode() {
        return node;
    }

    public void setNode(WebElementLocator node) {
        this.node = node;
    }

}
