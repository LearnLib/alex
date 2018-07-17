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
import de.learnlib.alex.common.utils.LoggerMarkers;
import de.learnlib.alex.common.utils.SearchHelper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.WebDriver;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

/**
 * Action to check the page title.
 */
@Entity
@DiscriminatorValue("web_checkPageTitle")
@JsonTypeName("web_checkPageTitle")
public class CheckPageTitleAction extends WebSymbolAction {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The title of the web page. */
    @NotBlank
    private String title;

    /**
     * Field to determine if the search string is a regular expression. Only works while searching for text.
     */
    @NotNull
    @Column(name = "\"regexp\"")
    private boolean regexp;

    /** Constructor. */
    public CheckPageTitleAction() {
        this.regexp = false;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        final WebDriver driver = connector.getDriver();
        final boolean result = SearchHelper.search(getTitleWithVariableValues(), driver.getTitle(), regexp);

        LOGGER.info(LoggerMarkers.LEARNER, "Check if the current page has title '{}' => {} "
                        + "(regExp: {}, ignoreFailure: {}, negated: {}).",
                title, result, regexp, ignoreFailure, negated);

        return result ? getSuccessOutput() : getFailedOutput();
    }

    public String getTitle() {
        return title;
    }

    /**
     * Get the title to check. All variables and counters will be replaced with their values.
     *
     * @return The title to check.
     */
    @Transient
    @JsonIgnore
    public String getTitleWithVariableValues() {
        return insertVariableValues(title);
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
