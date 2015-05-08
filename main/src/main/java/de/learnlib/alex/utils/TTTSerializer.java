package de.learnlib.alex.utils;

import de.learnlib.algorithms.ttt.base.DTNode;
import de.learnlib.algorithms.ttt.base.DiscriminationTree;
import net.automatalib.words.Word;

/**
 * Custom serializer that converts the (LearnLib) TTT data structures into nice JSON.
 * Currently only parse the discrimination tree.
 */
public final class TTTSerializer {

    private TTTSerializer() {
    }

    /**
     * Serializes the discrimination tree of the TTT algorithm into JSON.
     *
     * @param tree
     *         The tree to convert into nice JSON.
     * @return The JSON string of the given tree.
     */
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
            result.append("\", ");

            result.append("\"children\": [");
            node.getChildEntries().forEach(entry -> {
                DTNode child = entry.getValue();
                result.append(toJSON(child));
                result.append(",");
            });

            // remove last ','
            if (result.charAt(result.length() - 1) == ',') {
                result.setLength(result.length() - 1);
            }

            result.append(']');
        }

        result.append('}');
        return result.toString();
    }
}
