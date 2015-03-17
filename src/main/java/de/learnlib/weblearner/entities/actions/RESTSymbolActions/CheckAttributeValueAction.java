package de.learnlib.weblearner.entities.actions.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebServiceConnector;
import de.learnlib.weblearner.utils.JSONHelpers;
import de.learnlib.weblearner.utils.SearchHelper;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * RESTSymbolAction to check if the request body of the last request has a JSON Attribute with a specific value.
 */
@Entity
@DiscriminatorValue("rest_checkAttributeValue")
@JsonTypeName("rest_checkAttributeValue")
public class CheckAttributeValueAction extends RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -3411541294360335382L;

    /** The name of the attribute to check for. */
    private String attribute;

    /** The expected value of the attribute. */
    private String value;

    /** Field to determine if the search string is a regular expression. */
    private boolean regexp;

    /**
     * Get the field name of the requested attribute.
     *
     * @return The name of the attribute.
     */
    public String getAttribute() {
        return attribute;
    }

    @JsonIgnore
    public String getAttributeWithVariableValues() {
        return insertVariableValues(attribute);
    }

    /**
     * Set the field name of the attribute which should be searched for.
     *
     * @param attribute
     *         The name of the attribute.
     */
    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    /**
     * Get the expected value of the attribute.
     *
     * @return The expected attribute value.
     */
    public String getValue() {
        return value;
    }

    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    /**
     * Set the expected value of the attribute.
     *
     * @param value
     *         The new expected attribute value.
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
        String body = target.getBody();
        String valueInTheBody = JSONHelpers.getAttributeValue(body, getAttributeWithVariableValues());

        if (valueInTheBody != null && SearchHelper.search(getValueWithVariableValues(), valueInTheBody, regexp)) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }


}
