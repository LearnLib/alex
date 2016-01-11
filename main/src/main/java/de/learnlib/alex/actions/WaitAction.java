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

package de.learnlib.alex.actions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.actions.WebSymbolActions.WebSymbolAction;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to wait for a specific amount of time.
 */
@Entity
@DiscriminatorValue("wait")
@JsonTypeName("wait")
public class WaitAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 7122950041811279742L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

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
            Thread.sleep(duration);
            return getSuccessOutput();
        } catch (InterruptedException e) {
            LOGGER.error("WaitAction failed to wait.", e);
            return getFailedOutput();
        }
    }

}
