package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to submit a specific element.
 */
@Entity
@DiscriminatorValue("web_submit")
@JsonTypeName("web_submit")
public class SubmitAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 3054489976413991003L;

    /** The information to identify the element. */
    @NotBlank
    @Column(columnDefinition = "CLOB")
    private String node;

    /**
     * Get the node to look for.
     *
     * @return The node to look for.
     */
    public String getNode() {
        return node;
    }

    /**
     * Get the node to look for.
     * All variables and counters will be replaced with their values.
     *
     * @return The node to look for.
     */
    @JsonIgnore
    public String getNodeWithVariableValues() {
        return insertVariableValues(node);
    }

    /**
     * Set the node to check for.
     *
     * @param node
     *         The new node to check for.
     */
    public void setNode(String node) {
        this.node = node;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            connector.getElement(getNodeWithVariableValues()).submit();
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            return getFailedOutput();
        }
    }

}
