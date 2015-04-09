package de.learnlib.alex.actions.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebServiceConnector;
import de.learnlib.alex.utils.JSONHelpers;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * RESTSymbolAction to check if the request body of the last request has a JSON attribute with a specific name.
 */
@Entity
@DiscriminatorValue("rest_checkAttributeExists")
@JsonTypeName("rest_checkAttributeExists")
public class CheckAttributeExistsAction extends RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 6739027451651950338L;

    /** The name of the attribute to check for. */
    @NotBlank
    private String attribute;

    /**
     * Get the field name of the requested attribute.
     *
     * @return The name of the attribute.
     */
    public String getAttribute() {
        return attribute;
    }

    /**
     * Get the field name of the requested attribute.
     * All variables and counters will be replaced with their values.
     *
     * @return The name of the attribute.
     */
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

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        String body = target.getBody();

        if (JSONHelpers.getAttributeValue(body, getAttributeWithVariableValues()) != null) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

}
