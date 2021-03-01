/*
 * Copyright 2015 - 2021 TU Dortmund
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

package de.learnlib.alex.data.services.export;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;

public abstract class EntityExporter {

    /** The version string of ALEX. */
    @Value("${alex.version}")
    protected String version;

    /** The object mapper to use for writing the JSON document. */
    protected ObjectMapper om;

    protected EntityExporter() {
        this.om = new ObjectMapper();
    }

    /** Ignores 'id' fields in JSON documents. */
    protected abstract static class IgnoreIdFieldMixin {
        @JsonIgnore
        abstract Long getId();
    }
}
