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

package de.learnlib.alex.learning.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.learning.entities.TestSuiteGenerationConfig;
import de.learnlib.alex.learning.entities.algorithms.AbstractLearningAlgorithm;
import de.learnlib.alex.testing.dao.TestDAO;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.algorithms.discriminationtree.hypothesis.HState;
import de.learnlib.algorithms.discriminationtree.mealy.DTLearnerMealy;
import de.learnlib.algorithms.ttt.base.BaseTTTDiscriminationTree;
import de.learnlib.algorithms.ttt.base.TTTState;
import de.learnlib.algorithms.ttt.mealy.TTTLearnerMealy;
import de.learnlib.api.algorithm.LearningAlgorithm;
import de.learnlib.datastructure.discriminationtree.MultiDTree;
import de.learnlib.datastructure.discriminationtree.model.AbstractDTNode;
import de.learnlib.datastructure.discriminationtree.model.AbstractDiscriminationTree;
import de.learnlib.datastructure.discriminationtree.model.AbstractWordBasedDiscriminationTree;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Generate a test suite from a discrimination tree in a learner results. Credits to Philipp Koch.
 */
@Service
public class TestGenerator {

    /** The injected DAO for learner results. */
    private final LearnerResultDAO learnerResultDAO;

    /** The injected DAO for tests. */
    private final SymbolDAO symbolDAO;

    /** The injected DAO for symbols. */
    private final TestDAO testDAO;

    /**
     * Constructor.
     *
     * @param learnerResultDAO
     *         The injected DAO for learner results.
     * @param testDAO
     *         The injected DAO for tests.
     * @param symbolDAO
     *         The injected DAO for symbols.
     */
    @Inject
    public TestGenerator(LearnerResultDAO learnerResultDAO, TestDAO testDAO, SymbolDAO symbolDAO) {
        this.learnerResultDAO = learnerResultDAO;
        this.testDAO = testDAO;
        this.symbolDAO = symbolDAO;
    }

    /**
     * Generate a test suite from the discrimination tree of a learner result.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param testNo
     *         The number of the learning experiment to generate the test suite from.
     * @param config
     *         The configuration object.
     * @return The generated test suite.
     * @throws NotFoundException
     *         If one of the entities could not be found.
     * @throws IOException
     *         If a learner state could not be deserialized.
     * @throws ClassNotFoundException
     *         If the learner state could not be cast to the correct class.
     */
    public TestSuite generate(User user, Long projectId, Long testNo, TestSuiteGenerationConfig config)
            throws NotFoundException, IOException, ClassNotFoundException {

        final LearnerResult result = learnerResultDAO.get(user, projectId, testNo, true);
        final LearnerResultStep step = result.getSteps().stream()
                .filter(s -> s.getStepNo().equals(config.getStepNo()))
                .findFirst()
                .orElseThrow(NotFoundException::new);

        // Restore the state of the learner so that one can access the discrimination tree.
        // Leave the mq oracle null since we don't want to continue learning.
        final Alphabet<String> alphabet = result.getHypothesis().createAlphabet();
        final AbstractLearningAlgorithm<String, String> algorithm = result.getAlgorithm();
        final LearningAlgorithm.MealyLearner<String, String> learner = algorithm.createLearner(alphabet, null);
        algorithm.resume(learner, step.getState());

        // create the new test suite
        final TestSuite testSuite = new TestSuite();
        testSuite.setName(config.getName());
        testSuite.setProjectId(projectId);
        testDAO.create(user, testSuite);

        // compute test cases based on the dt of the used algorithm.
        if (learner instanceof TTTLearnerMealy) {
            final TTTLearnerMealy<String, String> tttLearner = (TTTLearnerMealy<String, String>) learner;
            final BaseTTTDiscriminationTree<String, Word<String>> tree = tttLearner.getDiscriminationTree();
            computeTestCases(tree, TTTState::getAccessSequence, (as) -> tttLearner.getHypothesisModel()
                            .computeOutput(as),
                    Function.identity(), Function.identity(), result, config, user, projectId, testSuite);
        } else if (learner instanceof DTLearnerMealy) {
            final DTLearnerMealy<String, String> dtLearner = (DTLearnerMealy<String, String>) learner;
            final AbstractWordBasedDiscriminationTree<String, Word<String>, HState<String, Word<String>, Void, String>>
                    dtree = dtLearner.getDiscriminationTree();
            computeTestCases(dtree, HState::getAccessSequence, (as) -> dtLearner.getHypothesisModel().computeOutput(as),
                    Function.identity(), Function.identity(), result, config, user, projectId, testSuite);
        } else {
            throw new ValidationException("Can only generate test suites for TTT and DT algorithm.");
        }

        return testSuite;
    }

