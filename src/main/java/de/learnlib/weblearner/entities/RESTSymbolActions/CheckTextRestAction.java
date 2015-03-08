package de.learnlib.weblearner.entities.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebServiceConnector;
import de.learnlib.weblearner.utils.SearchHelper;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * RESTSymbolAction to check if the response body of the last request contains a certain text.
 */
@Entity
@DiscriminatorValue("rest_checkForText")
@JsonTypeName("rest_checkForText")
public class CheckTextRestAction extends RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -681951086735590790L;

    /** The expected text in the response body of the last request. */
    private String value;

    /** Field to determine if the search string is a regular expression. */
    private boolean regexp;

    /**
     * Get the value which should be in the body of the last request.
     *
     * @return The value to search for.
     */
    public String getValue() {
        return value;
    }

    /**
     * Set the value which will be searched in the last response body.
     *
     * @param value
     *         The value to search for.
     */
    public void setValue(String value) {
        this.value = value;
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
     *         true if the value is a regular expression.
     */
    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        return SearchHelper.search(value, target.getBody(), regexp);
    }

}
