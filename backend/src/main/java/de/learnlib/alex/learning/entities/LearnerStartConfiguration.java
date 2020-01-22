/*
 * Copyright 2015 - 2020 TU Dortmund
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

package de.learnlib.alex.learning.entities;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.learning.entities.algorithms.AbstractLearningAlgorithm;
import de.learnlib.alex.learning.entities.algorithms.TTT;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import de.learnlib.alex.learning.entities.webdrivers.HtmlUnitDriverConfig;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity to hold the information and parameters to configure a learn process.
 */
@JsonPropertyOrder(alphabetic = true)
public class LearnerStartConfiguration extends AbstractLearnerConfiguration implements Serializable {

    private static final long serialVersionUID = -5130245647384793948L;

    /** The maximum length of a comment. */
    private static final int MAX_COMMENT_LENGTH = 255;

    /** Link to the Symbols that are used during the learning. */
    @NotEmpty
    private List<ParameterizedSymbol> symbols;

    /** Link to the Symbols that should be used as a reset symbol. */
    @NotNull
    private ParameterizedSymbol resetSymbol;

    /** The symbol that is executed after a membership query. */
    private ParameterizedSymbol postSymbol;

    /** The algorithm to be used during the learning. */
    @NotNull
    private AbstractLearningAlgorithm<String, String> algorithm;

    /** The browser to use during the learn process. */
    @NotNull
    private AbstractWebDriverConfig driverConfig;

    /** A shot comment to describe the learn set up. */
    private String comment;

    /** If membership queries should be cached. */
    @NotNull
    private boolean useMQCache;

    /** Constructor. */
    public LearnerStartConfiguration() {
        super();
        this.symbols = new ArrayList<>();
        this.algorithm = new TTT();
        this.comment = "";
        this.driverConfig = new HtmlUnitDriverConfig();
        this.useMQCache = true;
    }

    @Override
    public void checkConfiguration() throws IllegalArgumentException {
        super.check();
    }

    public List<ParameterizedSymbol> getSymbols() {
        return symbols;
    }

    public void setSymbols(List<ParameterizedSymbol> symbols) {
        this.symbols = symbols;
    }

    public ParameterizedSymbol getResetSymbol() {
        return resetSymbol;
    }

    public void setResetSymbol(ParameterizedSymbol resetSymbol) {
        this.resetSymbol = resetSymbol;
    }

    public ParameterizedSymbol getPostSymbol() {
        return postSymbol;
    }

    public void setPostSymbol(ParameterizedSymbol postSymbol) {
        this.postSymbol = postSymbol;
    }

    public AbstractLearningAlgorithm<String, String> getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(AbstractLearningAlgorithm<String, String> algorithm) {
        this.algorithm = algorithm;
    }

    public AbstractWebDriverConfig getDriverConfig() {
        return driverConfig;
    }

    public void setDriverConfig(AbstractWebDriverConfig driverConfig) {
        this.driverConfig = driverConfig;
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
