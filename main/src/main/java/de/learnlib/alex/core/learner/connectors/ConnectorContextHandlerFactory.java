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

import de.learnlib.alex.core.entities.Project;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

/**
 * Factor to create a ContextHandler which knows all available connectors.
 */
@Service
public class ConnectorContextHandlerFactory {

    /** The CounterStoreConnector to use. Will be injected. */
    @Inject
    private CounterStoreConnector counterStoreConnector;

    /**
     * Factor to create a ContextHandler which knows all available connectors.
     *
     * @param project
     *         The current project in which the context should be.
     * @param browser
     *         The browser to use for the frontend learning.
     *
     * @return A ContextHandler for the project with all the connectors.
     */
    public ConnectorContextHandler createContext(Project project, WebBrowser browser) {
        ConnectorContextHandler context = new ConnectorContextHandler();

        List<String> urls = new ArrayList<>();
        urls.add(project.getBaseUrl());
        urls.addAll(project.getMirrorUrls());

        urls.forEach(url -> {
            ConnectorManager connectorManager = new ConnectorManager();
            connectorManager.addConnector(WebSiteConnector.class, new WebSiteConnector(url, browser));
            connectorManager.addConnector(WebServiceConnector.class, new WebServiceConnector(url));
            connectorManager.addConnector(CounterStoreConnector.class, counterStoreConnector);
            connectorManager.addConnector(VariableStoreConnector.class, new VariableStoreConnector());
            connectorManager.addConnector(FileStoreConnector.class, new FileStoreConnector());
            context.addConnectorManager(connectorManager);
        });

        return context;
    }
}
