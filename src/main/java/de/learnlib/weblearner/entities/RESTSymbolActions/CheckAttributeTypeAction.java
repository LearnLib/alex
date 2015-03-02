package de.learnlib.weblearner.entities.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import de.learnlib.weblearner.entities.ExecuteResult;
import de.learnlib.weblearner.learner.connectors.WebServiceConnector;
import de.learnlib.weblearner.utils.JSONHelpers;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * RESTSymbolAction to check if the request body of the last request has a JSON attribute with a specific type.
 */
@Entity
@DiscriminatorValue("checkAttributeType")
@JsonTypeName("rest_checkAttributeType")
public class CheckAttributeTypeAction extends  RESTSymbolAction {

    /** to be serializable. */
    private static final long serialVersionUID = 6962742356381266855L;

    /**
     * Enumeration to refer to a type of a JSON field.
     */
    public enum JsonType {
        /** NULL POINTER INCOMMMMING!!!1111. */
        NULL (JsonNodeType.NULL),

        /** The attribute has a string value. */
        STRING (JsonNodeType.STRING),

        /** The attribute has a integer value. */
        INTEGER (JsonNodeType.NUMBER),

        /** The attribute has a boolean value. */
        BOOLEAN (JsonNodeType.BOOLEAN),

        /** The attribute has an object as value. */
        OBJECT (JsonNodeType.OBJECT),

        /** The attribute has an array as value. */
        ARRAY (JsonNodeType.ARRAY),

        /** The attribute has unknown or missing type. */
        UNKNOWN (JsonNodeType.MISSING);

        /** Connection between our minimal type set and the bigger one from Jackson. */
        private JsonNodeType relatedType;

        /**
         * Internal constructor to set the related types.
         *
         * @param relatedType
         *         The type use by Jackson which is equal to our system.
         */
        private JsonType(JsonNodeType relatedType) {
            this.relatedType = relatedType;
        }

        /**
         * Get the JSON type used by Jackson which is equal to the type.
         *
         * @return The equal JSON type used by Jackson.
         */
        public JsonNodeType getRelatedType() {
            return relatedType;
        }
    }

    /** The name of the attribute to check for. */
    private  String attribute;

    /** The JSON type the attribute should have. */
    private JsonType jsonType;

    /**
     * Get the field name of the requested attribute.
     *
     * @return The name of the attribute.
     */
    public String getAttribute() {
        return attribute;
    }

    /**
     * Set the field name of the attribute which should be searched for.
     *
     * @param attribute
     *         The name of the attribute.
     */
    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    /**
     * Get the expected type of the JSON attribute.
     *
     * @return The expected type of the JSON attribute.
     */
    public JsonType getJsonType() {
        return jsonType;
    }

    /**
     * Set the expected type of the JSON attribute.
     *
     * @param jsonType
     *         The expected type of the JSON attribute.
     */
    public void setJsonType(JsonType jsonType) {
        this.jsonType = jsonType;
    }

    @Override
    public ExecuteResult execute(WebServiceConnector target) {
        String body = target.getBody();
        JsonNodeType typeInBody = JSONHelpers.getAttributeType(body, attribute);

        if (typeInBody != null && typeInBody.equals(jsonType.getRelatedType())) {
            return ExecuteResult.OK;
        } else {
            return  ExecuteResult.FAILED;
        }
    }

}
