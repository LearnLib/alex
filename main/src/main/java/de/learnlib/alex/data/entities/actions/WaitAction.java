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

package de.learnlib.alex.data.entities.actions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.actions.WebSymbolActions.WebSymbolAction;
import de.learnlib.alex.learning.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to wait for a specific amount of time.
 */
@Entity
@DiscriminatorValue("wait")
@JsonTypeName("wait")
public class WaitAction extends WebSymbolAction {

    private static final long serialVersionUID = 7122950041811279742L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * The duration to wait in ms.
     * @requiredField
     */
    private Long duration;

    /**
     * Get the duration of the wait.
     *
     * @return The duration in milliseconds.
     */
    public Long getDuration() {
        return duration;
    }

    /**
     * Set the duration to wait.
     *
     * @param duration
     *         The new duration in milliseconds.
     */
    public void setDuration(Long duration) {
        this.duration = duration;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            LOGGER.info(LEARNER_MARKER, "Waiting for {} ms.", duration);
            Thread.sleep(duration);
            return getSuccessOutput();
        } catch (InterruptedException e) {
            LOGGER.error(LEARNER_MARKER, "Failed to wait.", e);
            return getFailedOutput();
        }
    }

}
