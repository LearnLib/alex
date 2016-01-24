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

package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;

import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity to hold the information and parameters to configure a learn process.
 */
@JsonPropertyOrder(alphabetic = true)
public class LearnerConfiguration extends LearnerResumeConfiguration implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = -5130245647384793948L;

    /** The ID of the user related to the configuration. */
    private Long userId;

    /** The ID of the project related to the configuration. */
    private Long projectId;

    /**
     * Link to the Symbols that are used during the learning.
     * @requiredField
     */
    private Set<IdRevisionPair> symbolsAsIdRevisionPairs;

    /**
     * Link to the Symbols that should be used as a reset Symbol.
     * @requiredField
     */
    private IdRevisionPair resetSymbolAsIdRevisionPair;

    /**
     * The algorithm to be used during the learning.
     * @requiredField
     */
    private LearnAlgorithms algorithm;

    /** The browser to use during the learn process. */
    private WebSiteConnector.WebBrowser browser;

    /** A shot comment to describe the learn set up. */
    private String comment;

    /**
     * Default constructor.
     */
    public LearnerConfiguration() {
        this.symbolsAsIdRevisionPairs = new HashSet<>();
        this.algorithm = LearnAlgorithms.TTT;
        this.comment = "";
    }

    /**
     * @return The ID of the user related to the configuration.
     */
    @JsonProperty("user")
    public Long getUserId() {
        return userId;
    }

    /**
     * @param userId The new ID of the user related to the configuration.
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * @return The ID of the project related to the configuration.
     */
    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    /**
     * @param projectId The new ID of the project related to the configuration.
     */
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    /**
     * Get a List of IdRevisionPairs that describes the symbols to be used during the learning process.
     *
     * @return A List of IdRevisionPair referring to symbols that must be used during the learning.
     */
    @JsonProperty("symbols")
    public Set<IdRevisionPair> getSymbolsAsIdRevisionPairs() {
        if (symbolsAsIdRevisionPairs == null || symbolsAsIdRevisionPairs.isEmpty()) {
            symbolsAsIdRevisionPairs = new HashSet<>();
        }

        return symbolsAsIdRevisionPairs;
    }

    /**
     * Set a List of IdRevisionPairs to find all the symbols that must be used during a learning process.
     *
     * @param symbolsAsIdRevisionPairs
     *         The List of IdRevisionPairs to refer to symbols that must be used during the learning.
     */
    @JsonProperty("symbols")
    public void setSymbolsAsIdRevisionPairs(Set<IdRevisionPair> symbolsAsIdRevisionPairs) {
        this.symbolsAsIdRevisionPairs = symbolsAsIdRevisionPairs;
    }

    /**
     * Get the IdRevisionPair of the reset symbol.
     *
     * @return The link to the reset symbol.
     */
    @JsonProperty("resetSymbol")
    public IdRevisionPair getResetSymbolAsIdRevisionPair() {
        return resetSymbolAsIdRevisionPair;
    }

    /**
     * Set the IdRevisionPair of the reset symbol. This updates not the reset symbol itself.
     *
     * @param resetSymbolAsIdRevisionPair
     *         The new pair of the reset symbol.
     */
    public void setResetSymbolAsIdRevisionPair(IdRevisionPair resetSymbolAsIdRevisionPair) {
        this.resetSymbolAsIdRevisionPair = resetSymbolAsIdRevisionPair;
    }

    /**
     * Get the LearnerAlgorithm that should be used for the learning process.
     *
     * @return The selected LearnerAlgorithm.
     */
    public LearnAlgorithms getAlgorithm() {
        return algorithm;
    }

    /**
     * Set a new LearnerAlgorithm to use for the learning.
     *
     * @param algorithm
     *         The new algorithm to be used.
     */
    public void setAlgorithm(LearnAlgorithms algorithm) {
        this.algorithm = algorithm;
    }

    public WebSiteConnector.WebBrowser getBrowser() {
        if (browser == null) {
            return WebSiteConnector.WebBrowser.HTMLUNITDRIVER;
        } else {
            return browser;
        }
    }

    public void setBrowser(WebSiteConnector.WebBrowser browser) {
        this.browser = browser;
    }

    /**
     * Get the current comment for the learn setup.
     *
     * @return The current comment.
     */
    @Size(max = 255)
    public String getComment() {
        return comment;
    }

    /**
     * Set a new short comment.
     * Must be between max. 25 characters long.
     *
     * @param comment
     *         The new comment.
     */
    public void setComment(String comment) {
        this.comment = comment;
    }

}
