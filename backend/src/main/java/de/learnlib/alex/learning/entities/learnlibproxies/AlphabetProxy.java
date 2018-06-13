/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.learning.entities.learnlibproxies;

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
     * @return A new proxy based on the given Alphabet.
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
