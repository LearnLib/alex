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

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import de.learnlib.alex.utils.CSSUtils;
import org.apache.commons.lang3.StringEscapeUtils;
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
    @Column(columnDefinition = "CLOB")
    @NotNull
    private String node;

    /**
     * The escaped string representation of the unicode that represents the key.
     **/
    @NotBlank
    private String key;

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {
        String unescapedKey = StringEscapeUtils.unescapeJava(this.key);
        Keys keyToPress = Keys.getKeyFromUnicode(unescapedKey.toCharArray()[0]);

        try {
            WebElement element = connector.getElement(CSSUtils.escapeSelector(insertVariableValues(node)));
            element.sendKeys(keyToPress);
            LOGGER.info(LEARNER_MARKER, "Pressed the key '{}' on the element '{}' (ignoreFailure: {}, negated: {}).",
                    keyToPress.toString(), node, ignoreFailure, negated);
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            LOGGER.info(LEARNER_MARKER, "Could not press key '{}' on element '{}' (ignoreFailure: {}, negated: {}).",
                    keyToPress.toString(), node, ignoreFailure, negated, e);
            return getFailedOutput();
        }
    }

    /**
     * @return The node.
     */
    public String getNode() {
        return node;
    }

    /**
     * @param node The node.
     */
    public void setNode(String node) {
        this.node = node;
    }

    /**
     * @return The escaped unicode of the key.
     */
    public String getKey() {
        return key;
    }

    /**
     * @param key The escaped unicode of the key.
     */
    public void setKey(String key) {
        this.key = key;
    }
}
