package de.learnlib.weblearner.utils;

import de.learnlib.algorithms.ttt.base.DTNode;
import de.learnlib.algorithms.ttt.base.DiscriminationTree;
import net.automatalib.words.Word;

public final class TTTSerializer {

    private TTTSerializer() {}

    public static String toJSON(DiscriminationTree<String, Word> tree) {
        return toJSON(tree.getRoot());
    }

    private static String toJSON(DTNode<String, Word> node) {
        StringBuilder result = new StringBuilder();
        result.append('{');

        if (node.getParentEdgeLabel() != null) {
            result.append("\"edgeLabel\": \"");
            result.append(node.getParentEdgeLabel());
            result.append("\",");
        }

        if (node.isLeaf()) {
            result.append("\"data\": \"");
            result.append(node.getState());
            result.append('"');
        } else {
            result.append("\"discriminator\": \"");
            result.append(node.getDiscriminator());
            result.append("\",");

            result.append("\"children\": [");
            node.getChildEntries().forEach(entry -> {
                DTNode child = entry.getValue();
                result.append(toJSON(child));
                result.append(",");
            });

            result.setLength(result.length() - 1); // remove last ','
            result.append(']');
        }

        result.append('}');
        return result.toString();
    }
}
