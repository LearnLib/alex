package de.learnlib.weblearner.entities.WebSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.learner.MultiConnector;
import de.learnlib.weblearner.learner.WebSiteConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Base for the different action a test could do.
 * This action layer is basically a wrapper around Selenium to be more OO and can be (de-)serialized in JSON.
 */
@Entity
@DiscriminatorValue("web")
@JsonTypeName("web")
public abstract class WebSymbolAction extends SymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = -1990239222213631726L;

    @Override
    public ExecuteResult execute(MultiConnector target) {
        return execute((WebSiteConnector) target.getConnector(WebSiteConnector.class));
    }

    protected abstract ExecuteResult execute(WebSiteConnector connector);

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber - auto generated by Eclipse

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (int) (id ^ (id >>> 32));
        return result;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        WebSymbolAction other = (WebSymbolAction) obj;
        if (id != other.id) {
            return false;
        }
        return true;
    }

    //CHECKSTYLE.ON: AvoidInlineConditionals|MagicNumber

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "WebSymbolsAction[" + id + "] " + getClass().getName();
    }

}
