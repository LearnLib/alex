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
import de.learnlib.alex.common.utils.JSONHelpers;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to set a variable to a value received from an element of the current (JSON) body.
 */
@Entity
@DiscriminatorValue("setVariableByJSON")
@JsonTypeName("setVariableByJSON")
public class SetVariableByJSONAttributeAction extends SetVariableAction {

    @Override
    public ExecuteResult execute(ConnectorManager connector) {
        VariableStoreConnector storeConnector = connector.getConnector(VariableStoreConnector.class);
        WebServiceConnector webServiceConnector = connector.getConnector(WebServiceConnector.class);

        String body = webServiceConnector.getBody();
        String valueInTheBody = JSONHelpers.getAttributeValue(body, value);

        if (valueInTheBody == null) {
            logger.info(LoggerMarkers.LEARNER, "Could not set variable '{}' to the value of the JSON attribute '{}' ",
                    name, value);
            return getFailedOutput();
        }

        storeConnector.set(name, valueInTheBody);
        return getSuccessOutput();
    }

}
