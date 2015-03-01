package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.WebSiteConnector;
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

    /** The URL of the site. */
    private String url;

    /**
     * Get the information to identify the element.
     * 
     * @return The element identifier.
     */
    public String getNode() {
        return node;
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
     * Get the URL of the site where the element is on.
     * 
     * @return The site URL the element is on.
     */
    public String getUrl() {
        return url;
    }

    /**
     * Set the URL of the site where the element is on.
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
            connector.getElement(node).clear();
            return ExecuteResult.OK;
        } catch (NoSuchElementException e) {
            return ExecuteResult.FAILED;
        }
    }

}
