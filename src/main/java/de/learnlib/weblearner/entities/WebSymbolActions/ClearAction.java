package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebSiteConnector;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to clear on a specific element.
 */
@Entity
@DiscriminatorValue("web_clear")
@JsonTypeName("web_clear")
public class ClearAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -255670058811890900L;

    /** The information to identify the element. */
    private String node;

    /**
     * Get the information to identify the element.
     * 
     * @return The element identifier.
     */
    public String getNode() {
        return node;
    }

    @JsonIgnore
    public String getNodeWithVariableValues() {
        return insertVariableValues(node);
    }

    /**
     * Set the information to identify the element.
     * 
     * @param node
     *            The new element identifier.
     */
    public void setNode(String node) {
        this.node = node;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            connector.getElement(getNodeWithVariableValues()).clear();
            return ExecuteResult.OK;
        } catch (NoSuchElementException e) {
            return ExecuteResult.FAILED;
        }
    }

}
