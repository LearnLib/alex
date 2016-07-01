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
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * Action to move the mouse to an element or a screen position, e.g. in order to make
 * invisible elements visible or to scroll on the page.
 */
@Entity
@DiscriminatorValue("web_moveMouse")
@JsonTypeName("web_moveMouse")
public class MoveMouseAction extends WebSymbolAction {

    /**
     * to be serializable.
     */
    private static final long serialVersionUID = -3477841410719285695L;

    /**
     * The selector of the element.
     */
    @Column(columnDefinition = "CLOB")
    private String node;

    /**
     * The amount in px to move the mouse in x direction from the current position.
     */
    @NotNull
    @Min(0)
    private int offsetX;

    /**
     * The amount in px to move the mouse in y direction from the current position.
     */
    @NotNull
    @Min(0)
    private int offsetY;

    /**
     * Gets offset y.
     *
     * @return the offset y
     */
    public int getOffsetY() {
        return offsetY;
    }

    /**
     * Sets offset y.
     *
     * @param offsetY the offset y
     */
    public void setOffsetY(int offsetY) {
        this.offsetY = offsetY;
    }

    /**
     * Gets node.
     *
     * @return the node
     */
    public String getNode() {
        return node;
    }

    /**
     * Sets node.
     *
     * @param node the node
     */
    public void setNode(String node) {
        this.node = node;
    }

    /**
     * Gets offset x.
     *
     * @return the offset x
     */
    public int getOffsetX() {
        return offsetX;
    }

    /**
     * Sets offset x.
     *
     * @param offsetX the offset x
     */
    public void setOffsetX(int offsetX) {
        this.offsetX = offsetX;
    }

    @Override
    protected ExecuteResult execute(WebSiteConnector connector) {

        try {
            Actions actions = new Actions(connector.getDriver());

            if (node == null || node.trim().equals("")) {
                actions.moveByOffset(offsetX, offsetY);
            } else {
                WebElement element = connector.getElement(CSSUtils.escapeSelector(insertVariableValues(node)));
                actions.moveToElement(element, offsetX, offsetY);
            }

            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            return getFailedOutput();
        }
    }
}
