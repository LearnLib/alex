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

package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to check the value of a nodes attribute.
 */
@Entity
@DiscriminatorValue("web_checkNodeAttributeValue")
@JsonTypeName("web_checkNodeAttributeValue")
public class CheckNodeAttributeValueAction extends WebSymbolAction {

    private static final long serialVersionUID = -1195203568320940744L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * Enumeration to specify the check method.
     */
    public enum CheckMethod {

        /**
         * If the attribute equals the value.
         */
        IS,

        /**
         * If the attribute contains the value.
         */
        CONTAINS,

        /**
         * If the attribute matches the value.
         */
        MATCHES;

        /**
         * Parser function to handle the enum names case insensitive.
         *
         * @param name The enum name.
         * @return The corresponding CheckMethod.
         * @throws IllegalArgumentException If the name could not be parsed.
         */
        @JsonCreator
        public static CheckMethod fromString(String name) throws IllegalArgumentException {
            return CheckMethod.valueOf(name.toUpperCase());
        }

        @Override
        public String toString() {
            return name().toLowerCase();
        }
    }

    /**
     * The selector of the element.
     */
    @NotBlank
    private String node;

    /**
     * The attribute name of the element to check.
     */
    @NotBlank
    private String attribute;

    /**
     * The attribute value to check for.
     */
    @NotBlank
    private String value;

    /**
     * The method that is used to check the attribute value.
     */
    @NotNull
    private CheckMethod checkMethod;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        try {
            WebElement element = connector.getElement(insertVariableValues(node));
            String attributeValue = element.getAttribute(attribute);
            if (attributeValue == null) {
                LOGGER.info(LEARNER_MARKER, "Attribute '{}' not found on element '{}'",
                        attribute, node);
                return getFailedOutput();
            }

            boolean isValid = false;
            switch (checkMethod) {
                case IS:
                    isValid = attributeValue.equals(value);
                    break;
                case CONTAINS:
                    isValid = attributeValue.contains(value);
                    break;
                case MATCHES:
                    isValid = attributeValue.matches(value);
                    break;
                default:
                    break;
            }

            if (isValid) {
                LOGGER.info(LEARNER_MARKER, "The value of the attribute '{}' of the node '{}'"
                                + " '{}' the searched value '{}' (ignoreFailure: {}, negated: {}).",
                        attribute, node, checkMethod, value, ignoreFailure, negated);
                return getSuccessOutput();
            } else {
                LOGGER.info(LEARNER_MARKER, "The value of the attribute '{}' of the node '{}'"
                                + " does not '{}' the searched value '{}' (ignoreFailure: {}, negated: {}).",
                        attribute, node, checkMethod, value, ignoreFailure, negated);
                return getFailedOutput();
            }
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "Could not find the node '{}' (ignoreFailure: {}, negated: {}).",
                    node, ignoreFailure, negated, e);
            return getFailedOutput();
        }
    }

    /**
     * @return The selector of the element.
     */
    public String getNode() {
        return node;
    }

    /**
     * @param node The selector of the element.
     */
    public void setNode(String node) {
        this.node = node;
    }

    /**
     * @return The attribute of the element.
     */
    public String getAttribute() {
        return attribute;
    }

    /**
     * @param attribute The attribute of the element.
     */
    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    /**
     * @return The value that is checked for.
     */
    public String getValue() {
        return value;
    }

    /**
     * @param value The value that is checked for.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * @return The method that is used to check the attribute value.
     */
    public CheckMethod getCheckMethod() {
        return checkMethod;
    }

    /**
     * @param checkMethod The method that is used to check the attribute value.
     */
    public void setCheckMethod(CheckMethod checkMethod) {
        this.checkMethod = checkMethod;
    }
}
