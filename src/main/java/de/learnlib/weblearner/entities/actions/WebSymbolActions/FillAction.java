package de.learnlib.weblearner.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebSiteConnector;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

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
     * The information to identify the element.
     * @requiredField
     */
    private String node;

    /**
     * The Value to insert.
     * @requiredField
     */
    private String value;

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

    /**
     * Get the value used to fill the element.
     * 
     * @return The value.
     */
    public String getValue() {
        return value;
    }

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