    private <DSCR, I, O, D, N extends AbstractDTNode<DSCR, O, D, N>> void computeTestCases(
            AbstractDiscriminationTree<DSCR, I, O, D, N> tree,
            Function<D, Word<String>> accessSequenceExtractor,
            Function<Word<String>, Word<String>> asTransformer,
            Function<DSCR, Word<String>> dscrExtractor,
            Function<O, Word<String>> outputExtractor,
            LearnerResult lr, TestSuiteGenerationConfig config, User user, Long projectId, TestSuite testSuite)
            throws NotFoundException {

        for (N e : tree) {
            if (e.isLeaf()) {
                Word<String> accessSequence = accessSequenceExtractor.apply(e.getData());
                Word<String> accessSequenceOutcome = asTransformer.apply(accessSequence);

                List<Long> accessSequenceAsIds =
                        new ArrayList<>(convertWordToSymbolIds(accessSequence, lr.getSymbols()));
                List<String> outcomeList = new ArrayList<>();
                List<Long> testCaseSymbols = new ArrayList<>();

                N nodeP = e;
                int testCaseNumber = 0;

                while (!(nodeP.isRoot())) {
                    outcomeList.addAll(convertWordToStringList(accessSequenceOutcome));
                    Word<String> inEdge = outputExtractor.apply(nodeP.getParentOutcome());

                    nodeP = nodeP.getParent();

                    DSCR discriminator = nodeP.getDiscriminator();
                    testCaseSymbols.addAll(accessSequenceAsIds);
                    testCaseSymbols.addAll(convertWordToSymbolIds(dscrExtractor.apply(discriminator), lr.getSymbols()));

                    final TestCase testCase = new TestCase();
                    if (tree instanceof MultiDTree) {
                        testCase.setName(config.getName() + " " + testCaseNumber);
                    } else {
                        testCase.setName(e.getData() + " " + config.getName() + " " + testCaseNumber);
                    }

                    setPreSteps(user, projectId, lr, testCase, config.isIncludeParameterValues());
                    setStepsBySymbolIds(testCase, testCaseSymbols, user, projectId, config.isIncludeParameterValues());
                    setPostSteps(user, projectId, lr, testCase, config.isIncludeParameterValues());
                    testCase.setProjectId(projectId);
                    testCase.setParent(testSuite);
                    testSuite.addTest(testCase);

                    outcomeList.addAll(convertWordToStringList(inEdge));
                    // TODO: interpret other output values than OK and FAILED
                    for (int i = 0; i < outcomeList.size(); i++) {
                        final TestCaseStep step = testCase.getSteps().get(i);
                        if (outcomeList.get(i).startsWith(ExecuteResult.DEFAULT_SUCCESS_OUTPUT)) {
                            step.setShouldFail(false);
                        } else if (outcomeList.get(i).startsWith(ExecuteResult.DEFAULT_ERROR_OUTPUT)) {
                            step.setShouldFail(true);
                        } else {
                            step.setShouldFail(false);
                        }
                    }

                    testDAO.create(user, testCase);

                    outcomeList.clear();
                    testCaseSymbols.clear();
                    testCaseNumber++;
                }

                accessSequenceAsIds.clear();
            } else if (e.isRoot() && e.getData() != null) {
                final List<Long> accessSequenceAsList =
                        convertWordToSymbolIds(accessSequenceExtractor.apply(e.getData()), lr.getSymbols());
                try {
                    final TestCase testCase = new TestCase();
                    testCase.setName(e.getData() + " " + config.getName());
                    testCase.setProjectId(projectId);
                    setPreSteps(user, projectId, lr, testCase, config.isIncludeParameterValues());
                    setStepsBySymbolIds(testCase, accessSequenceAsList, user, projectId, config.isIncludeParameterValues());
                    setPostSteps(user, projectId, lr, testCase, config.isIncludeParameterValues());
                    testCase.setParent(testSuite);
                    testDAO.create(user, testCase);
                } catch (Exception e1) {
                    e1.printStackTrace();
                }

                accessSequenceAsList.clear();
            }
        }
    }

