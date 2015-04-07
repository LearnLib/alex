package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.entities.Project;

public class ConnectorContextHandlerFactory {

    public ConnectorContextHandler createContext(Project project) {
        ConnectorContextHandler context = new ConnectorContextHandler();
        String baseUrl = project.getBaseUrl();

        context.addConnector(new WebSiteConnector(baseUrl));
        context.addConnector(new WebServiceConnector(baseUrl));
        context.addConnector(new CounterStoreConnector());
        context.addConnector(new VariableStoreConnector());

        return context;
    }


}
