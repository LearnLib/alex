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

package de.learnlib.alex.modelchecking.dao;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.repositories.ProjectRepository;
import de.learnlib.alex.modelchecking.entities.LtsFormulaSuite;
import de.learnlib.alex.modelchecking.entities.ModelCheckingConfig;
import de.learnlib.alex.modelchecking.repositories.LtsFormulaSuiteRepository;
import de.learnlib.alex.modelchecking.repositories.ModelCheckingConfigRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public class ModelCheckingConfigDAO {

    private final LtsFormulaSuiteDAO formulaSuiteDAO;
    private final ProjectRepository projectRepository;
    private final LtsFormulaSuiteRepository ltsFormulaSuiteRepository;
    private final ModelCheckingConfigRepository modelCheckingConfigRepository;

    @Autowired
    public ModelCheckingConfigDAO(
            LtsFormulaSuiteDAO formulaSuiteDAO,
            LtsFormulaSuiteRepository ltsFormulaSuiteRepository,
            ModelCheckingConfigRepository modelCheckingConfigRepository,
            ProjectRepository projectRepository
    ) {
        this.formulaSuiteDAO = formulaSuiteDAO;
        this.ltsFormulaSuiteRepository = ltsFormulaSuiteRepository;
        this.modelCheckingConfigRepository = modelCheckingConfigRepository;
        this.projectRepository = projectRepository;
    }

    public ModelCheckingConfig create(User user, Long projectId, ModelCheckingConfig config) {
        final var formulaSuites = getFormulaSuites(user, projectId, config);

        final var configToCreate = new ModelCheckingConfig();
        configToCreate.setMinUnfolds(config.getMinUnfolds());
        configToCreate.setMultiplier(config.getMultiplier());
        configToCreate.setFormulaSuites(formulaSuites);

        final var createdConfig = modelCheckingConfigRepository.save(configToCreate);
        loadLazyRelations(createdConfig);

        return createdConfig;
    }

    public ModelCheckingConfig update(User user, Long projectId, Long configId, ModelCheckingConfig config) {
        final var configInDB = modelCheckingConfigRepository.findById(configId)
                .orElseThrow(() -> new NotFoundException("The config could not be found."));

        final var formulaSuites = getFormulaSuites(user, projectId, config);

        configInDB.setFormulaSuites(formulaSuites);
        configInDB.setMultiplier(config.getMultiplier());
        configInDB.setMinUnfolds(config.getMinUnfolds());

        final var updatedConfig = modelCheckingConfigRepository.save(configInDB);
        loadLazyRelations(updatedConfig);

        return updatedConfig;
    }

    private List<LtsFormulaSuite> getFormulaSuites(User user, Long projectId, ModelCheckingConfig config) {
        final var project = projectRepository.findById(projectId).orElse(null);

        final var formulaSuites = ltsFormulaSuiteRepository.findAllById(config.getFormulaSuites().stream()
                .map(LtsFormulaSuite::getId)
                .collect(Collectors.toSet())
        );

        for (var fs : formulaSuites) {
            formulaSuiteDAO.checkAccess(user, project, fs);
        }

        return formulaSuites;
    }

    public void loadLazyRelations(ModelCheckingConfig config) {
        Hibernate.initialize(config.getFormulaSuites());
        config.getFormulaSuites().forEach(formulaSuiteDAO::loadLazyRelations);
    }
}
