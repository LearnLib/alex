package de.learnlib.alex.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import de.learnlib.alex.core.entities.Algorithm;

import java.io.IOException;

/**
 * A custom JsonSerializer that serializes a {@link Algorithm} entity just as its name.
 */
public class AlgorithmSerializer extends JsonSerializer<Algorithm> {

    @Override
    public void serialize(Algorithm algorithm, JsonGenerator jsonGenerator, SerializerProvider serializerProvider)
            throws IOException, JsonProcessingException {
        jsonGenerator.writeString(algorithm.getName());
    }

}
