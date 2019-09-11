/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.data.entities;

import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.testing.entities.TestCase;

import java.util.HashSet;
import java.util.Set;

public class SymbolUsageResult {

    private Set<Symbol> symbols;
    private Set<TestCase> testCases;
    private Set<LearnerResult> learnerResults;

    public SymbolUsageResult() {
        this.symbols = new HashSet<>();
        this.testCases = new HashSet<>();
        this.learnerResults = new HashSet<>();
    }

    public Set<Symbol> getSymbols() {
        return symbols;
    }

    public void setSymbols(Set<Symbol> symbols) {
        this.symbols = symbols;
    }

    public Set<TestCase> getTestCases() {
        return testCases;
    }

    public void setTestCases(Set<TestCase> testCases) {
        this.testCases = testCases;
    }

    public Set<LearnerResult> getLearnerResults() {
        return learnerResults;
    }

    public void setLearnerResults(Set<LearnerResult> learnerResults) {
        this.learnerResults = learnerResults;
    }

    public boolean isInUse() {
        return symbols.size() + testCases.size() + learnerResults.size() > 0;
    }
}
