package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebSiteConnector;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to check for a specific element/ a specific text.
 */
@Entity
@DiscriminatorValue("web_checkNode")
@JsonTypeName("web_checkForNode")
public class CheckNodeAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -3884454109124323412L;

    /** The value the site is checked for. */
    private String value;

    /** The URL of the site. */
    private String url;

    /** Field to determine if the search string is a regular expression.
     * Only works while searching for text. */
    private boolean regexp;

    /**
     * Get the value to check.
     * 
     * @return The value to check.
     */
    public String getValue() {
        return value;
    }

    /**
     * Set the value to check for.
     * 
     * @param value
     *            The new value.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Get the URL of the site where to check.
     * 
     * @return The site URL.
     */
    public String getUrl() {
        return url;
    }

    /**
     * Set the URL of the site where to check.
     * 
     * @param url
     *            The new site URL.
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Should the value be treated as regular expression while searching for a text?
     *
     * @return true, if value should be a regular expression: false otherwise.
     */
    public boolean isRegexp() {
        return regexp;
    }

    /**
     * Set the flag if the value is a regular expression for the text search.
     *
     * @param regexp
     *         true if value is a regular expression.
     */
    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            connector.getElement(value);
            return ExecuteResult.OK;
        } catch (NoSuchElementException e) {
            return ExecuteResult.FAILED;
        }
    }

}
