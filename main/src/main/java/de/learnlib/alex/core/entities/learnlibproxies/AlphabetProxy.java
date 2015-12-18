package de.learnlib.alex.core.entities.learnlibproxies;

import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;

import java.util.Collection;
import java.util.LinkedList;

/**
 * Proxy around an Alphabet.
 * The Proxy is needed to make it easier to (de-)serialize the Transition into/ from JSON.
 *
 * @see net.automatalib.words.Alphabet
 */
public class AlphabetProxy extends LinkedList<String> {

    /** to be serializable. */
    private static final long serialVersionUID = 3404889779588414036L;

    /**
     * Default constructor.
     * Would be hidden by the other constructor(s) if not explicit written here.
     */
    public AlphabetProxy() {
    }

    /**
     * Constructor that creates a proxy based on an String collection (could be an Alphabet).
     *
     * @param collection
     *         The base collection of the new Proxy.
     */
    public AlphabetProxy(Collection<? extends String> collection) {
        super(collection);
    }

    /**
     * Create a new Proxy based on the provided Alphabet.
     *
     * @param input
     *         The base Alphabet of the new proxy. Can be null.
     * @return
     */
    public static AlphabetProxy createFrom(Alphabet<String> input) {
        return new AlphabetProxy(input);
    }

    /**
     * Create an Alphabet based on this proxy.
     *
     * @return A new Alphabet.
     */
    public Alphabet<String> createAlphabet() {
        return new SimpleAlphabet<>(this);
    }
}
