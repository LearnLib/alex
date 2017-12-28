/*
 * Copyright 2016 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.data.entities.actions.RESTSymbolActions;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonschema.core.exceptions.ProcessingException;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.io.IOException;

/**
 * Validates a JSON object against a JSON schema v4.
 * See https://tools.ietf.org/html/draft-zyp-json-schema-04.
 */
@Entity
@DiscriminatorValue("rest_validateJson")
@JsonTypeName("rest_validateJson")
public class ValidateJsonAction extends RESTSymbolAction {

    private static final long serialVersionUID = -3417929867422889753L;

    /**
     * The JSON schema to validate the response of the latest request against.
     */
    @NotBlank
    @Column(columnDefinition = "CLOB")
    private String schema;

    @Override
    protected ExecuteResult execute(final WebServiceConnector connector) {
        final String body = connector.getBody();
        final ObjectMapper mapper = new ObjectMapper();

        try {
            final JsonNode obj = mapper.readTree(body);
            final JsonNode schema = mapper.readTree(this.schema);

            final ProcessingReport report = JsonSchemaFactory.byDefault()
                    .getJsonSchema(schema)
                    .validate(obj);

            return report.isSuccess() ? getSuccessOutput() : getFailedOutput();
        } catch (IOException | ProcessingException e) {
            return getFailedOutput();
        }
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }
}
