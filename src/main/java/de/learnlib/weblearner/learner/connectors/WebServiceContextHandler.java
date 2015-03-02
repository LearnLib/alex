package de.learnlib.weblearner.learner.connectors;

import de.learnlib.mapper.ContextExecutableInputSUL;

/**
 * Class to deal with the context of a classical web service.
 */
public class WebServiceContextHandler implements ContextExecutableInputSUL.ContextHandler<WebServiceConnector> {

    /** The WebServiceConnect used for the learning. */
    private WebServiceConnector connector;

    /**
     * Constructor.
     *
     * @param baseUrl
     *         The base URL of the SUL used by the connector. All other paths will treated as suffix to this.
     */
    public WebServiceContextHandler(String baseUrl) {
        this.connector = new WebServiceConnector(baseUrl);
    }

    @Override
    public WebServiceConnector createContext() {
        return connector;
    }

    @Override
    public void disposeContext(WebServiceConnector context) {
        // nothing to do here
    }

}