    private void setPreSteps(User user, Long projectId, LearnerResult result, TestCase testCase, boolean includeValues)
            throws NotFoundException {
        final TestCaseStep preStep = new TestCaseStep();
        preStep.setTestCase(testCase);
        preStep.setSymbol(symbolDAO.get(user, projectId, result.getResetSymbol().getSymbol().getId()));
        preStep.setParameterValues(
                result.getResetSymbol().getParameterValues().stream().map(pv -> {
                    final SymbolParameterValue value = new SymbolParameterValue();
                    value.setParameter(pv.getParameter());
                    value.setValue(includeValues ? pv.getValue() : null);
                    return value;
                }).collect(Collectors.toList())
        );
        testCase.getPreSteps().addAll(Collections.singletonList(preStep));
    }

    private void setPostSteps(User user, Long projectId, LearnerResult result, TestCase testCase, boolean includeValues)
            throws NotFoundException {
        if (result.getPostSymbol() != null) {
            final TestCaseStep postStep = new TestCaseStep();
            postStep.setTestCase(testCase);
            postStep.setSymbol(symbolDAO.get(user, projectId, result.getPostSymbol().getSymbol().getId()));
            postStep.setParameterValues(
                    result.getPostSymbol().getParameterValues().stream().map(pv -> {
                        final SymbolParameterValue value = new SymbolParameterValue();
                        value.setParameter(pv.getParameter());
                        value.setValue(includeValues ? pv.getValue() : null);
                        return value;
                    }).collect(Collectors.toList())
            );
            testCase.getPostSteps().addAll(Collections.singletonList(postStep));
        }
    }

    private void setStepsBySymbolIds(TestCase testCase, List<Long> symbolIds, User user, Long projectId,
            boolean includeValues) throws NotFoundException {
        final Map<Long, Symbol> symbolMap = symbolDAO.getByIds(user, projectId, symbolIds).stream()
                .collect(Collectors.toMap(Symbol::getId, Function.identity()));

        for (Long id : symbolIds) {
            final TestCaseStep step = new TestCaseStep();
            step.setTestCase(testCase);
            step.setSymbol(symbolMap.get(id));
            step.setParameterValues(
                    symbolMap.get(id).getInputs().stream().map(input -> {
                        final SymbolParameterValue value = new SymbolParameterValue();
                        value.setParameter(input);
                        // TODO: parse input values from input
                        return value;
                    }).collect(Collectors.toList())
            );
            testCase.getSteps().add(step);
        }
    }

    private List<String> convertWordToStringList(Word<String> word) {
        return word.stream().collect(Collectors.toList());
    }

    private List<Long> convertWordToSymbolIds(Word<String> word, List<ParameterizedSymbol> pSymbols) {
        final Map<String, Symbol> symbolMap = pSymbols.stream()
                .collect(Collectors.toMap(ParameterizedSymbol::getComputedName, ParameterizedSymbol::getSymbol));

        return word.stream().map(symbol -> symbolMap.get(symbol).getId()).collect(Collectors.toList());
    }
}
