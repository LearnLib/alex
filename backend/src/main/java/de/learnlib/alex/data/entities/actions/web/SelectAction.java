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

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.UnexpectedTagNameException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to select an entry from a select field by its value.
 */
@Entity
@DiscriminatorValue("web_select")
@JsonTypeName("web_select")
public class SelectAction extends FillAction {

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * Enum to choose how to interact with the selection input.
     */
    public enum SelectByType {

        /** Select by the value attribute. */
        VALUE,

        /** Select by the option text. */
        TEXT,

        /** Select simply by using the index starting at 0. */
        INDEX;

        /**
         * Parser function to handle the enum names case insensitive.
         *
         * @param name
         *         The enum name.
         * @return The corresponding SelectByType.
         * @throws IllegalArgumentException
         *         If the name could not be parsed.
         */
        @JsonCreator
        public static SelectByType fromString(String name) throws IllegalArgumentException {
            return SelectByType.valueOf(name.toUpperCase());
        }

        @Override
        public String toString() {
            return name().toLowerCase();
        }

    }

    /**
     * The type that an option is selected by.
     */
    @NotNull
    private SelectByType selectBy;

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final String valueWithVariables = insertVariableValues(value);

            final WebElement selectElement = connector.getElement(nodeWithVariables);
            final Select select = new Select(selectElement);
            switch (selectBy) {
                case VALUE:
                    select.selectByValue(valueWithVariables);
                    break;
                case TEXT:
                    select.selectByVisibleText(valueWithVariables);
                    break;
                case INDEX:
                    select.selectByIndex(Integer.parseInt(value));
                    break;
                default:
                    select.selectByIndex(0);
                    break;
            }

            LOGGER.info(LoggerMarkers.LEARNER, "Selected '{}' of '{}' by '{}'.",
                    value, nodeWithVariables, selectBy);
            return getSuccessOutput();
        } catch (NoSuchElementException | NumberFormatException | UnexpectedTagNameException e) {
            LOGGER.info(LoggerMarkers.LEARNER, "Could not select '{}' of '{}' by '{}'.",
                    value, nodeWithVariables, selectBy, e);
            return getFailedOutput();
        }
    }

    public SelectByType getSelectBy() {
        return selectBy;
    }

    public void setSelectBy(SelectByType selectBy) {
        this.selectBy = selectBy;
    }

}
