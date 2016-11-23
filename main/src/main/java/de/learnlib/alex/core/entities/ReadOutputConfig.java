package de.learnlib.alex.core.entities;

import de.learnlib.alex.core.learner.connectors.WebBrowser;

/**
 * Helper object that is used to test words.
 */
public class ReadOutputConfig {

    /**
     * The sequence of symbols that should be tested.
     */
    private SymbolSet symbols;

    /**
     * The web browser the word should be executed in.
     */
    private WebBrowser browser;

    /**
     * Constructor.
     */
    public ReadOutputConfig() {
    }

    /**
     * @return The symbols.
     */
    public SymbolSet getSymbols() {
        return symbols;
    }

    /**
     * @param symbols The symbols.
     */
    public void setSymbols(SymbolSet symbols) {
        this.symbols = symbols;
    }

    /**
     * @return The browser.
     */
    public WebBrowser getBrowser() {
        return browser;
    }

    /**
     * @param browser The browser.
     */
    public void setBrowser(WebBrowser browser) {
        this.browser = browser;
    }
}
