/*
 * Copyright 2015 - 2021 TU Dortmund
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
import de.learnlib.alex.data.entities.SymbolOutputMapping;
import de.learnlib.alex.data.entities.SymbolOutputParameter;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.data.entities.SymbolParameterValue;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolOutputMappingRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolParameterValueRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.websocket.services.SymbolPresenceService;
import java.time.ZonedDateTime;
import java.util.List;
import javax.validation.ValidationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** The concrete DAO for symbol parameters. */
@Service
@Transactional(rollbackFor = Exception.class)
public class SymbolParameterDAO {

    private final ProjectRepository projectRepository;
    private final SymbolRepository symbolRepository;
    private final SymbolParameterRepository symbolParameterRepository;
    private final SymbolParameterValueRepository symbolParameterValueRepository;
    private final ParameterizedSymbolRepository parameterizedSymbolRepository;
    private final SymbolOutputMappingRepository outputMappingRepository;
    private final SymbolPresenceService symbolPresenceService;
    private final SymbolDAO symbolDAO;

    @Autowired
    public SymbolParameterDAO(ProjectRepository projectRepository,
                              SymbolRepository symbolRepository,
                              SymbolParameterRepository symbolParameterRepository,
                              SymbolParameterValueRepository symbolParameterValueRepository,
                              ParameterizedSymbolRepository parameterizedSymbolRepository,
                              SymbolDAO symbolDAO,
                              SymbolOutputMappingRepository outputMappingRepository,
                              SymbolPresenceService symbolPresenceService) {
        this.projectRepository = projectRepository;
        this.symbolRepository = symbolRepository;
        this.symbolParameterRepository = symbolParameterRepository;
        this.symbolParameterValueRepository = symbolParameterValueRepository;
        this.parameterizedSymbolRepository = parameterizedSymbolRepository;
        this.symbolDAO = symbolDAO;
        this.outputMappingRepository = outputMappingRepository;
        this.symbolPresenceService = symbolPresenceService;
    }

    public SymbolParameter create(User user, Long projectId, Long symbolId, SymbolParameter parameter) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final Symbol symbol = symbolRepository.findById(symbolId).orElse(null);

        return create(user, project, symbol, parameter);
    }

    public SymbolParameter update(User user, Long projectId, Long symbolId, SymbolParameter parameter) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final Symbol symbol = symbolRepository.findById(symbolId).orElse(null);

        checkAccess(user, project, symbol, parameter);
        checkIfTypeWithNameExists(symbol, parameter);

        // check symbol lock status
        symbolPresenceService.checkSymbolLockStatus(project.getId(), symbol.getId(), user.getId());

        symbol.setUpdatedOn(ZonedDateTime.now());
        symbolRepository.save(symbol);

        return symbolParameterRepository.save(parameter);
    }

    public void delete(User user, Long projectId, Long symbolId, Long parameterId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final Symbol symbol = symbolRepository.findById(symbolId).orElse(null);
        final SymbolParameter parameter = symbolParameterRepository.findById(parameterId).orElse(null);

        checkAccess(user, project, symbol, parameter);

        // check symbol lock status
        symbolPresenceService.checkSymbolLockStatus(project.getId(), symbol.getId(), user.getId());

        final List<ParameterizedSymbol> pSymbols = parameterizedSymbolRepository.findAllBySymbol_Id(symbolId);
        for (ParameterizedSymbol pSymbol : pSymbols) {
            pSymbol.getParameterValues().removeIf(pv -> pv.getParameter().getId().equals(parameterId));
            pSymbol.getOutputMappings().removeIf(pv -> pv.getParameter().getId().equals(parameterId));
        }
        parameterizedSymbolRepository.saveAll(pSymbols);

        // also delete all values for the parameter
        symbolParameterValueRepository.removeAllByParameter_Id(parameterId);
        outputMappingRepository.removeAllByParameter_Id(parameterId);

        symbol.removeParameter(parameter);
        symbol.setUpdatedOn(ZonedDateTime.now());
        symbolRepository.save(symbol);

        symbolParameterRepository.deleteById(parameterId);
    }

    public void checkAccess(User user, Project project, Symbol symbol, SymbolParameter parameter) {
        symbolDAO.checkAccess(user, project, symbol);

        if (parameter == null) {
            throw new NotFoundException("The parameter could not be found.");
        }

        if (!symbol.containsParameter(parameter)) {
            throw new UnauthorizedException("You are not allowed to access the parameter.");
        }
    }

    private SymbolParameter create(User user, Project project, Symbol symbol, SymbolParameter parameter) {
        symbolDAO.checkAccess(user, project, symbol);
        checkIfTypeWithNameExists(symbol, parameter);

        // check symbol lock status
        symbolPresenceService.checkSymbolLockStatus(project.getId(), symbol.getId(), user.getId());

        parameter.setSymbol(symbol);
        symbol.addParameter(parameter);

        final SymbolParameter createdParameter = symbolParameterRepository.save(parameter);
        symbol.setUpdatedOn(ZonedDateTime.now());
        symbolRepository.save(symbol);

        // If a new parameter is created for a symbol, it may be that there are tests that use the symbol.
        // Therefore we have to add a new parameter value to the test steps that use the symbol.
        final List<ParameterizedSymbol> pSymbols = parameterizedSymbolRepository.findAllBySymbol_Id(symbol.getId());
        if (parameter instanceof SymbolInputParameter) {
            pSymbols.forEach(pSymbol -> {
                final SymbolParameterValue value = new SymbolParameterValue();
                value.setParameter(parameter);
                value.setDefaultValueByParameter(parameter);
                pSymbol.getParameterValues().add(value);
                symbolParameterValueRepository.saveAll(pSymbol.getParameterValues());
            });
            parameterizedSymbolRepository.saveAll(pSymbols);
        } else if (parameter instanceof SymbolOutputParameter) {
            pSymbols.forEach(pSymbol -> {
                final SymbolOutputMapping om = new SymbolOutputMapping();
                om.setParameter(parameter);
                om.setName(parameter.getName());
                pSymbol.getOutputMappings().add(om);
                outputMappingRepository.saveAll(pSymbol.getOutputMappings());
            });
        }

        return createdParameter;
    }

    private void checkIfTypeWithNameExists(Symbol symbol, SymbolParameter parameter) {
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
