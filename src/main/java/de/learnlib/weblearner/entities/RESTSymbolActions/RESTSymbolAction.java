package de.learnlib.weblearner.entities.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.weblearner.entities.SymbolAction;
import de.learnlib.weblearner.learner.WebServiceConnector;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Base class for all the REST specific actions.
 */
@Entity
@DiscriminatorValue("REST")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(name = "call", value = CallAction.class),
        @JsonSubTypes.Type(name = "checkAttributeExists", value = CheckAttributeExistsAction.class),
        @JsonSubTypes.Type(name = "checkAttributeType", value = CheckAttributeTypeAction.class),
        @JsonSubTypes.Type(name = "checkAttributeValue", value = CheckAttributeValueAction.class),
        @JsonSubTypes.Type(name = "checkForText", value = CheckTextRestAction.class),
        @JsonSubTypes.Type(name = "checkHeaderField", value = CheckHeaderFieldAction.class),
        @JsonSubTypes.Type(name = "checkStatus", value = CheckStatusAction.class),
})
public abstract class RESTSymbolAction extends SymbolAction<WebServiceConnector> {

        /** to be serializable. */
        private static final long serialVersionUID = -897337751104947135L;

}
