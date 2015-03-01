package de.learnlib.weblearner.entities.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.WebServiceConnector;
import de.learnlib.weblearner.utils.JSONHelpers;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * RESTSymbolAction to check if the request body of the last request has a JSON attribute with a specific name.
 */
@Entity
@DiscriminatorValue("checkAttributeExists")
@JsonTypeName("rest_checkAttributeExists")
public class CheckAttributeExistsAction extends RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 6739027451651950338L;

    /** The name of the attribute to check for. */
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

        if (JSONHelpers.getAttributeValue(body, attribute) != null) {
            return ExecuteResult.OK;
        } else {
            return ExecuteResult.FAILED;
        }
    }

}
