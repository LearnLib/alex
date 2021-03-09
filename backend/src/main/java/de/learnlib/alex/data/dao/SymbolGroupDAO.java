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

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.EntityLockedException;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import de.learnlib.alex.data.entities.SymbolGroup;
import de.learnlib.alex.data.entities.SymbolStep;
import de.learnlib.alex.data.entities.export.SymbolGroupsImportableEntity;
import de.learnlib.alex.data.entities.export.SymbolImportConflictResolutionStrategy;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.data.repositories.SymbolGroupRepository;
import de.learnlib.alex.data.repositories.SymbolRepository;
import de.learnlib.alex.websocket.services.SymbolPresenceService;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.ValidationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of a SymbolGroupDAO using Spring Data.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class SymbolGroupDAO {

    /** The format for archived symbols. */
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMdd-HH:mm:ss");

    private static final Logger logger = LoggerFactory.getLogger(SymbolGroupDAO.class);

    private final ProjectRepository projectRepository;
    private final ProjectDAO projectDAO;
    private final SymbolGroupRepository symbolGroupRepository;
    private final SymbolRepository symbolRepository;
    private final SymbolDAO symbolDAO;
    private final ObjectMapper objectMapper;
    private final SymbolPresenceService symbolPresenceService;

    @Autowired
    public SymbolGroupDAO(
            ProjectRepository projectRepository,
            ProjectDAO projectDAO,
            SymbolGroupRepository symbolGroupRepository,
            SymbolRepository symbolRepository,
            @Lazy SymbolDAO symbolDAO,
            ObjectMapper objectMapper,
            @Lazy SymbolPresenceService symbolPresenceService) {
        this.projectRepository = projectRepository;
        this.projectDAO = projectDAO;
        this.symbolGroupRepository = symbolGroupRepository;
        this.symbolRepository = symbolRepository;
        this.symbolDAO = symbolDAO;
        this.objectMapper = objectMapper;
        this.symbolPresenceService = symbolPresenceService;
    }

    public List<SymbolGroup> importGroups(User user, Long projectId, SymbolGroupsImportableEntity importableEntity) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        try {
            final var symbolGroupsAsString = importableEntity.getSymbolGroups().toString();
            final var symbolGroups = objectMapper.readValue(symbolGroupsAsString, SymbolGroup[].class);
            return importGroups(user, project, Arrays.asList(symbolGroups), importableEntity.getConflictResolutions());
        } catch (IOException e) {
            throw new ValidationException("The input could not be parsed");
        }
    }

    public List<SymbolGroup> importGroups(
            User user,
            Project project,
            List<SymbolGroup> groups,
            Map<String, SymbolImportConflictResolutionStrategy> conflictResolutions
    ) {
        projectDAO.checkAccess(user, project);

        // name -> symbol
        // save symbols steps
        final Map<String, List<SymbolStep>> symbolNameToStepsMap = new HashMap<>();
        groups.forEach(group -> group.walk(g -> null, s -> {
            symbolNameToStepsMap.put(s.getName(), s.getSteps());
            s.setSteps(new ArrayList<>());
            return null;
        }));

        // create symbol groups and symbols without steps
        // because one might reference names of symbols in steps that have not yet been created
        final List<SymbolGroup> importedGroups = importGroups(user, project, groups, null, conflictResolutions);

        // create symbol steps
        final Map<Long, List<SymbolStep>> symbolIdToStepsMap = new HashMap<>();
        final List<Symbol> symbols = symbolDAO.getAll(user, project.getId()).stream()
                .filter(s -> symbolNameToStepsMap.containsKey(s.getName()))
                .collect(Collectors.toList());

        symbols.forEach(s -> symbolIdToStepsMap.put(s.getId(), symbolNameToStepsMap.get(s.getName())));

        symbolDAO.saveSymbolSteps(project.getId(), symbols, symbolIdToStepsMap);

        return importedGroups;
    }

    private List<SymbolGroup> importGroups(
            User user,
            Project project,
            List<SymbolGroup> groups,
            SymbolGroup parent, Map<String,
            SymbolImportConflictResolutionStrategy> conflictResolutions
    ) {
        final List<SymbolGroup> importedGroups = new ArrayList<>();
        for (SymbolGroup group : groups) {
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
            symbolDAO.importSymbols(user, project, new ArrayList<>(symbols), conflictResolutions);

            final var createdChildGroups = importGroups(user, project, children, createdGroup, conflictResolutions);
            createdGroup.setGroups(createdChildGroups);
            importedGroups.add(createdGroup);
        }
        return importedGroups;
    }

    public SymbolGroup create(User user, Long projectId, SymbolGroup group) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        group.setId(null);
        group.setName(createGroupName(project, group));
        group.setProject(project);
        project.addGroup(group);
        beforePersistGroup(group);

        if (group.getParentId() != null) {
            final SymbolGroup parent = symbolGroupRepository.findById(group.getParentId()).orElse(null);
            checkAccess(user, project, parent);

            group.setParent(parent);
            parent.getGroups().add(parent);
            symbolGroupRepository.save(parent);
        }

        return symbolGroupRepository.save(group);
    }

    public List<SymbolGroup> create(User user, Long projectId, List<SymbolGroup> groups) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final List<SymbolGroup> createdGroups = create(user, project, groups, null);
        createdGroups.forEach(this::loadLazyRelations);
        return groups;
    }

    private List<SymbolGroup> create(User user, Project project, List<SymbolGroup> groups, SymbolGroup parent) {
        final List<SymbolGroup> createdGroups = new ArrayList<>();
        for (SymbolGroup group : groups) {
            createdGroups.add(create(user, project, group, parent));
        }
        return createdGroups;
    }

    private SymbolGroup create(User user, Project project, SymbolGroup group, SymbolGroup parent) {
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

    public List<SymbolGroup> getAll(User user, long projectId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        projectDAO.checkAccess(user, project);

        final var groups = symbolGroupRepository.findAllByProject_IdAndParent_id(projectId, null);
        for (SymbolGroup group : groups) {
            loadLazyRelations(group);
        }

        return groups;
    }

    public SymbolGroup get(User user, long projectId, Long groupId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final SymbolGroup group = symbolGroupRepository.findById(groupId).orElse(null);
        checkAccess(user, project, group);

        loadLazyRelations(group);

        return group;
    }

    public SymbolGroup update(User user, SymbolGroup group) {
        final Project project = projectRepository.findById(group.getProjectId()).orElse(null);
        final SymbolGroup groupInDB = symbolGroupRepository.findById(group.getId()).orElse(null);
        checkAccess(user, project, groupInDB);

        // check symbolgroup lock status
        this.symbolPresenceService.checkGroupLockStatus(project.getId(), group.getId());

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

        return symbolGroupRepository.save(groupInDB);
    }

    public SymbolGroup move(User user, SymbolGroup group) {
        final Project project = projectRepository.findById(group.getProjectId()).orElse(null);
        final SymbolGroup groupInDB = symbolGroupRepository.findById(group.getId()).orElse(null);
        checkAccess(user, project, groupInDB);

        // check symbolgroup lock status
        this.symbolPresenceService.checkGroupLockStatus(project.getId(), group.getId());

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

        loadLazyRelations(movedGroup);
        return movedGroup;
    }

    public void delete(User user, long projectId, Long groupId) {
        final Project project = projectRepository.findById(projectId).orElse(null);
        final SymbolGroup group = symbolGroupRepository.findById(groupId).orElse(null);
        checkAccess(user, project, group);
        checkRunningProcesses(user, project, group);

        // check symbolgroup lock status
        this.symbolPresenceService.checkGroupLockStatus(projectId, groupId);

        final SymbolGroup defaultGroup = symbolGroupRepository.findFirstByProject_IdOrderByIdAsc(projectId);
        if (defaultGroup.equals(group)) {
            throw new IllegalArgumentException("You can not delete the default group of a project.");
        }

        group.walk(g -> {
            hideSymbols(g, defaultGroup);
            return null;
        }, s -> null);

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
            final Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            symbol.setName(symbol.getName() + "--" + DATE_FORMAT.format(timestamp));
            symbolRepository.save(symbol);
        }
    }

    public void checkAccess(User user, Project project, SymbolGroup group) {
        projectDAO.checkAccess(user, project);

        if (group == null) {
            throw new NotFoundException("The group could not be found.");
        }

        if (!group.getProject().equals(project)) {
            throw new UnauthorizedException("You are not allowed to access the group.");
        }
    }

    public void checkRunningProcesses(User user, Project project, SymbolGroup symbolGroup) {
        if (this.getActiveSymbolGroups(user, project).stream().anyMatch(sg -> sg.getId().equals(symbolGroup.getId()))) {
            throw new EntityLockedException("The SymbolGroup is currently used in the active test or learning process.");
        }
    }

    public Set<SymbolGroup> getActiveSymbolGroups(User user, Project project) {
        Set<SymbolGroup> result = new HashSet<>();

        this.symbolDAO.getActiveSymbols(user, project).forEach(s -> {
            result.add(s.getGroup());
            result.addAll(extractAncestorSymbolGroups(s.getGroup()));
            result.addAll(extractDescendantSymbolGroups(s.getGroup()));
        });

        return result;
    }

    private Set<SymbolGroup> extractDescendantSymbolGroups(SymbolGroup symbolGroup) {
        Set<SymbolGroup> result = new HashSet<>();

        symbolGroup.getGroups().forEach(descendant -> {
            result.add(descendant);
            result.addAll(extractDescendantSymbolGroups(descendant));
        });

        return result;
    }

    public Set<SymbolGroup> extractAncestorSymbolGroups(SymbolGroup symbolGroup) {
        Set<SymbolGroup> result = new HashSet<>();

        Optional.ofNullable(symbolGroup.getParent())
                .ifPresent(ancestor -> {
                    result.add(ancestor);
                    result.addAll(extractAncestorSymbolGroups(ancestor));
                });

        return result;
    }

    private String createGroupName(Project project, SymbolGroup group) {
        int i = 1;
        String name = group.getName();
        while (symbolGroupRepository.findOneByProject_IdAndParent_IdAndName(project.getId(), group.getParentId(), name) != null) {
            name = group.getName() + " (" + i + ")";
            i++;
        }
        return name;
    }

    private void loadLazyRelations(SymbolGroup group) {
        Hibernate.initialize(group.getGroups());
        Hibernate.initialize(group.getSymbols());
        group.getSymbols().forEach(SymbolDAO::loadLazyRelations);

        for (SymbolGroup g : group.getGroups()) {
            loadLazyRelations(g);
        }
    }

    /**
     * This method makes sure that all Symbols within the provided group will also be persisted.
     *
     * @param group
     *         The Group to take care of its Symbols.
     */
    private void beforePersistGroup(SymbolGroup group) {
        final Project project = group.getProject();

        group.getSymbols().forEach(symbol -> {
            project.addSymbol(symbol);
            symbol.setGroup(group);
            SymbolDAO.beforeSymbolSave(symbol);
        });
    }
}
