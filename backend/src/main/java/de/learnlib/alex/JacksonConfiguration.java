/*
 * Copyright 2015 - 2022 TU Dortmund
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
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Jersey Provide to customise the Jackson ObjectMapper.
 */
@Configuration
public class JacksonConfiguration {

    /**
     * Default constructor, which creates the ObjectMapper and add the custom modules.
     */
    @Bean
    public ObjectMapper objectMapper() {
        final var hibernate5Module = new Hibernate5Module();
        hibernate5Module.configure(Hibernate5Module.Feature.USE_TRANSIENT_ANNOTATION, false);

        final var javaTimeModule = new JavaTimeModule();

        final var mapper = new ObjectMapper();
        mapper.registerModule(hibernate5Module);
        mapper.registerModule(javaTimeModule);
        return mapper;
    }
}
