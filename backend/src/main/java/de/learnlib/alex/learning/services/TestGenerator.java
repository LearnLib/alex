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

package de.learnlib.alex.learning.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
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
import de.learnlib.datastructure.discriminationtree.model.AbstractDTNode;
import de.learnlib.datastructure.discriminationtree.model.AbstractDiscriminationTree;
import de.learnlib.datastructure.discriminationtree.model.AbstractWordBasedDiscriminationTree;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.util.automata.conformance.WMethodTestsIterator;
import net.automatalib.util.automata.conformance.WpMethodTestsIterator;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Generate a test suite from a discrimination tree in a learner results. Credits to Philipp Koch.
 */
@Service
public class TestGenerator {

    /** The injected DAO for learner results. */
    private final LearnerResultDAO learnerResultDAO;

    /** The project DAO to use. */
    private final ProjectDAO projectDAO;

    /** The injected DAO for symbols. */
    private final TestDAO testDAO;

    /**
     * Constructor.
     *
     * @param learnerResultDAO
     *         The injected DAO for learner results.
     * @param testDAO
     *         The injected DAO for tests.
     */
    @Inject
    public TestGenerator(LearnerResultDAO learnerResultDAO, TestDAO testDAO, ProjectDAO projectDAO) {
        this.learnerResultDAO = learnerResultDAO;
        this.testDAO = testDAO;
        this.projectDAO = projectDAO;
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

        final Project project = projectDAO.getByID(user, projectId);

        // create the new test suite
        final TestSuite testSuite = new TestSuite();
        testSuite.setName(config.getName());
        testSuite.setProject(project);
        testDAO.create(user, testSuite);

        switch (config.getMethod()) {
            case DT:
                if (learner instanceof TTTLearnerMealy) {
                    final TTTLearnerMealy<String, String> tttLearner = (TTTLearnerMealy<String, String>) learner;
                    final BaseTTTDiscriminationTree<String, Word<String>> tree = tttLearner.getDiscriminationTree();
                    computeTestCasesDt(tree, TTTState::getAccessSequence, (as) -> tttLearner.getHypothesisModel()
                                    .computeOutput(as),
                            Function.identity(), Function.identity(), result, config, user, project, testSuite);
                } else if (learner instanceof DTLearnerMealy) {
                    final DTLearnerMealy<String, String> dtLearner = (DTLearnerMealy<String, String>) learner;
                    final AbstractWordBasedDiscriminationTree<String, Word<String>, HState<String, Word<String>, Void, String>>
                            dtree = dtLearner.getDiscriminationTree();
                    computeTestCasesDt(dtree, HState::getAccessSequence, (as) -> dtLearner.getHypothesisModel()
                                    .computeOutput(as),
                            Function.identity(), Function.identity(), result, config, user, project, testSuite);
                } else {
                    throw new ValidationException("Can only generate test suites for TTT and DT algorithm.");
                }
                break;
            case W_METHOD:
                computeTestCasesWMethod(learner.getHypothesisModel(), user, project, testSuite, result, config,
                        new WMethodTestsIterator<>(learner.getHypothesisModel(), result.getSigma(), 0));
                break;
            case WP_METHOD:
                computeTestCasesWMethod(learner.getHypothesisModel(), user, project, testSuite, result, config,
                        new WpMethodTestsIterator<>(learner.getHypothesisModel(), result.getSigma(), 0));
                break;
            default:
                break;
        }

        return testSuite;
    }

    private void computeTestCasesWMethod(MealyMachine<?, String, ?, String> hypothesis, User user, Project project,
                                         TestSuite testSuite, LearnerResult lr, TestSuiteGenerationConfig config,
                                         Iterator<Word<String>> testsIterator) throws NotFoundException {
        int testNum = 0;
        while (testsIterator.hasNext()) {
            final Word<String> word = testsIterator.next();
            final List<Long> pSymbolIds = convertWordToPSymbolIds(word, lr.getSymbols());
            final TestCase testCase = new TestCase();
            testCase.setName(String.valueOf(testNum++));
            createTestCase(user, testSuite, testCase, project, lr, config, pSymbolIds, hypothesis.computeOutput(word));
        }
    }

