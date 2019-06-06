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

package de.learnlib.alex.data.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.repositories.ParameterizedSymbolRepository;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolActionRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolParameterRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.data.repositories.SymbolStepRepository;
import de.learnlib.alex.data.repositories.SymbolSymbolStepRepository;
import de.learnlib.alex.testing.repositories.TestCaseStepRepository;
import de.learnlib.alex.testing.repositories.TestExecutionResultRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of a SymbolGroupDAO using Spring Data.
 */
@Service
public class SymbolGroupDAOImpl implements SymbolGroupDAO {

    private static final Logger LOGGER = LogManager.getLogger();

    /** The ProjectRepository to use. Will be injected. */
    private ProjectRepository projectRepository;

    /** The ProjectDAO to use. Will be injected. */
    private ProjectDAO projectDAO;

    /** The SymbolGroupRepository to use. Will be injected. */
    private SymbolGroupRepository symbolGroupRepository;

    /** The SymbolRepository to use. Will be injected. */
    private SymbolRepository symbolRepository;

    /** The SymbolDAO to use. */
    private SymbolDAO symbolDAO;

    /**
     * Creates a new SymbolGroupDAO.
     *
     * @param projectRepository
     *         The ProjectRepository to use.
     * @param projectDAO
     *         The ProjectDAO to use.
     * @param symbolGroupRepository
     *         The SymbolGroupRepository to use.
     * @param symbolRepository
     *         The SymbolRepository to use.
     * @param symbolActionRepository
     *         The SymbolActionRepository to use.
     * @param symbolParameterRepository
     *         The SymbolParameterRepository to use.
     * @param symbolStepRepository
     *         The repository for symbol steps.
     * @param parameterizedSymbolDAO
     *         The DAO for parameterized symbols.
     * @param testCaseStepRepository
     *         The testCaseStepRepository to use.
     * @param parameterizedSymbolRepository
     *         The parameterizedSymbolRepository to use.
     * @param symbolSymbolStepRepository
     *         The symbolSymbolStepRepository to use.
     * @param testExecutionResultRepository
     *         The testExecutionResultRepository to use.
     */
    @Inject
    public SymbolGroupDAOImpl(ProjectRepository projectRepository, ProjectDAO projectDAO,
                              SymbolGroupRepository symbolGroupRepository, SymbolRepository symbolRepository,
                              SymbolActionRepository symbolActionRepository,
                              SymbolParameterRepository symbolParameterRepository, ParameterizedSymbolDAO parameterizedSymbolDAO,
                              SymbolStepRepository symbolStepRepository, ParameterizedSymbolRepository parameterizedSymbolRepository,
                              TestCaseStepRepository testCaseStepRepository, TestExecutionResultRepository testExecutionResultRepository,
                              SymbolSymbolStepRepository symbolSymbolStepRepository) {
        this.projectRepository = projectRepository;
        this.projectDAO = projectDAO;
        this.symbolGroupRepository = symbolGroupRepository;
        this.symbolRepository = symbolRepository;

        this.symbolDAO = new SymbolDAOImpl(projectRepository, projectDAO, symbolGroupRepository, symbolRepository,
                symbolActionRepository, this, symbolParameterRepository, symbolStepRepository,
                parameterizedSymbolDAO, parameterizedSymbolRepository, symbolSymbolStepRepository,
                testCaseStepRepository, testExecutionResultRepository);
    }

