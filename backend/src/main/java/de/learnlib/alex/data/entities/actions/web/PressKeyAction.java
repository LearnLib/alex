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

package de.learnlib.alex.data.entities.actions.web;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.WebElementLocator;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * The action that simulates a key press.
 */
@Entity
@DiscriminatorValue("web_pressKey")
@JsonTypeName("web_pressKey")
public class PressKeyAction extends WebSymbolAction {

    private static final long serialVersionUID = 3238529954083029446L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /**
     * The selector of the element.
     */
    @NotNull
    @Embedded
    private WebElementLocator node;

    /**
     * The escaped string representation of the unicode that represents the key.
     **/
    @NotBlank
    @Column(name = "\"key\"")
    private String key;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        final String unescapedKey = StringEscapeUtils.unescapeJava(this.key);
        final Keys keyToPress = Keys.getKeyFromUnicode(unescapedKey.toCharArray()[0]);

        final WebElementLocator nodeWithVariables =
                new WebElementLocator(insertVariableValues(node.getSelector()), node.getType());

        try {
            final WebElement element = connector.getElement(nodeWithVariables);
            element.sendKeys(keyToPress);
            LOGGER.info(LEARNER_MARKER, "Pressed the key '{}' on the element '{}' (ignoreFailure: {}, negated: {}).",
                    keyToPress.toString(), nodeWithVariables, ignoreFailure, negated);
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "Could not press key '{}' on element '{}' (ignoreFailure: {}, negated: {}).",
                    keyToPress.toString(), nodeWithVariables, ignoreFailure, negated, e);
            return getFailedOutput();
        }
    }

    /**
     * @return The node.
     */
    public WebElementLocator getNode() {
        return node;
    }

    /**
     * @param node
     *         The node.
     */
    public void setNode(WebElementLocator node) {
        this.node = node;
    }

    /**
     * @return The escaped unicode of the key.
     */
    public String getKey() {
        return key;
    }

    /**
     * @param key
     *         The escaped unicode of the key.
     */
    public void setKey(String key) {
        this.key = key;
    }
}
