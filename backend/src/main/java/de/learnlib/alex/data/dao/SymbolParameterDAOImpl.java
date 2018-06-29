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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolInputParameter;
import de.learnlib.alex.data.entities.SymbolOutputParameter;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.data.entities.SymbolPSymbolStep;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolParameterValueRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.data.repositories.SymbolSymbolStepRepository;
import de.learnlib.alex.testing.entities.TestCaseStep;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.xml.bind.ValidationException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/** The concrete DAO for symbol parameters. */
@Service
public class SymbolParameterDAOImpl implements SymbolParameterDAO {

    /** The project repository to use. */
    private ProjectRepository projectRepository;

    /** The symbol repository to use. */
    private SymbolRepository symbolRepository;

    /** The symbol parameter repository to use. */
    private SymbolParameterRepository symbolParameterRepository;

    /** The injected repository for {@link TestCaseStep}. */
    private TestCaseStepRepository testCaseStepRepository;

    /** The injected repository for {@link SymbolParameterValue}. */
    private SymbolParameterValueRepository symbolParameterValueRepository;

    /** The injected repository for {@link ParameterizedSymbol}. */
    private ParameterizedSymbolRepository parameterizedSymbolRepository;

    /** The repository for symbol repositories. */
    private SymbolSymbolStepRepository symbolSymbolStepRepository;

    /** The symbol DAO to use. */
    private SymbolDAO symbolDAO;

    @Inject
    public SymbolParameterDAOImpl(ProjectRepository projectRepository,
            SymbolRepository symbolRepository,
            SymbolParameterRepository symbolParameterRepository,
            TestCaseStepRepository testCaseStepRepository,
            SymbolParameterValueRepository symbolParameterValueRepository,
            ParameterizedSymbolRepository parameterizedSymbolRepository,
            SymbolSymbolStepRepository symbolSymbolStepRepository, SymbolDAO symbolDAO) {
        this.projectRepository = projectRepository;
        this.symbolRepository = symbolRepository;
        this.symbolParameterRepository = symbolParameterRepository;
        this.testCaseStepRepository = testCaseStepRepository;
        this.symbolParameterValueRepository = symbolParameterValueRepository;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolSymbolStepRepository = symbolSymbolStepRepository;
        this.symbolDAO = symbolDAO;
    }

    @Override
    @Transactional
    public SymbolParameter create(User user, Long projectId, Long symbolId, SymbolParameter parameter)
            throws NotFoundException, UnauthorizedException, ValidationException {
        final Project project = projectRepository.findOne(projectId);
        final Symbol symbol = symbolRepository.findOne(symbolId);

        return create(user, project, symbol, parameter);
    }

    @Override
    @Transactional
    public List<SymbolParameter> create(User user, Long projectId, Long symbolId, List<SymbolParameter> parameters)
            throws NotFoundException, UnauthorizedException, ValidationException {
        final Project project = projectRepository.findOne(projectId);
        final Symbol symbol = symbolRepository.findOne(symbolId);

        final List<SymbolParameter> createdParameters = new ArrayList<>();
        for (final SymbolParameter param : parameters) {
            createdParameters.add(create(user, project, symbol, param));
        }
        return createdParameters;
    }

    private SymbolParameter create(User user, Project project, Symbol symbol, SymbolParameter parameter)
            throws NotFoundException, UnauthorizedException, ValidationException {

        symbolDAO.checkAccess(user, project, symbol);
        checkIfTypeWithNameExists(symbol, parameter);

        parameter.setSymbol(symbol);
        symbol.addParameter(parameter);

        final SymbolParameter createdParameter = symbolParameterRepository.save(parameter);
        symbolRepository.save(symbol);

        // If a new parameter is created for a symbol, it may be that there are tests that use the symbol.
        // Therefore we have to add a new parameter value to the test steps that use the symbol.
        if (parameter instanceof SymbolInputParameter) {
            final List<TestCaseStep> testSteps = testCaseStepRepository.findAllByTestCase_Project_IdAndSymbol_Id(project.getId(), symbol.getId());
            testSteps.forEach(step -> {
                final SymbolParameterValue value = new SymbolParameterValue();
                value.setParameter(parameter);
                step.getParameterValues().add(value);
            });
            testCaseStepRepository.save(testSteps);

            final List<SymbolPSymbolStep> symbolSteps = symbolSymbolStepRepository.findAllByPSymbol_Symbol_Id(symbol.getId());
            symbolSteps.forEach(symbolStep -> {
                final SymbolParameterValue value = new SymbolParameterValue();
                value.setParameter(parameter);
                symbolStep.getPSymbol().getParameterValues().add(value);
            });
            symbolSymbolStepRepository.save(symbolSteps);
        }

        return createdParameter;
    }