    @Override
    @Transactional
    public void create(User user, SymbolGroup group) throws NotFoundException, ValidationException {
        LOGGER.traceEntry("create({})", group);

        final Project project = projectRepository.findById(group.getProjectId()).orElse(null);
        projectDAO.checkAccess(user, project);

        group.setId(null);
        group.setName(createGroupName(project, group));
        project.addGroup(group);
        beforePersistGroup(group);

        if (group.getParentId() != null) {
            final SymbolGroup parent = symbolGroupRepository.findById(group.getParentId()).orElse(null);
            checkAccess(user, project, parent);

            group.setParent(parent);
            parent.getGroups().add(parent);
            symbolGroupRepository.save(parent);
        }

        symbolGroupRepository.save(group);

        LOGGER.traceExit(group);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public List<SymbolGroup> create(User user, Long projectId, List<SymbolGroup> groups)
            throws NotFoundException, ValidationException {
        LOGGER.traceEntry("create({})", groups);

        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        List<SymbolGroup> createdGroups = create(user, project, groups, null);
        createdGroups.forEach(g -> initLazyRelations(user, g, EmbeddableFields.COMPLETE_SYMBOLS));
        return groups;
    }

    private List<SymbolGroup> create(User user, Project project, List<SymbolGroup> groups, SymbolGroup parent)
            throws NotFoundException, ValidationException {
        final List<SymbolGroup> createdGroups = new ArrayList<>();
        for (SymbolGroup group : groups) {
            createdGroups.add(create(user, project, group, parent));
        }
        return createdGroups;
    }

    private SymbolGroup create(User user, Project project, SymbolGroup group, SymbolGroup parent)
            throws NotFoundException, ValidationException {
        final List<SymbolGroup> children = group.getGroups();
        final Set<Symbol> symbols = group.getSymbols();

        group.setGroups(new ArrayList<>());
        group.setSymbols(new HashSet<>());
        group.setProject(project);
        group.setParent(parent);
        group.setName(createGroupName(project, group));

        beforePersistGroup(group);
        final SymbolGroup createdGroup = symbolGroupRepository.save(group);

        symbols.forEach(symbol -> {
            symbol.setProject(project);
            symbol.setGroup(createdGroup);
        });
        symbolDAO.create(user, project.getId(), new ArrayList<>(symbols));

        final List<SymbolGroup> createdChildren = create(user, project, children, createdGroup);
        createdGroup.setGroups(createdChildren);
        return createdGroup;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SymbolGroup> getAll(User user, long projectId, EmbeddableFields... embedFields)
            throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final List<SymbolGroup> groups = symbolGroupRepository.findAllByProject_IdAndParent_id(projectId, null);
        for (SymbolGroup group : groups) {
            initLazyRelations(user, group, embedFields);
        }

        return groups;
    }

    @Override
    @Transactional(readOnly = true)
    public SymbolGroup get(User user, long projectId, Long groupId, EmbeddableFields... embedFields)
            throws NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final SymbolGroup group = symbolGroupRepository.findById(groupId).orElse(null);
        checkAccess(user, project, group);

        initLazyRelations(user, group, embedFields);

        return group;
    }

