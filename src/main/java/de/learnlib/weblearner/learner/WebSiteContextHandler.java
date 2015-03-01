package de.learnlib.weblearner.learner;

/**
 * Class to deal with the context of a classical web site.
 */
public class WebSiteContextHandler extends AbstractContextHandlerWithCounter<WebSiteConnector> {

    /** The connector to use to the world. */
    private WebSiteConnector connector;

    /**
     * Constructor.
     *
     * @param baseUrl
     *         The base URL of the SUL used by the connector. All other paths will treated as suffix to this.
     */
    public WebSiteContextHandler(String baseUrl) {
        resetCounter();
        this.connector = new WebSiteConnector(baseUrl);
    }

    @Override
    public WebSiteConnector createContext() {
        incrementCounter();
        this.connector.clearBrowserData();
        return connector;
    }

    @Override
    public void disposeContext(WebSiteConnector context) {
        // nothing to do here
    }

}
