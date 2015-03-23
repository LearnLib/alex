package de.learnlib.weblearner.entities.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebSiteConnector;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.UnexpectedTagNameException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("web_select")
@JsonTypeName("web_select")
public class SelectAction extends FillAction {

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            WebElement selectElement = connector.getElement(getNodeWithVariableValues());
            Select select = new Select(selectElement);
            select.deselectAll();
            select.selectByVisibleText(getValueWithVariableValues());
            return getSuccessOutput();
        } catch (NoSuchElementException | UnexpectedTagNameException e) {
            return getFailedOutput();
        }
    }
}
