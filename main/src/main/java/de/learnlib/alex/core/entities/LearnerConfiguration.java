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
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import de.learnlib.alex.utils.AlgorithmDeserializer;
import de.learnlib.alex.utils.AlgorithmSerializer;

import javax.persistence.Embedded;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Entity to hold the information and parameters to configure a learn process.
 */
@JsonPropertyOrder(alphabetic = true)
public class LearnerConfiguration extends LearnerResumeConfiguration implements Serializable {

    private static final long serialVersionUID = -5130245647384793948L;

    /** The maximum length of a comment. */
    private static final int MAX_COMMENT_LENGTH = 255;

    /**
     * Link to the Symbols that are used during the learning.
     * @requiredField
     */
    private Set<Long> symbolsAsIds;

    /**
     * Link to the Symbols that should be used as a reset Symbol.
     * @requiredField
     */
    private Long resetSymbolAsId;

    /**
     * The algorithm to be used during the learning.
     * @requiredField
     */
    private Algorithm algorithm;

    /** The browser to use during the learn process. */
    private BrowserConfig browser;

    /** A shot comment to describe the learn set up. */
    private String comment;

    /**
     * Default constructor.
     */
    public LearnerConfiguration() {
        this.symbolsAsIds = new HashSet<>();
        this.algorithm = new Algorithm("TTT", "");
        this.comment = "";
        this.browser = new BrowserConfig();
    }

    /**
     * Get a List of ids that describes the symbols to be used during the learning process.
     *
     * @return A List of ids referring to symbols that must be used during the learning.
     */
    @JsonProperty("symbols")
    public Set<Long> getSymbolsAsIds() {
        if (symbolsAsIds == null || symbolsAsIds.isEmpty()) {
            symbolsAsIds = new HashSet<>();
        }
        return symbolsAsIds;
    }

    /**
     * Set a List of ids to find all the symbols that must be used during a learning process.
     *
     * @param symbolsAsIds
     *         The List of ids to refer to symbols that must be used during the learning.
     */
    @JsonProperty("symbols")
    public void setSymbolsAsIds(Set<Long> symbolsAsIds) {
        this.symbolsAsIds = symbolsAsIds;
    }

    /**
     * Get the id of the reset symbol.
     *
     * @return The link to the reset symbol.
     */
    @JsonProperty("resetSymbol")
    public Long getResetSymbolAsId() {
        return resetSymbolAsId;
    }

    /**
     * Set the id of the reset symbol. This updates not the reset symbol itself.
     *
     * @param resetSymbolAsId
     *         The new id of the reset symbol.
     */
    public void setResetSymbolAsId(Long resetSymbolAsId) {
        this.resetSymbolAsId = resetSymbolAsId;
    }

    /**
     * Get the LearnerAlgorithm that should be used for the learning process.
     *
     * @return The selected LearnerAlgorithm.
     */
    @Embedded
    @JsonSerialize(using = AlgorithmSerializer.class)
    @JsonDeserialize(using = AlgorithmDeserializer.class)
    public Algorithm getAlgorithm() {
        return algorithm;
    }

    /**
     * Set a new LearnerAlgorithm to use for the learning.
     *
     * @param algorithm
     *         The new algorithm to be used.
     */
    public void setAlgorithm(Algorithm algorithm) {
        this.algorithm = algorithm;
    }

    /**
     * @return The browser to use for the learning.
     */
    public BrowserConfig getBrowser() {
        return browser;
    }

    /**
     * @param browser The new browser to use for the learning process.
     */
    public void setBrowser(BrowserConfig browser) {
        this.browser = browser;
    }

    /**
     * Get the current comment for the learn setup.
     *
     * @return The current comment.
     */
    @Size(max = MAX_COMMENT_LENGTH)
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
