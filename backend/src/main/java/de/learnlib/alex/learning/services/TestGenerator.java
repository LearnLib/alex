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
import de.learnlib.alex.testing.entities.Test;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.entities.TestSuite;
import de.learnlib.alex.testing.repositories.TestRepository;
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
import net.automatalib.util.automata.Automata;
import net.automatalib.util.automata.conformance.WMethodTestsIterator;
import net.automatalib.util.automata.conformance.WpMethodTestsIterator;
import net.automatalib.words.Alphabet;
import net.automatalib.words.Word;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private final LearnerResultDAO learnerResultDAO;
    private final ProjectDAO projectDAO;
    private final TestDAO testDAO;
    private TestRepository testRepository;

    @Inject
    public TestGenerator(LearnerResultDAO learnerResultDAO,
                         TestDAO testDAO,
                         ProjectDAO projectDAO,
                         TestRepository testRepository) {
        this.learnerResultDAO = learnerResultDAO;
        this.testDAO = testDAO;
        this.projectDAO = projectDAO;
        this.testRepository = testRepository;
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
    @Transactional(rollbackFor = Exception.class)
    public TestSuite generate(User user, Long projectId, Long testNo, TestSuiteGenerationConfig config)
            throws NotFoundException, IOException, ClassNotFoundException {

        final LearnerResult result = learnerResultDAO.get(user, projectId, testNo, true);
        final LearnerResultStep step = result.getSteps().stream()
                .filter(s -> s.getStepNo().equals(config.getStepNo()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("The step number could not be found."));

        // Restore the state of the learner so that one can access the discrimination tree.
        // Leave the mq oracle null since we don't want to continue learning.
        final Alphabet<String> alphabet = result.getSteps().get(result.getSteps().size() - 1).getHypothesis().createAlphabet();
        final AbstractLearningAlgorithm<String, String> algorithm = result.getAlgorithm();
        final LearningAlgorithm.MealyLearner<String, String> learner = algorithm.createLearner(alphabet, null);
        algorithm.resume(learner, step.getState());

        final Project project = projectDAO.getByID(user, projectId);

        final TestSuite testSuite;
        if (config.getTestSuiteToUpdateId() == null) {
            // create the new test suite
            final TestSuite generatedTestSuite = new TestSuite();
            generatedTestSuite.setName(config.getName());
            generatedTestSuite.setProject(project);
            testSuite = (TestSuite) testDAO.create(user, projectId, generatedTestSuite);
        } else {
            final TestSuite ts = (TestSuite) testDAO.get(user, projectId, config.getTestSuiteToUpdateId());
            final List<Long> testIdsToDelete = ts.getTests().stream()
                    .filter(t -> t instanceof TestCase && ((TestCase) t).isGenerated())
                    .map(Test::getId)
                    .collect(Collectors.toList());
            testDAO.delete(user, projectId, testIdsToDelete);
            testSuite = (TestSuite) testDAO.get(user, projectId, ts.getId());
        }

        final List<TestCase> generatedTestCases = new ArrayList<>();

        final Function <String, TestCase> testCaseFn = (n) -> _createTestCase(user, project, testSuite, n);

        switch (config.getMethod()) {
            case DT:
                if (learner instanceof TTTLearnerMealy) {
                    final TTTLearnerMealy<String, String> tttLearner = (TTTLearnerMealy<String, String>) learner;
                    final BaseTTTDiscriminationTree<String, Word<String>> tree = tttLearner.getDiscriminationTree();
                    computeTestCasesDt(testCaseFn, tree, TTTState::getAccessSequence, (as) -> tttLearner.getHypothesisModel().computeOutput(as),
                            Function.identity(), Function.identity(), result, generatedTestCases);
                } else if (learner instanceof DTLearnerMealy) {
                    final DTLearnerMealy<String, String> dtLearner = (DTLearnerMealy<String, String>) learner;
                    final AbstractWordBasedDiscriminationTree<String, Word<String>, HState<String, Word<String>, Void, String>>
                            dtree = dtLearner.getDiscriminationTree();
                    computeTestCasesDt(testCaseFn, dtree, HState::getAccessSequence, (as) -> dtLearner.getHypothesisModel().computeOutput(as),
                            Function.identity(), Function.identity(), result, generatedTestCases);
                } else {
                    throw new ValidationException("Can only generate test suites for TTT and DT algorithm.");
                }
                break;
            case W_METHOD:
                computeTestCasesWMethod(testCaseFn, learner.getHypothesisModel(), result, new WMethodTestsIterator<>(learner.getHypothesisModel(), result.getSigma(), 0), generatedTestCases);
                break;
            case WP_METHOD:
                computeTestCasesWMethod(testCaseFn, learner.getHypothesisModel(), result, new WpMethodTestsIterator<>(learner.getHypothesisModel(), result.getSigma(), 0), generatedTestCases);
                break;
            case TRANS_COVER:
                computeTestCasesTransCover(testCaseFn, learner.getHypothesisModel(), result, alphabet, generatedTestCases);
            default:
                break;
        }

        for (TestCase tc: testSuite.getTestCases()) {
            testDAO.update(user, project.getId(), tc);
        }

        return testSuite;
    }

    private void computeTestCasesWMethod(Function<String, TestCase> createTestCaseFn,
                                         MealyMachine<?, String, ?, String> hypothesis,
                                         LearnerResult lr, Iterator<Word<String>> testsIterator,
                                         List<TestCase> generatedTestCases) throws NotFoundException {
        int testNum = 0;
        while (testsIterator.hasNext()) {
            final Word<String> word = testsIterator.next();
            final List<Long> pSymbolIds = convertWordToPSymbolIds(word, lr.getSymbols());
            final TestCase testCase = createTestCaseFn.apply(String.valueOf(testNum++));
            setTestCaseSteps(testCase, lr, pSymbolIds, hypothesis.computeOutput(word), generatedTestCases);
        }
    }

    private void computeTestCasesTransCover(Function<String, TestCase> createTestCaseFn,
                                            MealyMachine<?, String, ?, String> hypothesis,
                                            LearnerResult lr, Alphabet<String> alphabet,
                                            List<TestCase> generatedTestCases)
            throws NotFoundException {

        int testNum = 0;
        for (Word<String> word: Automata.transitionCover(hypothesis, alphabet)) {
            final List<Long> pSymbolIds = convertWordToPSymbolIds(word, lr.getSymbols());
            final TestCase testCase = createTestCaseFn.apply(String.valueOf(testNum++));
            setTestCaseSteps(testCase, lr, pSymbolIds, hypothesis.computeOutput(word), generatedTestCases);
        }
    }

    private <DSCR, I, O, D, N extends AbstractDTNode<DSCR, O, D, N>> void computeTestCasesDt(
            Function<String, TestCase> createTestCaseFn,
            AbstractDiscriminationTree<DSCR, I, O, D, N> tree,
            Function<D, Word<String>> accessSequenceExtractor,
            Function<Word<String>, Word<String>> asTransformer,
            Function<DSCR, Word<String>> dscrExtractor,
            Function<O, Word<String>> outputExtractor,
            LearnerResult lr, List<TestCase> generatedTestCases)
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

                    final TestCase testCase = createTestCaseFn.apply(String.valueOf(i++));

                    outcomeList.addAll(convertWordToStringList(inEdge));
                    setTestCaseSteps(testCase, lr, testCaseSymbols, Word.fromList(outcomeList), generatedTestCases);

                    outcomeList.clear();
                    testCaseSymbols.clear();
                }

                accessSequenceAsIds.clear();
            } else if (e.isRoot() && e.getData() != null) {
                final List<Long> accessSequenceAsList =
                        convertWordToPSymbolIds(accessSequenceExtractor.apply(e.getData()), lr.getSymbols());

                final TestCase testCase = createTestCaseFn.apply(String.valueOf(i++));
                setTestCaseSteps(testCase, lr, accessSequenceAsList, Word.epsilon(), generatedTestCases);
                accessSequenceAsList.clear();
            }
        }
    }

    private TestCase _createTestCase(User user, Project project, TestSuite parent, String name) {
        final TestCase tc = new TestCase();
        tc.setProject(project);
        tc.setName(name);
        tc.setParent(parent);
        tc.setGenerated(true);
        return (TestCase) testDAO.create(user, project.getId(), tc);
    }

    private void setTestCaseSteps(TestCase testCase, LearnerResult lr, List<Long> pSymbolIds,
                                  Word<String> outputs, List<TestCase> generatedTestCases)
            throws NotFoundException {
        setSteps(lr.getResetSymbol(), testCase, testCase.getPreSteps());
        setStepsByPSymbolIds(lr, testCase, pSymbolIds);
        setSteps(lr.getPostSymbol(), testCase, testCase.getPostSteps());

        for (int i = 0; i < outputs.size(); i++) {
            final TestCaseStep step = testCase.getSteps().get(i);
            final String sym = outputs.getSymbol(i);
            step.setExpectedOutputSuccess(sym.startsWith(ExecuteResult.DEFAULT_SUCCESS_OUTPUT));
            step.setExpectedOutputMessage(getExpectedOutputMessage(sym));
        }

        generatedTestCases.add(testCase);
    }

    private String getExpectedOutputMessage(String output) {
        final Pattern p = Pattern.compile("^(Ok | Failed )\\((.*?)\\)$");
        final Matcher m = p.matcher(output);
        return m.matches() ? m.group(2) : "";
    }

    private void setSteps(ParameterizedSymbol pSymbol, TestCase testCase, List<TestCaseStep> stepList) {
        if (pSymbol != null) { // It can be that e.g. the post symbol has not been used
            final TestCaseStep step = new TestCaseStep();
            step.setTestCase(testCase);
            step.setPSymbol(pSymbol.copy());
            stepList.add(step);
        }
    }

    private void setStepsByPSymbolIds(LearnerResult result, TestCase testCase, List<Long> pSymbolIds) throws NotFoundException {
        final Map<Long, ParameterizedSymbol> pSymbolMap = result.getSymbols().stream()
                .collect(Collectors.toMap(ParameterizedSymbol::getId, Function.identity()));

        for (Long id : pSymbolIds) {
            setSteps(pSymbolMap.get(id), testCase, testCase.getSteps());
        }
    }

    private List<String> convertWordToStringList(Word<String> word) {
        return word.stream().collect(Collectors.toList());
    }

    private List<Long> convertWordToPSymbolIds(Word<String> word, List<ParameterizedSymbol> pSymbols) {
        final Map<String, ParameterizedSymbol> symbolMap = pSymbols.stream()
                .collect(Collectors.toMap(ParameterizedSymbol::getAliasOrComputedName, Function.identity()));

        return word.stream().map(symbol -> symbolMap.get(symbol).getId()).collect(Collectors.toList());
    }
}
