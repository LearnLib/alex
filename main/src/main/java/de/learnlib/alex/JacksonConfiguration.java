package de.learnlib.alex;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate4.Hibernate4Module;

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
        Hibernate4Module hibernate4Module = new Hibernate4Module();
        hibernate4Module.configure(Hibernate4Module.Feature.USE_TRANSIENT_ANNOTATION, false);

        mapper = new ObjectMapper();
        mapper.registerModule(hibernate4Module);
    }

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return mapper;
    }

}
