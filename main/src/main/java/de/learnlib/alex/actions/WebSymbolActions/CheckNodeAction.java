package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import de.learnlib.alex.utils.CSSUtils;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to check for a specific element/ a specific text.
 */
@Entity
@DiscriminatorValue("web_checkForNode")
@JsonTypeName("web_checkForNode")
public class CheckNodeAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -3884454109124323412L;

    /** The value the site is checked for. */
    @NotBlank
    private String value;

    /**
     * Get the value to check.
     * 
     * @return The value to check.
     */
    public String getValue() {
        return value;
    }

    /**
     * Get the value to check.
     * All variables and counters will be replaced with their values.
     *
     * @return The value to check.
     */
    @JsonIgnore
    public String getValueWithVariableValues() {
        return insertVariableValues(value);
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

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            connector.getElement(CSSUtils.escapeSelector(getValueWithVariableValues()));
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            return getFailedOutput();
        }
    }

}
