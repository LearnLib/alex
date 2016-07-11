package de.learnlib.alex;

import com.fasterxml.jackson.databind.MapperFeature;
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
        mapper = new ObjectMapper();
        mapper.registerModule(new Hibernate4Module());
        mapper.configure(MapperFeature.AUTO_DETECT_GETTERS, true);
        mapper.configure(MapperFeature.AUTO_DETECT_IS_GETTERS, true);
        mapper.configure(MapperFeature.AUTO_DETECT_SETTERS, true);
    }

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return mapper;
    }

}
