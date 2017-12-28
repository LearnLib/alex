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
package de.learnlib.alex;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

/**
 * Jersey Provide to customise the Jackson ObjectMapper.
 */
@Provider
public class JacksonConfiguration implements ContextResolver<ObjectMapper> {

    /** The Object Mapper to use. */
    private final ObjectMapper mapper;

    /**
     * Default constructor, which creates the ObjectMapper and add the custom modules.
     */
    public JacksonConfiguration() {
        Hibernate5Module hibernate5Module = new Hibernate5Module();
        hibernate5Module.configure(Hibernate5Module.Feature.USE_TRANSIENT_ANNOTATION, false);

        mapper = new ObjectMapper();
        mapper.registerModule(hibernate5Module);
    }

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return mapper;
    }

}
