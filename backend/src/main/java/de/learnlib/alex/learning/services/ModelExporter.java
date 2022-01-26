/*
 * Copyright 2015 - 2022 TU Dortmund
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
import de.learnlib.alex.learning.dao.LearnerResultDAO;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerResultStep;
import java.io.IOException;
import java.io.StringWriter;
import javax.validation.ValidationException;
import net.automatalib.automata.transducers.MealyMachine;
import net.automatalib.serialization.dot.GraphDOT;
import net.automatalib.words.Alphabet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class, readOnly = true)
public class ModelExporter {

    private final LearnerResultDAO learnerResultDAO;

    @Autowired
    public ModelExporter(LearnerResultDAO learnerResultDAO) {
        this.learnerResultDAO = learnerResultDAO;
    }

    public String exportDot(User user, Long projectId, Long testNo, Long stepNo) {
        final LearnerResult learnerResult = learnerResultDAO.getByTestNo(user, projectId, testNo);

        final LearnerResultStep step = learnerResult.getSteps().stream()
                .filter(s -> s.getStepNo().equals(stepNo))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("The step could not be found."));

        final Alphabet<String> alphabet = step.getHypothesis().createAlphabet();
        final MealyMachine<?, String, ?, String> mealy = step.getHypothesis().createMealyMachine(alphabet);

        try {
            final StringWriter sw = new StringWriter();
            GraphDOT.write(mealy, alphabet, sw);
            return sw.toString();
        } catch (IOException e) {
            throw new ValidationException("Could not write DOT file");
        }
    }
}
