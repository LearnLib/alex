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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.actions.Credentials;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;

/**
 * Action to navigate to a new URL.
 */
@Entity
@DiscriminatorValue("web_goto")
@JsonTypeName("web_goto")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GotoAction extends WebSymbolAction {

    private static final long serialVersionUID = -9158530821188611940L;

    private static final Logger LOGGER = LogManager.getLogger();

    private static final Marker LEARNER_MARKER = MarkerManager.getMarker("LEARNER");

    /** The URL of the site. */
    @NotBlank
    private String url;

    /**
     * Get the URL this action will navigate to.
     *
     * @return The site URL the element is on.
     */
    public String getUrl() {
        return url;
    }

    /**
     * Optional credentials to authenticate via HTTP basic auth.
     */
    @Embedded
    private Credentials credentials;

    /**
     * Get the URL this action will navigate to. All variables and counters will be replaced with their values.
     *
     * @return The site URL the element is on.
     */
    @JsonIgnore
    public String getURLWithVariableValues() {
        return insertVariableValues(url);
    }

    /**
     * Set the URL of the site where this element is navigating to..
     *
     * @param url
     *         The new site URL.
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Get the credentials to authenticate.
     *
     * @return The credentials to use for authentication.
     */
    public Credentials getCredentials() {
        return credentials;
    }

    /**
     * Like {@link #getCredentials()}, but the name and password will have all variables and counters inserted.
     *
     * @return The credentials to use, with the actual values of counters and variables in their values.
     */
    private Credentials getCredentialsWithVariableValues() {
        if (credentials == null) {
            return new Credentials();
        }

        String name = insertVariableValues(credentials.getName());
        String password = insertVariableValues(credentials.getPassword());

        return new Credentials(name, password);
    }

    /**
     * Set the credentials to use for authentication.
     *
     * @param credentials
     *         The new credentials to use.
     */
    public void setCredentials(Credentials credentials) {
        this.credentials = credentials;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            connector.get(getURLWithVariableValues(), getCredentialsWithVariableValues());
            LOGGER.info(LEARNER_MARKER, "Could goto '{}' (ignoreFailure: {}, negated: {}).",
                    url, ignoreFailure, negated);
            return getSuccessOutput();
        } catch (Exception e) {
            LOGGER.info(LEARNER_MARKER, "Could not goto '{}' (ignoreFailure: {}, negated: {}).",
                    url, ignoreFailure, negated, e);
            return getFailedOutput();
        }
    }

}