    private <DSCR, I, O, D, N extends AbstractDTNode<DSCR, O, D, N>> void computeTestCasesDt(
            AbstractDiscriminationTree<DSCR, I, O, D, N> tree,
            Function<D, Word<String>> accessSequenceExtractor,
            Function<Word<String>, Word<String>> asTransformer,
            Function<DSCR, Word<String>> dscrExtractor,
            Function<O, Word<String>> outputExtractor,
            LearnerResult lr, TestSuiteGenerationConfig config, User user, Project project, TestSuite testSuite)
            throws NotFoundException {

        int i = 0;

        for (N e : tree) {
            if (e.isLeaf()) {
                Word<String> accessSequence = accessSequenceExtractor.apply(e.getData());
                Word<String> accessSequenceOutcome = asTransformer.apply(accessSequence);

                List<Long> accessSequenceAsIds =
                        new ArrayList<>(convertWordToPSymbolIds(accessSequence, lr.getSymbols()));
                List<String> outcomeList = new ArrayList<>();
                List<Long> testCaseSymbols = new ArrayList<>();

                N nodeP = e;

                while (!(nodeP.isRoot())) {
                    outcomeList.addAll(convertWordToStringList(accessSequenceOutcome));
                    Word<String> inEdge = outputExtractor.apply(nodeP.getParentOutcome());

                    nodeP = nodeP.getParent();

                    DSCR discriminator = nodeP.getDiscriminator();
                    testCaseSymbols.addAll(accessSequenceAsIds);
                    testCaseSymbols.addAll(convertWordToPSymbolIds(dscrExtractor.apply(discriminator), lr.getSymbols()));

                    final TestCase testCase = new TestCase();
                    testCase.setName(String.valueOf(i++));

                    outcomeList.addAll(convertWordToStringList(inEdge));
                    createTestCase(user, testSuite, testCase, project, lr, config, testCaseSymbols, Word.fromList(outcomeList));

                    outcomeList.clear();
                    testCaseSymbols.clear();
                }

                accessSequenceAsIds.clear();
            } else if (e.isRoot() && e.getData() != null) {
                final List<Long> accessSequenceAsList =
                        convertWordToPSymbolIds(accessSequenceExtractor.apply(e.getData()), lr.getSymbols());

                final TestCase testCase = new TestCase();
                testCase.setName(String.valueOf(i++));
                testCase.setProject(project);
                setSteps(lr.getResetSymbol(), testCase, testCase.getPreSteps(), config.isIncludeParameterValues());
                setStepsByPSymbolIds(lr, testCase, accessSequenceAsList, config.isIncludeParameterValues());
                setSteps(lr.getPostSymbol(), testCase, testCase.getPostSteps(), config.isIncludeParameterValues());
                testCase.setParent(testSuite);
                testDAO.create(user, testCase);

                accessSequenceAsList.clear();
            }
        }
    }

    private void createTestCase(User user, TestSuite testSuite, TestCase testCase, Project project, LearnerResult lr,
            TestSuiteGenerationConfig config, List<Long> pSymbolIds, Word<String> outputs) throws NotFoundException {
        setSteps(lr.getResetSymbol(), testCase, testCase.getPreSteps(), config.isIncludeParameterValues());
        setStepsByPSymbolIds(lr, testCase, pSymbolIds, config.isIncludeParameterValues());
        setSteps(lr.getPostSymbol(), testCase, testCase.getPostSteps(), config.isIncludeParameterValues());
        testCase.setProject(project);
        testCase.setParent(testSuite);
        testSuite.addTest(testCase);

        for (int i = 0; i < outputs.size(); i++) {
            final TestCaseStep step = testCase.getSteps().get(i);
            final String sym = outputs.getSymbol(i);
            step.setExpectedOutputSuccess(sym.startsWith(ExecuteResult.DEFAULT_SUCCESS_OUTPUT));
            step.setExpectedOutputMessage(getExpectedOutputMessage(sym));
        }

        testDAO.createByGenerate(user, testCase);
    }

    private String getExpectedOutputMessage(String output) {
        final Pattern p = Pattern.compile("^(Ok | Failed )\\((.*?)\\)$");
        final Matcher m = p.matcher(output);
        return m.matches() ? m.group(2) : "";
    }

    private void setSteps(ParameterizedSymbol pSymbol, TestCase testCase, List<TestCaseStep> stepList,
            boolean includeValues) {
        if (pSymbol != null) { // It can be that e.g. the post symbol has not been used
            final TestCaseStep step = new TestCaseStep();
            step.setTestCase(testCase);
            step.setPSymbol(pSymbol.copy());
            if (!includeValues) {
                step.getPSymbol().getParameterValues().forEach(value -> value.setValue(null));
            }
            stepList.add(step);
        }
    }

    private void setStepsByPSymbolIds(LearnerResult result, TestCase testCase, List<Long> pSymbolIds,
            boolean includeValues) throws NotFoundException {
        final Map<Long, ParameterizedSymbol> pSymbolMap = result.getSymbols().stream()
                .collect(Collectors.toMap(ParameterizedSymbol::getId, Function.identity()));

        for (Long id : pSymbolIds) {
            setSteps(pSymbolMap.get(id), testCase, testCase.getSteps(), includeValues);
        }
    }

    private List<String> convertWordToStringList(Word<String> word) {
        return word.stream().collect(Collectors.toList());
    }

    private List<Long> convertWordToPSymbolIds(Word<String> word, List<ParameterizedSymbol> pSymbols) {
        final Map<String, ParameterizedSymbol> symbolMap = pSymbols.stream()
                .collect(Collectors.toMap(ParameterizedSymbol::getComputedName, Function.identity()));

        return word.stream().map(symbol -> symbolMap.get(symbol).getId()).collect(Collectors.toList());
    }
}