    @Override
    @Transactional
    public void update(User user, SymbolGroup group) throws NotFoundException, ValidationException {
        final Project project = projectRepository.findById(group.getProjectId()).orElse(null);
        final SymbolGroup groupInDB = symbolGroupRepository.findById(group.getId()).orElse(null);
        checkAccess(user, project, groupInDB);

        if (!group.getName().equals(groupInDB.getName())) {
            group.setName(createGroupName(project, group));
        }

        if (group.getParentId() != null && group.getParentId().equals(groupInDB.getId())) {
            throw new ValidationException("A group cannot have itself as child.");
        }

        final SymbolGroup defaultGroup = symbolGroupRepository.findFirstByProject_IdOrderByIdAsc(project.getId());
        if (defaultGroup.equals(groupInDB) && group.getParentId() != null) {
            throw new ValidationException("The default group cannot be a child of another group.");
        }

        groupInDB.setProject(project);
        groupInDB.setName(group.getName());
        symbolGroupRepository.save(groupInDB);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SymbolGroup move(User user, SymbolGroup group) throws NotFoundException, ValidationException {
        final Project project = projectRepository.findById(group.getProjectId()).orElse(null);
        final SymbolGroup groupInDB = symbolGroupRepository.findById(group.getId()).orElse(null);
        checkAccess(user, project, groupInDB);

        final SymbolGroup defaultGroup = symbolGroupRepository.findFirstByProject_IdOrderByIdAsc(project.getId());
        if (defaultGroup.equals(groupInDB)) {
            throw new ValidationException("You cannot move the default group.");
        }

        if (group.getParent() != null && groupInDB.getId().equals(group.getParentId())) {
            throw new ValidationException("A group cannot be a parent of itself.");
        }

        final SymbolGroup movedGroup;
        if (group.getParentId() == null) {
            // move group to the upmost level
            groupInDB.getParent().getGroups().remove(groupInDB);
            symbolGroupRepository.save(groupInDB.getParent());
            group.setName(createGroupName(project, group));
            movedGroup = symbolGroupRepository.save(group);
        } else {
            final SymbolGroup newParent = symbolGroupRepository.findById(group.getParentId()).orElse(null);
            checkAccess(user, project, newParent);

            // remove group from old parent
            if (groupInDB.getParent() != null) {
                if (newParent.isDescendantOf(groupInDB)) {
                    throw new ValidationException("A group cannot be moved to a child group.");
                }
                groupInDB.getParent().getGroups().remove(groupInDB);
                symbolGroupRepository.save(groupInDB.getParent());
            }

            // add group to new parent
            newParent.getGroups().add(groupInDB);
            groupInDB.setParent(newParent);
            symbolGroupRepository.save(newParent);
            group.setName(createGroupName(project, group));
            movedGroup = symbolGroupRepository.save(groupInDB);
        }

        initLazyRelations(user, movedGroup, EmbeddableFields.COMPLETE_SYMBOLS);
        return movedGroup;
    }

    @Override
    @Transactional
    public void delete(User user, long projectId, Long groupId) throws IllegalArgumentException, NotFoundException {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final SymbolGroup group = symbolGroupRepository.findById(groupId).orElse(null);
        checkAccess(user, project, group);

        final SymbolGroup defaultGroup = symbolGroupRepository.findFirstByProject_IdOrderByIdAsc(projectId);
        if (defaultGroup.equals(group)) {
            throw new IllegalArgumentException("You can not delete the default group of a project.");
        }

        hideSymbols(group, defaultGroup);
        for (SymbolGroup child : group.getGroups()) {
            hideSymbols(child, defaultGroup);
        }

        if (group.getParent() != null) {
            group.getParent().getGroups().remove(group);
            symbolGroupRepository.save(group.getParent());
        }

        group.setSymbols(null);
        symbolGroupRepository.delete(group);
    }

    private void hideSymbols(SymbolGroup group, SymbolGroup defaultGroup) {
        for (Symbol symbol : group.getSymbols()) {
            symbol.setGroup(defaultGroup);
            symbol.setHidden(true);
            symbolRepository.save(symbol);
        }
    }

    @Override
    public void checkAccess(User user, Project project, SymbolGroup group)
            throws NotFoundException, UnauthorizedException {
        projectDAO.checkAccess(user, project);

        if (group == null) {
            throw new NotFoundException("The group could not be found.");
        }

        if (!group.getProject().equals(project)) {
            throw new UnauthorizedException("You are not allowed to access the group.");
        }
    }

    private String createGroupName(Project project, SymbolGroup group) {
        int i = 1;
        String name = group.getName();
        while (symbolGroupRepository.findOneByProject_IdAndParent_IdAndName(project.getId(), group.getParentId(), name) != null) {
            name = name + " (" + i + ")";
            i++;
        }
        return name;
    }

    private void initLazyRelations(User user, SymbolGroup group, EmbeddableFields... embedFields) {
        Set<EmbeddableFields> fieldsToLoad = fieldsArrayToHashSet(embedFields);

        Hibernate.initialize(group.getGroups());
        Hibernate.initialize(group.getProject().getUrls());

        if (fieldsToLoad.contains(EmbeddableFields.COMPLETE_SYMBOLS)) {
            group.getSymbols().forEach(SymbolDAOImpl::loadLazyRelations);
        } else if (fieldsToLoad.contains(EmbeddableFields.SYMBOLS)) {
            try {
                List<Symbol> symbols = symbolDAO.getAll(user, group.getProjectId(), group.getId());
                group.setSymbols(new HashSet<>(symbols));
            } catch (NotFoundException e) {
                group.setSymbols(null);
            }
        }

        for (SymbolGroup child : group.getGroups()) {
            initLazyRelations(user, child, embedFields);
        }
    }

    private Set<EmbeddableFields> fieldsArrayToHashSet(EmbeddableFields[] embedFields) {
        Set<EmbeddableFields> fieldsToLoad = new HashSet<>();
        if (Arrays.asList(embedFields).contains(EmbeddableFields.ALL)) {
            fieldsToLoad.add(EmbeddableFields.COMPLETE_SYMBOLS);
        } else {
            Collections.addAll(fieldsToLoad, embedFields);
        }
        return fieldsToLoad;
    }

    /**
     * This method makes sure that all Symbols within the provided group will also be persisted.
     *
     * @param group
     *         The Group to take care of its Symbols.
     */
    private void beforePersistGroup(SymbolGroup group) {
        LOGGER.traceEntry("beforePersistGroup({})", group);

        Project project = group.getProject();

        group.getSymbols().forEach(symbol -> {
            project.addSymbol(symbol);
            symbol.setGroup(group);
            SymbolDAOImpl.beforeSymbolSave(symbol);
        });

        LOGGER.traceExit();
    }
}
