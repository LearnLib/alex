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


package de.learnlib.alex.data.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to submit a specific element.
 */
@Entity
@DiscriminatorValue("web_switchTo")
@JsonTypeName("web_switchTo")
public class SwitchTo extends WebSymbolAction {

    private static final long serialVersionUID = 5072169613597915144L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * The target to switch to.
     */
    private enum TargetType {
        PARENT_FRAME, DEFAULT_CONTENT
    }

    /**
     * The target type.
     */
    private TargetType target;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        try {
            switch (target) {
                case PARENT_FRAME:
                    connector.getDriver().switchTo().parentFrame();
                    break;
                case DEFAULT_CONTENT:
                    connector.getDriver().switchTo().defaultContent();
                    break;
                default:
                    throw new Exception();
            }
            LOGGER.info(LEARNER_MARKER, "Switch to '{}'", target);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info(LEARNER_MARKER, "Could not switch to '{}'", target);
            return getFailedOutput();
        }
    }

    public TargetType getTarget() {
        return target;
    }

    public void setTarget(TargetType target) {
        this.target = target;
    }
}
