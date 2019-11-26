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

package de.learnlib.alex.learning.entities.learnlibproxies.eqproxies;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.api.oracle.EquivalenceOracle;
import de.learnlib.api.oracle.MembershipOracle;
import de.learnlib.api.query.DefaultQuery;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.words.Word;

import javax.annotation.Nullable;
import java.io.Serializable;
import java.util.ArrayDeque;
import java.util.Collection;
import java.util.Queue;
import java.util.stream.Collectors;

/**
 * Use tests in a test suite as equivalence oracle.
 */
@JsonTypeName("test_suite")
public class TestSuiteEQOracleProxy extends AbstractEquivalenceOracleProxy
        implements Serializable, EquivalenceOracle.MealyEquivalenceOracle<String, String> {

    /** The ID of the test suite to use for testing. */
    private Long testSuiteId;

    /** If test cases of child test suites should be included as well. */
    private boolean includeChildTestSuites;

    /** The mq oracle. */
    private MembershipOracle<String, Word<String>> oracle;

    /** How many membership queries can be posed together. */
    private int batchSize;

    /** The test cases in the test suite. Once a test case has been tried, it is removed from the queue. */
    private Queue<Word<String>> testCases;

    /** Constructor. */
    public TestSuiteEQOracleProxy() {
        this.testCases = new ArrayDeque<>();
        this.includeChildTestSuites = false;
    }

    /**
     * Constructor.
     *
     * @param testSuiteId
     *         The ID of the test suite to use.
     * @param testDAO
     *         The test DAO.
     * @param user
     *         The user that is learning.
     * @param result
     *         The current learner result that is used for getting relevant input symbols.
     * @param oracle
     *         The oracle to use.
     * @param batchSize
     *         How many membership queries can be posed together.
     */
    public TestSuiteEQOracleProxy(Long testSuiteId, TestDAO testDAO, User user, LearnerResult result,
            MembershipOracle<String, Word<String>> oracle, int batchSize) {
        this();
        this.testSuiteId = testSuiteId;
        this.oracle = oracle;
        this.batchSize = batchSize;

        try {
            testDAO.getTestCases(user, result.getProjectId(), testSuiteId, includeChildTestSuites).forEach(tc -> {
                final Word<String> input = Word.fromList(
                        tc.getSteps().stream()
                                .map(step -> step.getPSymbol().getAliasOrComputedName())
                                .collect(Collectors.toList())
                );
                testCases.add(input);
            });
        } catch (Exception e) {
            // if something does not work, we use an empty collection which simply results in no counterexample being found.
            e.printStackTrace();
        }
    }

    @Override
    public void checkParameters() throws IllegalArgumentException {
        if (testSuiteId == null || testSuiteId < 0) {
            throw new IllegalArgumentException("The ID of the test suite has to be >= 0");
        }
    }

    @Override
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            MembershipOracle<String, Word<String>> membershipOracle) {
        throw new UnsupportedOperationException("Cannot call this method on this class.");
    }

    /**
     * Create an instance of the equivalence oracle. Use this method instead of the default one since we require more
     * classes to be available as the standard API.
     *
     * @param membershipOracle
     *         The membership oracle.
     * @param testDAO
     *         The test DAO.
     * @param user
     *         The current user.
     * @param result
     *         The current result.
     * @return An instance of the equivalence oracle.
     */
    public EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>> createEqOracle(
            MembershipOracle<String, Word<String>> membershipOracle, TestDAO testDAO, User user,
            LearnerResult result) {
        return new TestSuiteEQOracleProxy(testSuiteId, testDAO, user, result, membershipOracle, batchSize);
    }

    @Nullable
    @Override
    public DefaultQuery<String, Word<String>> findCounterExample(MealyMachine<?, String, ?, String> hyp,
            Collection<? extends String> alphabet) {

        while (!testCases.isEmpty()) {
            try {
                final Word<String> input = testCases.poll();
                final Word<String> hypOutput = hyp.computeOutput(input);
                final Word<String> sulOutput = oracle.answerQuery(input);

                if (!hypOutput.equals(sulOutput)) {
                    final DefaultQuery<String, Word<String>> ce = new DefaultQuery<>(input);
                    ce.answer(sulOutput);
                    return ce;
                }
            } catch (Exception e) {
                // if something does not work, we simply skip the word.
                e.printStackTrace();
            }
        }

        return null;
    }

    public Long getTestSuiteId() {
        return testSuiteId;
    }

    public void setTestSuiteId(Long testSuiteId) {
        this.testSuiteId = testSuiteId;
    }

    public boolean isIncludeChildTestSuites() {
        return includeChildTestSuites;
    }

    public void setIncludeChildTestSuites(boolean includeChildTestSuites) {
        this.includeChildTestSuites = includeChildTestSuites;
    }
}
