package de.learnlib.weblearner.learner;

import de.learnlib.weblearner.entities.RESTSymbol;

/**
 * Class to deal with the context of a classical web service.
 */
public class WebServiceContextHandler extends AbstractContextHandlerWithCounter<WebServiceConnector> {


    /** The WebServiceConnect used for the learning. */
    private WebServiceConnector connector;

    /** The Symbol to do a reset of the SUL. */
    private final RESTSymbol resetSymbol;

    /**
     * Constructor.
     *
     * @param baseUrl
     *         The base URL of the SUL used by the connector. All other paths will treated as suffix to this.
     * @param resetSymbol
     *         A symbol to reset the system .
     */
    public WebServiceContextHandler(String baseUrl, RESTSymbol resetSymbol) {
        resetCounter();
        this.resetSymbol = resetSymbol;
        this.connector = new WebServiceConnector(baseUrl);
    }

    @Override
    public WebServiceConnector createContext() {
        incrementCounter();
        resetSymbol.execute(connector);
        return connector;
    }

    @Override
    public void disposeContext(WebServiceConnector context) {
        // nothing to do here
    }

}
