package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebSiteConnector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to navigate to a new URL.
 */
@Entity
@DiscriminatorValue("web_goto")
@JsonTypeName("web_goto")
public class GotoAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -9158530821188611940L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The URL of the site. */
    private String url;

    /**
     * Get the URL this action will navigate to.
     * 
     * @return The site URL the element is on.
     */
    public String getUrl() {
        return url;
    }

    @JsonIgnore
    public String getURLWithVariableValues() {
        return insertVariableValues(url);
    }

    /**
     * Set the URL of the site where this element is navigating to..
     * 
     * @param url
     *            The new site URL.
     */
    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            connector.get(getURLWithVariableValues());
            return ExecuteResult.OK;
        } catch (Exception e) {
            LOGGER.info("Could not goto " + url, e);
            return ExecuteResult.FAILED;
        }
    }

}
