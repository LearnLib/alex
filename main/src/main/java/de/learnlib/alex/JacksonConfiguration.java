package de.learnlib.alex;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate4.Hibernate4Module;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

@Provider
public class JacksonConfiguration implements ContextResolver<ObjectMapper> {

    private final ObjectMapper mapper;

    public JacksonConfiguration() {
        mapper = new ObjectMapper();
        mapper.registerModule(new Hibernate4Module());
    }

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return mapper;
    }
}
