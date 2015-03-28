package de.learnlib.weblearner.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebSiteConnector;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("web_clickLinkByText")
@JsonTypeName("web_clickLinkByText")
public class ClickLinkAction extends WebSymbolAction {

    /** The value the site is checked for. */
    private String value;

    /**
     * Get the value to check.
     *
     * @return The value to check.
     */
    public String getValue() {
        return value;
    }

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
            WebElement element = connector.getLinkByText(getValueWithVariableValues());
            element.click();
            return getSuccessOutput();
        } catch (NoSuchElementException e) {
            return getFailedOutput();
        }
    }
}