    @Override
    @Transactional
    public SymbolParameter update(User user, Long projectId, Long symbolId, SymbolParameter parameter)
            throws NotFoundException, UnauthorizedException, ValidationException {
        final Project project = projectRepository.findOne(projectId);
        final Symbol symbol = symbolRepository.findOne(symbolId);

        checkAccess(user, project, symbol, parameter);
        checkIfTypeWithNameExists(symbol, parameter);

        // if a parameter is not private, we have to set all referenced values to null so that previously set values
        // are not saved.
        if (parameter instanceof SymbolInputParameter) {
            final SymbolParameter parameterInDb = symbolParameterRepository.findOne(parameter.getId());
            if (((SymbolInputParameter) parameter).isPrivate() && !((SymbolInputParameter) parameterInDb).isPrivate()) {
                final List<TestCaseStep> steps = testCaseStepRepository.findAllByTestCase_Project_IdAndSymbol_Id(projectId, symbolId);
                steps.forEach(step -> step.getParameterValues().forEach(pv -> {
                    if (pv.getParameter().getId().equals(parameter.getId())) {
                        pv.setValue(null);
                    }
                }));
                testCaseStepRepository.save(steps);

                final List<ParameterizedSymbol> pSymbols = parameterizedSymbolRepository.findAllBySymbol_Project_Id(projectId);
                for (ParameterizedSymbol pSymbol: pSymbols) {
                    pSymbol.setParameterValues(pSymbol.getParameterValues().stream()
                            .filter(pv -> !pv.getParameter().getId().equals(parameter.getId()))
                            .collect(Collectors.toList()));
                }
                parameterizedSymbolRepository.save(pSymbols);
            }
        }

        return symbolParameterRepository.save(parameter);
    }

    @Override
    @Transactional
    public void delete(User user, Long projectId, Long symbolId, Long parameterId)
            throws NotFoundException, UnauthorizedException {
        final Project project = projectRepository.findOne(projectId);
        final Symbol symbol = symbolRepository.findOne(symbolId);
        final SymbolParameter parameter = symbolParameterRepository.findOne(parameterId);

        checkAccess(user, project, symbol, parameter);

        // we do not need to explicitly remove the parameter since the parameters in the symbol are
        // annotated with orphanRemoval = true
        symbol.removeParameter(parameter);
        symbolRepository.save(symbol);

        final List<ParameterizedSymbol> pSymbols = parameterizedSymbolRepository.findAllBySymbol_Project_Id(projectId);
        for (ParameterizedSymbol pSymbol: pSymbols) {
            pSymbol.setParameterValues(pSymbol.getParameterValues().stream()
                    .filter(pv -> !pv.getParameter().getId().equals(parameterId))
                    .collect(Collectors.toList()));
        }
        parameterizedSymbolRepository.save(pSymbols);

        final List<TestCaseStep> steps = testCaseStepRepository.findAllByTestCase_Project_IdAndSymbol_Id(projectId, symbolId);
        for (TestCaseStep step: steps) {
            step.setParameterValues(step.getParameterValues().stream()
                    .filter(pv -> !pv.getParameter().getId().equals(parameterId))
                    .collect(Collectors.toList()));
        }
        testCaseStepRepository.save(steps);

        // also delete all values for the parameter
        symbolParameterValueRepository.removeAllByParameter_Id(parameterId);
    }

    @Override
    public void checkAccess(User user, Project project, Symbol symbol, SymbolParameter parameter)
            throws NotFoundException, UnauthorizedException {
        symbolDAO.checkAccess(user, project, symbol);

        if (parameter == null) {
            throw new NotFoundException("The parameter could not be found.");
        }

        if (!symbol.containsParameter(parameter)) {
            throw new UnauthorizedException("You are not allowed to access the parameter.");
        }
    }

    private void checkIfTypeWithNameExists(Symbol symbol, SymbolParameter parameter) throws ValidationException {
        if (parameter instanceof SymbolInputParameter) {
            if (typeWithNameExists(symbol.getInputs(), parameter)) {
                throw new ValidationException("The name of the input parameter already exists.");
            }
        } else if (parameter instanceof SymbolOutputParameter) {
            if (typeWithNameExists(symbol.getOutputs(), parameter)) {
                throw new ValidationException("The name of the output parameter already exists.");
            }
        }
    }

    private boolean typeWithNameExists(List<? extends SymbolParameter> parameters, SymbolParameter parameter) {
        return parameters.stream().anyMatch(p ->
                p.getName().equals(parameter.getName()) && !p.getId().equals(parameter.getId())
        );
    }
}
