/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.entities.BrowserConfig;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Factor to create a ContextHandler which knows all available connectors.
 */
@Service
public class ConnectorContextHandlerFactory {

    /** The {@link CounterDAO}. */
    @Autowired
    private CounterDAO counterDAO;

    /**
     * Factor to create a ContextHandler which knows all available connectors.
     *
     * @param user
     *         The user that executes the learning experiment.
     * @param project
     *         The current project in which the context should be.
     * @param browser
     *         The browser to use for the frontend learning.
     *
     * @return A ContextHandler for the project with all the connectors.
     */
    public ConnectorContextHandler createContext(User user, Project project, BrowserConfig browser) {
        ConnectorContextHandler context = new ConnectorContextHandler();

        List<String> urls = new ArrayList<>();
        urls.add(project.getBaseUrl());
        urls.addAll(project.getMirrorUrls());

        List<Counter> counters;
        try {
            counters = counterDAO.getAll(user.getId(), project.getId());
        } catch (NotFoundException e) {
            counters = new ArrayList<>();
        }

        for (String url: urls) {
            ConnectorManager connectorManager = new ConnectorManager();
            connectorManager.addConnector(new WebSiteConnector(url, browser));
            connectorManager.addConnector(new WebServiceConnector(url));
            connectorManager.addConnector(new CounterStoreConnector(counterDAO, user, project, counters));
            connectorManager.addConnector(new VariableStoreConnector());
            connectorManager.addConnector(new FileStoreConnector());
            context.addConnectorManager(connectorManager);
        }

        return context;
    }
}
