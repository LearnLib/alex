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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.dao.FileDAO;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectEnvironment;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import java.util.ArrayList;
import java.util.List;

public class PreparedContextHandler {
    private final CounterDAO counterDAO;
    private final FileDAO fileDAO;
    private final User user;
    private final Project project;
    private final WebDriverConfig driverConfig;
    private final ParameterizedSymbol resetSymbol;
    private final ParameterizedSymbol postSymbol;

    public PreparedContextHandler(CounterDAO counterDAO,
                                  FileDAO fileDAO,
                                  User user,
                                  Project project,
                                  WebDriverConfig driverConfig,
                                  ParameterizedSymbol resetSymbol,
                                  ParameterizedSymbol postSymbol) {
        this.counterDAO = counterDAO;
        this.fileDAO = fileDAO;
        this.user = user;
        this.project = project;
        this.driverConfig = driverConfig;
        this.resetSymbol = resetSymbol;
        this.postSymbol = postSymbol;
    }

    public ConnectorContextHandler create(ProjectEnvironment environment) {
        final List<Counter> counters = new ArrayList<>();
        try {
            counters.addAll(counterDAO.getAll(user, project.getId()));
        } catch (NotFoundException e) {
            e.printStackTrace();
        }

        final ConnectorManager connectors = new ConnectorManager(environment);
        connectors.addConnector(new WebSiteConnector(environment, driverConfig));
        connectors.addConnector(new WebServiceConnector(environment));
        connectors.addConnector(new CounterStoreConnector(counterDAO, user, project, counters));
        connectors.addConnector(new VariableStoreConnector());
        connectors.addConnector(new FileStoreConnector(fileDAO, user));

        return new ConnectorContextHandler(connectors, resetSymbol, postSymbol);
    }
}
