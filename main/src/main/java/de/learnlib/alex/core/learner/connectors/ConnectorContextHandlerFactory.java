package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.entities.Project;

/**
 * Factor to create a ContextHandler which knows all available connectors.
 */
public class ConnectorContextHandlerFactory {

    /**
     * Factor to create a ContextHandler which knows all available connectors.
     *
     * @param project
     *         The current project in which the context should be.
     * @return A ContextHandler for the project with all the connectors.
     */
    public ConnectorContextHandler createContext(Project project, WebSiteConnector.WebBrowser browser) {
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
