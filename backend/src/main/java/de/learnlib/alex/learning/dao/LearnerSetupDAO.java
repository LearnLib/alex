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

package de.learnlib.alex.learning.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.ParameterizedSymbolDAO;
import de.learnlib.alex.data.dao.ProjectDAO;
import de.learnlib.alex.data.dao.ProjectEnvironmentDAO;
import de.learnlib.alex.data.dao.SymbolDAO;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.repositories.ProjectEnvironmentRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.entities.LearnerSetup;
import de.learnlib.alex.learning.entities.LearnerStatus;
import de.learnlib.alex.learning.entities.LearningProcessStatus;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;
import de.learnlib.alex.learning.repositories.LearnerSetupRepository;
import de.learnlib.alex.learning.services.LearnerService;
import de.learnlib.alex.modelchecking.dao.ModelCheckingConfigDAO;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.modelchecking.repositories.LtsFormulaSuiteRepository;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.persistence.EntityManager;
import javax.validation.ValidationException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public class LearnerSetupDAO {

    private final LearnerSetupRepository learnerSetupRepository;
    private final ProjectRepository projectRepository;
    private final ProjectDAO projectDAO;
    private final ParameterizedSymbolDAO parameterizedSymbolDAO;
    private final LearnerResultRepository learnerResultRepository;
    private final ProjectEnvironmentRepository projectEnvironmentRepository;
    private final EntityManager entityManager;
    private final SymbolDAO symbolDAO;
    private final LtsFormulaSuiteRepository ltsFormulaSuiteRepository;
    private final ModelCheckingConfigDAO modelCheckingConfigDAO;
    private final LearnerService learnerService;

    @Autowired
    public LearnerSetupDAO(LearnerSetupRepository learnerSetupRepository,
                           ParameterizedSymbolDAO parameterizedSymbolDAO,
                           ProjectRepository projectRepository,
                           ProjectDAO projectDAO,
                           LearnerResultRepository learnerResultRepository,
                           ProjectEnvironmentRepository projectEnvironmentRepository,
                           EntityManager entityManager,
                           SymbolDAO symbolDAO,
                           LtsFormulaSuiteRepository ltsFormulaSuiteRepository,
                           ModelCheckingConfigDAO modelCheckingConfigDAO,
                           @Lazy LearnerService learnerService) {
        this.learnerSetupRepository = learnerSetupRepository;
        this.projectDAO = projectDAO;
        this.projectRepository = projectRepository;
        this.parameterizedSymbolDAO = parameterizedSymbolDAO;
        this.learnerResultRepository = learnerResultRepository;
        this.projectEnvironmentRepository = projectEnvironmentRepository;
        this.entityManager = entityManager;
        this.symbolDAO = symbolDAO;
        this.ltsFormulaSuiteRepository = ltsFormulaSuiteRepository;
        this.modelCheckingConfigDAO = modelCheckingConfigDAO;
        this.learnerService = learnerService;
    }

    public List<LearnerSetup> getAll(User user, Long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final List<LearnerSetup> setups = learnerSetupRepository.findAllByProject_Id(projectId);
        setups.forEach(this::loadLazyRelations);
        return setups;
    }

    public LearnerSetup getById(User user, Long projectId, Long setupId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LearnerSetup setup = learnerSetupRepository.findById(setupId).orElse(null);
        checkAccess(user, project, setup);
        loadLazyRelations(setup);
        return setup;
    }

    public LearnerSetup removeSymbols(Long setupId, List<ParameterizedSymbol> symbols) {
        final var setup = learnerSetupRepository.findById(setupId)
                .orElseThrow(() -> new NotFoundException("setup not found."));

        final var ids = symbols.stream()
                .map(ParameterizedSymbol::getId)
                .collect(Collectors.toList());

        setup.getSymbols().removeIf(s -> ids.contains(s.getId()));
        final var updatedSetup = learnerSetupRepository.save(setup);

        for (var ps : symbols) {
            parameterizedSymbolDAO.delete(ps);
        }

        loadLazyRelations(updatedSetup);
        return updatedSetup;
    }

    public LearnerSetup addSymbols(Long setupId, List<ParameterizedSymbol> symbols) {
        final var setup = learnerSetupRepository.findById(setupId)
                .orElseThrow(() -> new NotFoundException("setup not found."));

        final var createdSymbols = symbols.stream()
                .map(parameterizedSymbolDAO::create)
                .collect(Collectors.toList());

        setup.getSymbols().addAll(createdSymbols);

        final var updatedSetup = learnerSetupRepository.save(setup);
        loadLazyRelations(updatedSetup);
        return updatedSetup;
    }

    public LearnerSetup update(User user, Long projectId, Long setupId, LearnerSetup setup) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LearnerSetup setupInDb = learnerSetupRepository.findById(setupId).orElse(null);
        checkAccess(user, project, setupInDb);

        setupInDb.setName(setup.getName());
        setupInDb.setAlgorithm(setup.getAlgorithm());
        setupInDb.setEquivalenceOracle(setup.getEquivalenceOracle());
        setupInDb.setEnableCache(setup.isEnableCache());

        entityManager.detach(setup.getWebDriver());
        setup.getWebDriver().setId(null);
        setupInDb.setWebDriver(setup.getWebDriver());

        final var updatedModelCheckingConfig = modelCheckingConfigDAO.update(user, projectId,
                setupInDb.getModelCheckingConfig().getId(), setup.getModelCheckingConfig());
        setupInDb.setModelCheckingConfig(updatedModelCheckingConfig);

        setupInDb.setEnvironments(projectEnvironmentRepository.findAllByIdIn(setup.getEnvironments().stream()
                .map(ProjectEnvironment::getId)
                .collect(Collectors.toList())));

        setupInDb.setPreSymbol(setup.getPreSymbol().copy());
        setupInDb.setSymbols(setup.getSymbols().stream()
                .map(ParameterizedSymbol::copy)
                .collect(Collectors.toList()));

        if (setup.getPostSymbol() != null) {
            setupInDb.setPostSymbol(setup.getPostSymbol().copy());
        }

        saveSymbols(setupInDb);

        final LearnerSetup updatedSetup = learnerSetupRepository.save(setupInDb);
        loadLazyRelations(updatedSetup);
        return updatedSetup;
    }

    public LearnerSetup copy(User user, Long projectId, Long setupId, boolean saved) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final LearnerSetup setupInDb = learnerSetupRepository.findById(setupId).orElse(null);
        checkAccess(user, project, setupInDb);

        final LearnerSetup newSetup = new LearnerSetup();
        newSetup.setProject(project);
        newSetup.setName(setupInDb.getName());
        newSetup.setAlgorithm(setupInDb.getAlgorithm());
        newSetup.setEquivalenceOracle(setupInDb.getEquivalenceOracle());
        newSetup.setEnableCache(setupInDb.isEnableCache());
        newSetup.setSaved(saved);

        final WebDriverConfig webDriverConfig = setupInDb.getWebDriver();
        entityManager.detach(webDriverConfig);
        webDriverConfig.setId(null);

        newSetup.setWebDriver(webDriverConfig);
        newSetup.setEnvironments(projectEnvironmentRepository.findAllByIdIn(setupInDb.getEnvironments().stream()
                .map(ProjectEnvironment::getId)
                .collect(Collectors.toList())));

        final var createdMCConfig = modelCheckingConfigDAO.create(user, projectId, setupInDb.getModelCheckingConfig());
        newSetup.setModelCheckingConfig(createdMCConfig);

        newSetup.setPreSymbol(setupInDb.getPreSymbol().copy());
        newSetup.setSymbols(setupInDb.getSymbols().stream()
                .map(ParameterizedSymbol::copy)
                .collect(Collectors.toList()));
        newSetup.setPostSymbol(setupInDb.getPostSymbol() == null ? null : setupInDb.getPostSymbol().copy());

        saveSymbols(newSetup);

        final LearnerSetup copiedSetup = learnerSetupRepository.save(newSetup);
        loadLazyRelations(copiedSetup);
        return copiedSetup;
    }

    public List<LearnerSetup> importLearnerSetups(User user, Project project, List<LearnerSetup> setups) {
        // symbol name -> symbol
        final var symbolMap = symbolDAO.getAll(user, project.getId()).stream()
                .collect(Collectors.toMap(Symbol::getName, Function.identity()));

        // associate symbols
        for (var setup : setups) {
            setup.setProject(project);

            setup.setPreSymbol(importParameterizedSymbol(setup.getPreSymbol(), symbolMap));
            setup.setSymbols(setup.getSymbols().stream()
                    .map(ps -> importParameterizedSymbol(ps, symbolMap))
                    .collect(Collectors.toList())
            );
            if (setup.getPostSymbol() != null) {
                setup.setPostSymbol(importParameterizedSymbol(setup.getPostSymbol(), symbolMap));
            }

            setup.setEnvironments(
                    projectEnvironmentRepository.findByProject_IdAndNameIn(project.getId(), setup.getEnvironments().stream()
                            .map(ProjectEnvironment::getName)
                            .collect(Collectors.toList())
                    )
            );

            setup.getModelCheckingConfig().setFormulaSuites(
                    ltsFormulaSuiteRepository.findAllByProject_IdAndNameIn(project.getId(), setup.getModelCheckingConfig().getFormulaSuites().stream()
                            .map(LtsFormulaSuite::getName)
                            .collect(Collectors.toSet())
                    )
            );

            setup.setModelCheckingConfig(modelCheckingConfigDAO.create(user, project.getId(), setup.getModelCheckingConfig()));
        }

        // save setups
        final var importedSetups = learnerSetupRepository.saveAll(setups);
        importedSetups.forEach(this::loadLazyRelations);

        return importedSetups;
    }

    private ParameterizedSymbol importParameterizedSymbol(ParameterizedSymbol pSymbol, Map<String, Symbol> symbolMap) {
        final var symbol = symbolMap.get(pSymbol.getSymbol().getName());
        pSymbol.setSymbol(symbol);
        pSymbol.getParameterValues().forEach(pv -> {
            final var param = symbol.findInputByNameAndType(
                    pv.getParameter().getName(),
                    pv.getParameter().getParameterType()
            );
            pv.setParameter(param);
        });
        pSymbol.getOutputMappings().forEach(om -> {
            final var param = symbol.findOutputByNameAndType(
                    om.getParameter().getName(),
                    om.getParameter().getParameterType()
            );
            om.setParameter(param);
        });
        return parameterizedSymbolDAO.create(pSymbol);
    }

    public LearnerSetup create(User user, Long projectId, LearnerSetup setup) {
        final var project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        saveSymbols(setup);

        setup.setProject(project);
        setup.setId(null);
        setup.getWebDriver().setId(null);

        final var mcConfig = modelCheckingConfigDAO.create(user, projectId, setup.getModelCheckingConfig());
        setup.setModelCheckingConfig(mcConfig);

        final LearnerSetup createdSetup = learnerSetupRepository.save(setup);
        loadLazyRelations(createdSetup);

        return createdSetup;
    }

    public void delete(User user, Long projectId, Long setupId) {
        final var project = projectRepository.findById(projectId).orElse(null);
        final var setup = learnerSetupRepository.findById(setupId).orElse(null);
        checkAccess(user, project, setup);

        if (learnerResultRepository.countAllBySetup_Id(setupId) > 0) {
            throw new ValidationException("The setup cannot be deleted because it is referenced by a learner result.");
        } else {
            learnerSetupRepository.delete(setup);
        }
    }

    public List<LearnerSetup> getActiveLearnerSetups(User user, Long projectId) {
        LearnerStatus status = learnerService.getStatus(user, projectId);
        if (status.isActive()) {
            List<LearnerResult> currentProcessSingletonList = Optional.ofNullable(status.getCurrentProcess())
                    .map(LearningProcessStatus::getResult)
                    .map(List::of)
                    .orElse(Collections.emptyList());

            return Stream.of(currentProcessSingletonList, status.getQueue())
                    .flatMap(List::stream)
                    .map(LearnerResult::getSetup)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public void checkAccess(User user, Project project, LearnerSetup learnerSetup) {
        projectDAO.checkAccess(user, project);

        if (learnerSetup == null) {
            throw new NotFoundException("The learner setup could not be found.");
        }

        if (!learnerSetup.getProjectId().equals(project.getId())) {
            throw new NotFoundException("Cannot access the learner setup.");
        }
    }

    public void loadLazyRelations(LearnerSetup learnerSetup) {
        Hibernate.initialize(learnerSetup.getPreSymbol());
        ParameterizedSymbolDAO.loadLazyRelations(learnerSetup.getPreSymbol());

        Hibernate.initialize(learnerSetup.getSymbols());
        learnerSetup.getSymbols().forEach(ParameterizedSymbolDAO::loadLazyRelations);

        if (learnerSetup.getPostSymbol() != null) {
            Hibernate.initialize(learnerSetup.getPostSymbol());
            ParameterizedSymbolDAO.loadLazyRelations(learnerSetup.getPostSymbol());
        }

        Hibernate.initialize(learnerSetup.getEnvironments());
        learnerSetup.getEnvironments().forEach(ProjectEnvironmentDAO::loadLazyRelations);

        Hibernate.initialize(learnerSetup.getWebDriver());
        modelCheckingConfigDAO.loadLazyRelations(learnerSetup.getModelCheckingConfig());
    }

    private void saveSymbols(LearnerSetup setup) {
        setup.getPreSymbol().setId(null);
        parameterizedSymbolDAO.create(setup.getPreSymbol());
        for (ParameterizedSymbol ps : setup.getSymbols()) {
            ps.setId(null);
            parameterizedSymbolDAO.create(ps);
        }
        if (setup.getPostSymbol() != null) {
            setup.getPostSymbol().setId(null);
            parameterizedSymbolDAO.create(setup.getPostSymbol());
        }
    }
}
