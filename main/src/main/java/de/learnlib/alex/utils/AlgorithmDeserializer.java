package de.learnlib.alex.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import de.learnlib.alex.core.entities.Algorithm;

import java.io.IOException;

/**
 * Custom JsonDeserializer that creates an {@link Algorithm} entity just by the name as String.
 */
public class AlgorithmDeserializer extends JsonDeserializer<Algorithm> {

    @Override
    public Algorithm deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
            throws IOException, JsonProcessingException {
        String algorithmName = jsonParser.readValueAs(String.class);
        return new Algorithm(algorithmName, "");
    }

}
