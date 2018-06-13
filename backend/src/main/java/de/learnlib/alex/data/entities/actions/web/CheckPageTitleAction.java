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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.WebDriver;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * Action to check the page title.
 */
@Entity
@DiscriminatorValue("web_checkPageTitle")
@JsonTypeName("web_checkPageTitle")
public class CheckPageTitleAction extends WebSymbolAction {

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The title of the web page. */
    @NotBlank
    private String title;

    /**
     * Field to determine if the search string is a regular expression. Only works while searching for text.
     */
    @NotNull
    private boolean regexp;

    /** Constructor. */
    public CheckPageTitleAction() {
        this.regexp = false;
    }

    /**
     * @return The title to search for (without replaced counters nor variables).
     */
    public String getTitle() {
        return title;
    }

    /**
     * Get the title to check. All variables and counters will be replaced with their values.
     *
     * @return The title to check.
     */
    @JsonIgnore
    public String getTitleWithVariableValues() {
        return insertVariableValues(title);
    }

    /**
     * @param title
     *         The new title to search for.
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * @return Is the title to search for a regexp?
     */
    public boolean isRegexp() {
        return regexp;
    }

    /**
     * @param regexp
     *         True if the title is a regexp; False otherwise.
     */
    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebDriver driver = connector.getDriver();
        final boolean result = SearchHelper.search(getTitleWithVariableValues(), driver.getTitle(), regexp);

        LOGGER.info(LEARNER_MARKER, "Check if the current pages has the title '{}' => {} "
                        + "(regExp: {}, ignoreFailure: {}, negated: {}).",
                title, result, regexp, ignoreFailure, negated);
        if (result) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

}
