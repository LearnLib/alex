package de.learnlib.weblearner.learner.connectors;

import de.learnlib.weblearner.entities.Project;

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
