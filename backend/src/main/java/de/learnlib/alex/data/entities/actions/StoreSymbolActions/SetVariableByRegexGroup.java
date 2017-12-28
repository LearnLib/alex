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

package de.learnlib.alex.data.entities.actions.StoreSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.SymbolAction;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Action that, given a regular expression, searches in the page source for matches.
 * If a match is found, it extracts the nth group, e.g. (.*?) in the regex, and saves the value into a variable.
 */
@Entity
@DiscriminatorValue("setVariableByRegexGroup")
@JsonTypeName("setVariableByRegexGroup")
public class SetVariableByRegexGroup extends SymbolAction {

    private static final long serialVersionUID = -5562530206394874225L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The name of the variable. */
    @NotBlank
    private String name;

    /** The regex to search in the page source. */
    @NotBlank
    private String regex;

    /** Which match should be used. */
    @NotNull
    private int nthMatch;

    /** Which group in the match should be used. */
    @NotNull
    private int mthGroup;

    @Override
    protected ExecuteResult execute(ConnectorManager connector) {
        if (nthMatch < 1) {
            nthMatch = 1;
        }
        if (mthGroup < 0) {
            mthGroup = 0;
        }

        String pageSource = connector.getConnector(WebSiteConnector.class)
                .getDriver()
                .getPageSource();

        Matcher matcher = Pattern.compile(regex)
                .matcher(pageSource);

        try {
            boolean matchFound = false;
            int i = 1;

            while (matcher.find()) {
                if (i == nthMatch) {
                    String group = matcher.group(mthGroup);
                    connector.getConnector(VariableStoreConnector.class)
                            .set(name, group);
                    matchFound = true;
                    break;
                }
                i++;
            }

            if (!matchFound) {
                LOGGER.info(LEARNER_MARKER, "Could not find a string that matches regex '{}' "
                        + "(ignoreFailure: {}, negated: {})", regex, ignoreFailure, negated);
                return getFailedOutput();
            }
        } catch (IndexOutOfBoundsException e) {
            LOGGER.info(LEARNER_MARKER, "Could not find group {} in regex '{}' "
                    + "(ignoreFailure: {}, negated: {})", mthGroup, regex, ignoreFailure, negated);
            return getFailedOutput();
        }

        return getSuccessOutput();
    }

    /** @return {@link #name}. */
    public String getName() {
        return name;
    }

    /** @param name {@link #name}. */
    public void setName(String name) {
        this.name = name;
    }

    /** @return {@link #regex}. */
    public String getRegex() {
        return regex;
    }

    /** @param regex {@link #regex}. */
    public void setRegex(String regex) {
        this.regex = regex;
    }

    /** @return {@link #nthMatch}. */
    public int getNthMatch() {
        return nthMatch;
    }

    /** @param nthMatch {@link #nthMatch}. */
    public void setNthMatch(int nthMatch) {
        this.nthMatch = nthMatch;
    }

    /** @return {@link #mthGroup}. */
    public int getMthGroup() {
        return mthGroup;
    }

    /** @param mthGroup {@link #mthGroup}. */
    public void setMthGroup(int mthGroup) {
        this.mthGroup = mthGroup;
    }
}
