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

package de.learnlib.alex.data.services;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolPSymbolStep;
import de.learnlib.alex.data.entities.SymbolUsageResult;
import de.learnlib.alex.data.repositories.SymbolPSymbolStepRepository;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.testing.entities.TestCase;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SymbolUsageService {

    private SymbolDAO symbolDAO;
    private SymbolPSymbolStepRepository symbolPSymbolStepRepository;
    private TestCaseStepRepository testCaseStepRepository;
    private LearnerResultRepository learnerResultRepository;

    @Inject
    public SymbolUsageService(SymbolDAO symbolDAO,
                              SymbolPSymbolStepRepository symbolPSymbolStepRepository,
                              TestCaseStepRepository testCaseStepRepository,
                              LearnerResultRepository learnerResultRepository) {
        this.symbolDAO = symbolDAO;
        this.symbolPSymbolStepRepository = symbolPSymbolStepRepository;
        this.testCaseStepRepository = testCaseStepRepository;
        this.learnerResultRepository = learnerResultRepository;
    }

    public SymbolUsageResult findUsages(User user, Long projectId, Long symbolId) {
        final Symbol symbol = symbolDAO.get(user, projectId, symbolId);

        final SymbolUsageResult usageResult = new SymbolUsageResult();

        final Set<Symbol> foundInSymbols = symbolPSymbolStepRepository.findAllByPSymbol_Symbol_Id(symbol.getId()).stream()
                .map(SymbolPSymbolStep::getSymbol)
                .collect(Collectors.toSet());
        foundInSymbols.forEach(s -> s.setSteps(new ArrayList<>()));
        usageResult.setSymbols(foundInSymbols);

        final Set<TestCase> foundInTestCases = testCaseStepRepository.findAllByPSymbol_Symbol_Id(symbol.getId()).stream()
                .map(TestCaseStep::getTestCase)
                .collect(Collectors.toSet());
        foundInTestCases.forEach(tc -> tc.setSteps(new ArrayList<>()));
        usageResult.setTestCases(foundInTestCases);

        final Set<LearnerResult> foundInLearnerResults = new HashSet<>();
        final List<LearnerResult> learnerResults = learnerResultRepository.findByProject_IdOrderByTestNoAsc(symbol.getProjectId());
        for (LearnerResult r: learnerResults) {
            if (r.getResetSymbol().getSymbol().getId().equals(symbolId) || (r.getPostSymbol() != null && r.getPostSymbol().getSymbol().getId().equals(symbolId))) {
                foundInLearnerResults.add(r);
                continue;
            }
            for (ParameterizedSymbol ps: r.getSymbols()) {
                if (ps.getSymbol().getId().equals(symbolId)) {
                    foundInLearnerResults.add(r);
                    break;
                }
            }
        }
        usageResult.setLearnerResults(foundInLearnerResults);

        return usageResult;
    }
}
