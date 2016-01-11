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
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.UnexpectedTagNameException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to select an entry from a select field by its value.
 */
@Entity
@DiscriminatorValue("web_select")
@JsonTypeName("web_select")
public class SelectAction extends FillAction {

    /**
     * Enum to choose how to interact with the selection input.
     */
    private enum SelectByType {
        /** Select by the value attribute. */
        VALUE,

        /** Select by the option text. */
        TEXT,

        /** Selecct simply by using the index starting at 0. */
        INDEX
    }

    /**
     * The type that an option is selected by.
     *
     * @requiredField
     */
    private SelectByType selectBy;

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            WebElement selectElement = connector.getElement(CSSUtils.escapeSelector(getNodeWithVariableValues()));
            Select select = new Select(selectElement);
            switch (selectBy) {
                case VALUE:
                    select.selectByValue(getValueWithVariableValues());
                    break;
                case TEXT:
                    select.selectByVisibleText(getValueWithVariableValues());
                    break;
                case INDEX:
                    select.selectByIndex(Integer.parseInt(getValue()));
                    break;
                default:
                    select.selectByIndex(0);
                    break;
            }
            return getSuccessOutput();
        } catch (NoSuchElementException | UnexpectedTagNameException e) {
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
