package de.learnlib.alex.learning.entities;

import de.learnlib.alex.config.entities.BrowserConfig;

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
    private BrowserConfig browser;

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
    public BrowserConfig getBrowser() {
        return browser;
    }

    /**
     * @param browser The browser.
     */
    public void setBrowser(BrowserConfig browser) {
        this.browser = browser;
    }
}
