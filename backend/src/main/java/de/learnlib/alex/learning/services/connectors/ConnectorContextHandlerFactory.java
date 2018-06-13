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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.common.exceptions.NotFoundException;
import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.dao.FileDAO;
import de.learnlib.alex.data.entities.Counter;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.learning.entities.webdrivers.AbstractWebDriverConfig;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

/**
 * Factor to create a ContextHandler which knows all available connectors.
 */
@Service
public class ConnectorContextHandlerFactory {

    /** The {@link CounterDAO}. */
    @Inject
    private CounterDAO counterDAO;

    /** The {@link CounterDAO}. */
    @Inject
    private FileDAO fileDAO;

    /**
     * Factor to create a ContextHandler which knows all available connectors.
     *
     * @param user
     *         The user that executes the learning experiment.
     * @param project
     *         The current project in which the context should be.
     * @param driverConfig
     *         The driver config to use for the frontend learning.
     * @return A ContextHandler for the project with all the connectors.
     */
    public ConnectorContextHandler createContext(User user, Project project, AbstractWebDriverConfig driverConfig) {
        return createContext(user, project, project.getUrls(), driverConfig);
    }

    /**
     * Factor to create a ContextHandler which knows all available connectors.
     *
     * @param user
     *         The user that executes the learning experiment.
     * @param project
     *         The current project in which the context should be.
     * @param urls
     *         The URLs to use for learning.
     * @param driverConfig
     *         The driver config to use for the frontend learning.
     * @return A ContextHandler for the project with all the connectors.
     */
    public ConnectorContextHandler createContext(User user, Project project, List<ProjectUrl> urls,
                                                 AbstractWebDriverConfig driverConfig) {
        final ConnectorContextHandler context = new ConnectorContextHandler();

        final List<Counter> counters = new ArrayList<>();
        try {
            counters.addAll(counterDAO.getAll(user, project.getId()));
        } catch (NotFoundException e) {
            e.printStackTrace();
        }

        for (final ProjectUrl url : urls) {
            final ConnectorManager connectorManager = new ConnectorManager();
            connectorManager.addConnector(new WebSiteConnector(url.getUrl(), driverConfig));
            connectorManager.addConnector(new WebServiceConnector(url.getUrl()));
            connectorManager.addConnector(new CounterStoreConnector(counterDAO, user, project, counters));
            connectorManager.addConnector(new VariableStoreConnector());
            connectorManager.addConnector(new FileStoreConnector(fileDAO, user));
            context.addConnectorManager(connectorManager);
        }

        return context;
    }
}
