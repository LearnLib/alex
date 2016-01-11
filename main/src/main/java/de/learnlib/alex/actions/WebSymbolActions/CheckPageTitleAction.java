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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import de.learnlib.alex.utils.SearchHelper;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.WebDriver;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to check the page title.
 */
@Entity
@DiscriminatorValue("web_checkPageTitle")
@JsonTypeName("web_checkPageTitle")
public class CheckPageTitleAction extends WebSymbolAction {

    /** The title of the web page. */
    @NotBlank
    private String title;

    /**
     * Field to determine if the search string is a regular expression.
     * Only works while searching for text.
     */
    private boolean regexp;

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        WebDriver driver = connector.getDriver();
        if (SearchHelper.search(getTitleWithVariableValues(), driver.getTitle(), regexp)) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

    /**
     * Get the title to check.
     * All variables and counters will be replaced with their values.
     *
     * @return The title to check.
     */
    @JsonIgnore
    public String getTitleWithVariableValues() {
        return insertVariableValues(title);
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isRegexp() {
        return regexp;
    }

    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }
}
