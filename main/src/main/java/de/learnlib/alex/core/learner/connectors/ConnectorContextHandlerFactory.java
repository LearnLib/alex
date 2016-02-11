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

/**
 * Factor to create a ContextHandler which knows all available connectors.
 */
@Service
public class ConnectorContextHandlerFactory {

    /**
     * Factor to create a ContextHandler which knows all available connectors.
     *
     * @param project
     *         The current project in which the context should be.
     * @param browser
     *         The browser to use for the frontend learning.
     * @return A ContextHandler for the project with all the connectors.
     */
    public ConnectorContextHandler createContext(Project project, WebBrowser browser) {
        ConnectorContextHandler context = new ConnectorContextHandler();
        String baseUrl = project.getBaseUrl();

        context.addConnector(new WebSiteConnector(baseUrl, browser));
        context.addConnector(new WebServiceConnector(baseUrl));
        context.addConnector(new CounterStoreConnector());
        context.addConnector(new VariableStoreConnector());
        context.addConnector(new FileStoreConnector());

        return context;
    }


}
