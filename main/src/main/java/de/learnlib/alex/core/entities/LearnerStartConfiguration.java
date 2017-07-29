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
import de.learnlib.alex.core.entities.algorithms.AbstractLearningAlgorithm;
import de.learnlib.alex.core.entities.algorithms.TTT;

import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity to hold the information and parameters to configure a learn process.
 */
@JsonPropertyOrder(alphabetic = true)
public class LearnerStartConfiguration extends LearnerConfiguration implements Serializable {

    private static final long serialVersionUID = -5130245647384793948L;

    /** The maximum length of a comment. */
    private static final int MAX_COMMENT_LENGTH = 255;

    /** Link to the Symbols that are used during the learning. */
    private List<Long> symbolsAsIds;

    /** Link to the Symbols that should be used as a reset symbol. */
    private Long resetSymbolAsId;

    /** The algorithm to be used during the learning. */
    private AbstractLearningAlgorithm<String, String> algorithm;

    /** The browser to use during the learn process. */
    private BrowserConfig browser;

    /** A shot comment to describe the learn set up. */
    private String comment;

    /** If membership queries should be cached. */
    private boolean useMQCache;

    /** Constructor. */
    public LearnerStartConfiguration() {
        super();
        this.symbolsAsIds = new ArrayList<>();
        this.algorithm = new TTT();
        this.comment = "";
        this.browser = new BrowserConfig();
        this.useMQCache = true;
    }

    @Override
    public void checkConfiguration() throws IllegalArgumentException {
        super.check();
    }

    @JsonProperty("symbols")
    public List<Long> getSymbolsAsIds() {
        if (symbolsAsIds == null || symbolsAsIds.isEmpty()) {
            symbolsAsIds = new ArrayList<>();
        }
        return symbolsAsIds;
    }

    @JsonProperty("symbols")
    public void setSymbolsAsIds(List<Long> symbolsAsIds) {
        this.symbolsAsIds = symbolsAsIds;
    }

    @JsonProperty("resetSymbol")
    public Long getResetSymbolAsId() {
        return resetSymbolAsId;
    }

    public void setResetSymbolAsId(Long resetSymbolAsId) {
        this.resetSymbolAsId = resetSymbolAsId;
    }

    public AbstractLearningAlgorithm<String, String> getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(AbstractLearningAlgorithm<String, String> algorithm) {
        this.algorithm = algorithm;
    }

    public BrowserConfig getBrowser() {
        return browser;
    }

    public void setBrowser(BrowserConfig browser) {
        this.browser = browser;
    }

    @Size(max = MAX_COMMENT_LENGTH)
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public boolean isUseMQCache() {
        return useMQCache;
    }

    public void setUseMQCache(boolean useMQCache) {
        this.useMQCache = useMQCache;
    }
}
