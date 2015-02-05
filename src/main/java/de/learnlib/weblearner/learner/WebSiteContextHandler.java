package de.learnlib.weblearner.learner;

import de.learnlib.weblearner.entities.WebSymbol;

/**
 * Class to deal with the context of a classical web site.
 */
public class WebSiteContextHandler extends AbstractContextHandlerWithCounter<WebSiteConnector> {

    /** The connector to use to the world. */
    private WebSiteConnector connector;

    /** The Symbol to do a reset of the SUL. */
    private final WebSymbol resetSymbol;

    /**
     * Constructor.
     *
     * @param baseUrl
     *         The base URL of the SUL used by the connector. All other paths will treated as suffix to this.
     * @param resetSymbol
     *         A symbol to reset the system .
     */
    public WebSiteContextHandler(String baseUrl, WebSymbol resetSymbol) {
        resetCounter();
        this.resetSymbol = resetSymbol;
        this.connector = new WebSiteConnector(baseUrl);
    }

    @Override
    public WebSiteConnector createContext() {
        incrementCounter();
        resetSymbol.execute(connector);
        return connector;
    }

    @Override
    public void disposeContext(WebSiteConnector context) {
        // nothing to do here
    }

}
