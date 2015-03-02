package de.learnlib.weblearner.learner.connectors;

import de.learnlib.mapper.ContextExecutableInputSUL;

/**
 * Class to deal with the context of a classical web site.
 */
public class WebSiteContextHandler implements ContextExecutableInputSUL.ContextHandler<WebSiteConnector> {

    /** The connector to use to the world. */
    private WebSiteConnector connector;

    /**
     * Constructor.
     *
     * @param baseUrl
     *         The base URL of the SUL used by the connector. All other paths will treated as suffix to this.
     */
    public WebSiteContextHandler(String baseUrl) {
        this.connector = new WebSiteConnector(baseUrl);
    }

    @Override
    public WebSiteConnector createContext() {
        this.connector.clearBrowserData();
        return connector;
    }

    @Override
    public void disposeContext(WebSiteConnector context) {
        // nothing to do here
    }

}
