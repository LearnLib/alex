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
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * Action to wait for a specific amount of time.
 */
@Entity
@DiscriminatorValue("wait")
@JsonTypeName("wait")
public class WaitAction extends SymbolAction {

    private static final long serialVersionUID = 7122950041811279742L;

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The duration to wait in ms.
     */
    @NotNull
    @Min(0)
    private Long duration;

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        try {
            LOGGER.info(LoggerMarkers.LEARNER, "Waiting for {} ms.", duration);
            Thread.sleep(duration);
            return getSuccessOutput();
        } catch (InterruptedException e) {
            LOGGER.error(LoggerMarkers.LEARNER, "Failed to wait.", e);
            return getFailedOutput();
        }
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

}
