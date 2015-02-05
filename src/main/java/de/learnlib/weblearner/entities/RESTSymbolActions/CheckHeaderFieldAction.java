package de.learnlib.weblearner.entities.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.WebServiceConnector;
import de.learnlib.weblearner.utils.SearchHelper;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.List;

/**
 * RESTSymbolAction to check the HTTP Header fields of the last request.
 */
@Entity
@DiscriminatorValue("checkHeaderField")
@JsonTypeName("checkHeaderField")
public class CheckHeaderFieldAction extends RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -7234083244640666736L;

    /** The key of the header field to check for the value. */
    private String key;

    /** The expected value which should be in the header field. */
    private String value;

    /** Field to determine if the search string is a regular expression. */
    private boolean regexp;

    /**
     * Get the key of the header field to inspect.
     *
     * @return The key of the header field.
     */
    public String getKey() {
        return key;
    }

    /**
     * Set the key of the header field to inspect.
     *
     * @param key
     *         The new key of the header field.
     */
    public void setKey(String key) {
        this.key = key;
    }

    /**
     * Get the expected value of the header field.
     *
     * @return The value to search for.
     */
    public String getValue() {
        return value;
    }

    /**
     * Set the value which should be inside of the header field.
     *
     * @param value
     *         The new value to look for.
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
    public ExecuteResult execute(WebServiceConnector connector) {
        List<Object> headerFieldValues = connector.getHeaders().get(key);
        if (headerFieldValues == null) {
            return ExecuteResult.FAILED;
        } else if (!regexp && headerFieldValues.contains(value)) {
            return ExecuteResult.OK;
        } else if (regexp) {
            ExecuteResult tmpResult = ExecuteResult.FAILED;
            for (int i = 0; i < headerFieldValues.size() && tmpResult == ExecuteResult.FAILED; i++) {
                String headerFieldValue = headerFieldValues.get(i).toString();
                tmpResult = SearchHelper.searchWithRegex(value, headerFieldValue);
            }
            return tmpResult;
        } else {
            return ExecuteResult.FAILED;
        }
    }

}
