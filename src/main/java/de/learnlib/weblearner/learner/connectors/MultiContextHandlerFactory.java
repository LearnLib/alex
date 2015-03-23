package de.learnlib.weblearner.learner.connectors;

import de.learnlib.weblearner.entities.Project;

public class MultiContextHandlerFactory {

    public MultiContextHandler createContext(Project project) {
        MultiContextHandler context = new MultiContextHandler();
        String baseUrl = project.getBaseUrl();

        context.addConnector(new WebSiteConnector(baseUrl));
        context.addConnector(new WebServiceConnector(baseUrl));
        context.addConnector(new CounterStoreConnector());
        context.addConnector(new VariableStoreConnector());

        return context;
    }


}
