package de.learnlib.alex.actions.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.learner.connectors.WebSiteConnector;
import de.learnlib.alex.utils.SearchHelper;
import org.hibernate.validator.constraints.NotBlank;
import org.openqa.selenium.WebDriver;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to check the page title.
 */
@Entity
@DiscriminatorValue("web_checkPageTitle")
@JsonTypeName("web_checkPageTitle")
public class CheckPageTitleAction extends WebSymbolAction {

    /** The title of the web page. */
    @NotBlank
    private String title;

    /**
     * Field to determine if the search string is a regular expression.
     * Only works while searching for text.
     */
    private boolean regexp;

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        WebDriver driver = connector.getDriver();
        if (SearchHelper.search(getTitleWithVariableValues(), driver.getTitle(), regexp)) {
            return getSuccessOutput();
        } else {
            return getFailedOutput();
        }
    }

    /**
     * Get the title to check.
     * All variables and counters will be replaced with their values.
     *
     * @return The title to check.
     */
    @JsonIgnore
    public String getTitleWithVariableValues() {
        return insertVariableValues(title);
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isRegexp() {
        return regexp;
    }

    public void setRegexp(boolean regexp) {
        this.regexp = regexp;
    }
}
