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

package de.learnlib.alex.data.entities.actions.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import de.learnlib.alex.common.utils.JSONHelpers;
import de.learnlib.alex.learning.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * RESTSymbolAction to check if the request body of the last request has a JSON attribute with a specific type.
 */
@Entity
@DiscriminatorValue("rest_checkAttributeType")
@JsonTypeName("rest_checkAttributeType")
public class CheckAttributeTypeAction extends  RESTSymbolAction {

    private static final long serialVersionUID = 6962742356381266855L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * Enumeration to refer to a type of a JSON field.
     */
    public enum JsonType {
        /** NULL POINTER INCOMMMMING!!!1111. */
        NULL (JsonNodeType.NULL),

        /** The attribute has a string value. */
        STRING (JsonNodeType.STRING),

        /** The attribute has a integer value. */
        INTEGER (JsonNodeType.NUMBER),

        /** The attribute has a boolean value. */
        BOOLEAN (JsonNodeType.BOOLEAN),

        /** The attribute has an object as value. */
        OBJECT (JsonNodeType.OBJECT),

        /** The attribute has an array as value. */
        ARRAY (JsonNodeType.ARRAY),

        /** The attribute has unknown or missing type. */
        UNKNOWN (JsonNodeType.MISSING);

        /** Connection between our minimal type set and the bigger one from Jackson. */
        private JsonNodeType relatedType;

        /**
         * Internal constructor to set the related types.
         *
         * @param relatedType
         *         The type use by Jackson which is equal to our system.
         */
        JsonType(JsonNodeType relatedType) {
            this.relatedType = relatedType;
        }

        /**
         * Get the JSON type used by Jackson which is equal to the type.
         *
         * @return The equal JSON type used by Jackson.
         */
        public JsonNodeType getRelatedType() {
            return relatedType;
        }
    }

    /** The name of the attribute to check for. */
    @NotBlank
    private  String attribute;

    /** The JSON type the attribute should have. */
    @NotNull
    private JsonType jsonType;

    /**
     * Get the field name of the requested attribute.
     *
     * @return The name of the attribute.
     */
    public String getAttribute() {
        return attribute;
    }

    /**
     * Get the field name of the requested attribute.
     * All variables and counters will be replaced with their values.
     *
     * @return The name of the attribute.
     */
    @JsonIgnore
    public String getAttributeWithVariableValues() {
        return insertVariableValues(attribute);
    }

    /**
     * Set the field name of the attribute which should be searched for.
     *
     * @param attribute
     *         The name of the attribute.
     */
    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    /**
     * Get the expected type of the JSON attribute.
     *
     * @return The expected type of the JSON attribute.
     */
    public JsonType getJsonType() {
        return jsonType;
    }

    /**
     * Set the expected type of the JSON attribute.
     *
     * @param jsonType
     *         The expected type of the JSON attribute.
     */
    public void setJsonType(JsonType jsonType) {
        this.jsonType = jsonType;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        String body = target.getBody();
        JsonType typeInBody = JSONHelpers.getAttributeType(body, getAttributeWithVariableValues());

        boolean result = typeInBody != null && typeInBody.equals(jsonType);

        LOGGER.info(LEARNER_MARKER, "Check if the attribute '{}' has the type '{}' in '{}' => {} "
                            + "(ignoreFailure: {}, negated: {}).",
                    attribute, jsonType, body, result, ignoreFailure, negated);
        if (result) {
            return getSuccessOutput();
        } else {
            return  getFailedOutput();
        }
    }

}
