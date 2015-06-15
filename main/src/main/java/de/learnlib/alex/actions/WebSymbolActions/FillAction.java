package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Lob;

/**
 * Action to enter a text into a specific element.
 */
@Entity
@DiscriminatorValue("web_fill")
@JsonTypeName("web_fill")
public class FillAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 8595076806577663223L;

    /**
     * The node to look for.
     * @requiredField
     */
    @NotBlank
    @Column(columnDefinition = "CLOB")
    private String node;

    /**
     * The Value to insert.
     * @requiredField
     */
    @NotBlank
    private String value;

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

    /**
     * Get the value used to fill the element.
     * 
     * @return The value.
     */
    public String getValue() {
        return value;
    }

    /**
     * Get the value used to fill the element.
     * All variables and counters will be replaced with their values.
     *
     * @return The value.
     */
    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
    }

    /**
     * Set the value to be used when filling the element.
     * 
     * @param value
     *            The new value.
     */
    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            WebElement element = connector.getElement(getNodeWithVariableValues());
            element.clear();
            element.sendKeys(getValueWithVariableValues());
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            return getFailedOutput();
        }
    }

}
