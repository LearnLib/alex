package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.WebSiteConnector;
import org.openqa.selenium.NoSuchElementException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Action to enter a text into a specific element.
 */
@Entity
@DiscriminatorValue("web_fill")
@JsonTypeName("fill")
public class FillAction extends WebSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 8595076806577663223L;

    /** The information to identify the element. */
    private String node;

    /** The URL of the site. */
    private String url;

    /** Dummy string to hold the type of generator to use. */
    private String generator;

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

    /**
     * Get the generator used to fill the element.
     * 
     * @return The generator in use.
     */
    public String getGenerator() {
        return generator;
    }

    /**
     * Set the generator to be used when filling the element.
     * 
     * @param generator
     *            The new generator.
     */
    public void setGenerator(String generator) {
        this.generator = generator;
    }

    @Override
    public ExecuteResult execute(WebSiteConnector connector) {
        try {
            connector.getElement(node).sendKeys(generator);
            return ExecuteResult.OK;
        } catch (NoSuchElementException e) {
            return ExecuteResult.FAILED;
        }
    }

}
