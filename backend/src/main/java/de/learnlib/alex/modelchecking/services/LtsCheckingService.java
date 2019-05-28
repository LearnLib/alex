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

package de.learnlib.alex.modelchecking.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import de.learnlib.alex.modelchecking.entities.LtsCheckingConfig;
import de.learnlib.alex.modelchecking.entities.LtsCheckingResult;
import de.learnlib.alex.modelchecking.entities.LtsFormula;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;
import net.automatalib.modelcheckers.ltsmin.ltl.LTSminLTLIO;
import net.automatalib.modelcheckers.ltsmin.ltl.LTSminLTLIOBuilder;
import net.automatalib.modelchecking.Lasso;
import net.automatalib.words.Alphabet;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

/** Service that is used to execute model checks on learned models. */
@Service
public class LtsCheckingService {

    /** The DAO for learner results. */
    private LearnerResultDAO learnerResultDAO;

    /**
     * Constructor.
     *
     * @param learnerResultDAO
     *         {@link #learnerResultDAO}
     */
    @Inject
    public LtsCheckingService(LearnerResultDAO learnerResultDAO) {
        this.learnerResultDAO = learnerResultDAO;
    }

    /**
     * Check formulas against a learned model in a learner result.
     *
     * @param user
     *         The user.
     * @param projectId
     *         The ID of the project.
     * @param config
     *         The configuration to use for checking.
     * @return A map of possible counterexample (formulaId -> counterexample).
     * @throws NotFoundException
     *         If the project or a lts formula could not be found.
     */
    public List<LtsCheckingResult> check(User user, Long projectId, LtsCheckingConfig config) throws NotFoundException {
        final LearnerResult learnerResult = learnerResultDAO.get(user, projectId, config.getLearnerResultId(), true);
        final LearnerResultStep step = learnerResult.getSteps().get(config.getStepNo() - 1);

        final Alphabet<String> alphabet = step.getHypothesis().createAlphabet();
        final CompactMealy<String, String> hypothesis = step.getHypothesis().createMealyMachine(alphabet);

        final LTSminLTLIO<String, String> ltsmin =
                new LTSminLTLIOBuilder<String, String>()
                        .withString2Input(Function.identity())
                        .withString2Output(Function.identity())
                        .withMinimumUnfolds(config.getMinUnfolds())
                        .withMultiplier(config.getMultiplier())
                        .create();

        final List<LtsCheckingResult> results = new ArrayList<>();

        for (LtsFormula formula : config.getFormulas()) {
            final Lasso.MealyLasso<String, String> ce = ltsmin.findCounterExample(hypothesis, alphabet, formula.getFormula());
            if (ce != null) {
                results.add(new LtsCheckingResult(formula, learnerResult.getId(), step.getStepNo(), ce.getPrefix(), ce.getLoop()));
            } else {
                results.add(new LtsCheckingResult(formula, learnerResult.getId(), step.getStepNo()));
            }
        }

        return results;
    }
}
