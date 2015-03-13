package de.learnlib.weblearner.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import de.learnlib.discriminationtree.DiscriminationTree;

import java.io.IOException;

public class DiscriminationTreeSerializer extends JsonSerializer<DiscriminationTree> {

    @Override
    public void serialize(DiscriminationTree discriminationTree, JsonGenerator jsonGenerator,
                          SerializerProvider serializerProvider) throws IOException, JsonProcessingException {
        DiscriminationTree.GraphView graphView = discriminationTree.graphView();

        jsonGenerator.writeStartObject();

        jsonGenerator.writeFieldName("nodes");
        jsonGenerator.writeStartArray();
        for (Object node : graphView.getNodes()) {
            jsonGenerator.writeObject(node);
        }

        jsonGenerator.writeEndArray();
        jsonGenerator.writeEndObject();
    }
}
