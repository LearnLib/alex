/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.core.entities.learnlibproxies;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Transient;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Proxy around a {@link MealyMachine} from the LearnLib.
 * The Proxy is needed to make it easier to (de-)serialize the MealyMachine into/ from JSON.
 *
 * @see net.automatalib.automata.transout.impl.compact.CompactMealy
 */
@Embeddable
public class CompactMealyMachineProxy implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = -5155147869595906457L;

    /** Create one static ObjectMapper to (de-)serialize the Proxy for the DB. */
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    /** The states of the machine. */
    private List<Integer> nodes;

    /** The initial state. */
    private Integer initNode;

    /** The transitions between the states. */
    private List<CompactMealyTransitionProxy> edges;

    /**
     * Create a proxy around a specific MealyMachine.
     *
     * @param machine
     *         The MealyMachine the Proxy should wrap in
     * @param sigma
     *         The Alphabet of the MealyMachine.
     * @return A new Proxy around the given MealyMachine.
     */
    public static CompactMealyMachineProxy createFrom(MealyMachine<?, String, ?, String> machine,
                                                      Alphabet<String> sigma) {
        CompactMealyMachineProxy newProxy = new CompactMealyMachineProxy();

        Map<Object, Integer> statesIndex = createStatesIndex(machine);
        List newStates = readStatesFrom(statesIndex);
        newProxy.setNodes(newStates);
        newProxy.initNode = statesIndex.get(machine.getInitialState());

        List newTransitions = readTransitionsFrom(machine, statesIndex, sigma);
        newProxy.setEdges(newTransitions);

        return newProxy;
    }

    private static Map<Object, Integer> createStatesIndex(MealyMachine<?, String, ?, String> machine) {
        Map<Object, Integer> states = new HashMap<>(machine.getStates().size());
        int i = 0;
        for (Object state : machine) {
            states.put(state, i++);
        }
        return states;
    }

    private static List<Integer> readStatesFrom(Map<Object, Integer> statesIndex) {
        return new ArrayList<>(statesIndex.values());
    }

    private static List<CompactMealyTransitionProxy> readTransitionsFrom(MealyMachine machine,
                                                                         Map<Object, Integer> statesIndex,
                                                                         Alphabet<String> sigma) {
        List<CompactMealyTransitionProxy> newTransitions = new LinkedList<>();
        for (Object state : machine) {
            Integer v = statesIndex.get(state);
            for (String input : sigma) {
                Integer w = statesIndex.get(machine.getSuccessor(state, input));
                if (w != null) {
                    String output = machine.getOutput(state, input).toString();
                    CompactMealyTransitionProxy newTransition = new CompactMealyTransitionProxy(v, input, w, output);
                    newTransitions.add(newTransition);
                }
            }
        }
        return newTransitions;
    }

    /**
     * Get the states of the mealy machine as a list.
     *
     * @return The stats of the mealy machine.
     */
    @Transient
    public List<Integer> getNodes() {
        return nodes;
    }

    /**
     * Set new states for the mealy machine.
     *
     * @param nodes
     *         The new states.
     */
    public void setNodes(List<Integer> nodes) {
        this.nodes = nodes;
    }

    /**
     * Getter method to interact with the DB, because the Java standard serialization doesn't work.
     *
     * @return The Nodes of the machine as JSON string.
     */
    @Column(name = "nodes")
    @JsonIgnore
    public String getNodesDB() {
        try {
            return OBJECT_MAPPER.writeValueAsString(nodes);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * Setter method to interact with the DB, because the Java standard deserialization doesn't work.
     *
     * @param nodesAsString
     *         The Nodes of the machine as JSON string.
     */
    @JsonIgnore
    public void setNodesDB(String nodesAsString) {
        try {
            CollectionType valueType = OBJECT_MAPPER.getTypeFactory().constructCollectionType(List.class, Integer.class);
            this.nodes = OBJECT_MAPPER.readValue(nodesAsString, valueType);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Get the initial state of the mealy machine.
     *
     * @return The initial state.
     */
    public Integer getInitNode() {
        return initNode;
    }

    /**
     * Declare a state as the initial state.
     *
     * @param initNode
     *         The new initial state.
     */
    public void setInitNode(Integer initNode) {
        this.initNode = initNode;
    }

    /**
     * Get all the transition/ edges of the mealy machine, i.e. the connections between the states.
     *
     * @return The transition of the mealy machine as List of MealyTransitionProxies.
     */
    @Transient
    public List<CompactMealyTransitionProxy> getEdges() {
        return edges;
    }

    /**
     * Set the list of transition of the mealy machine new.
     *
     * @param edges
     *         The new transition/ edges.
     */
    public void setEdges(List<CompactMealyTransitionProxy> edges) {
        this.edges = edges;
    }

    /**
     * Getter method to interact with the DB, because the Java standard serialization doesn't work.
     *
     * @return The Edges of the machine as JSON string.
     */
    @Column(name = "edges", columnDefinition = "CLOB")
    @JsonIgnore
    public String getEdgesDB() {
        try {
            return OBJECT_MAPPER.writeValueAsString(edges);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * Setter method to interact with the DB, because the Java standard deserialization doesn't work.
     *
     * @param edgesAsString
     *         The Edges of the machine as JSON string.
     */
    @JsonIgnore
    public void setEdgesDB(String edgesAsString) {
        try {
            CollectionType valueType = OBJECT_MAPPER.getTypeFactory()
                                                   .constructCollectionType(List.class,
                                                                            CompactMealyTransitionProxy.class);
            this.edges = OBJECT_MAPPER.readValue(edgesAsString, valueType);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Create a CompactMealy based on the Proxy.
     *
     * @param sigma
     *         The alphabet to use.
     * @return A new CompactMealy based on the Proxy.
     */
    public CompactMealy<String, String> createMealyMachine(Alphabet<String> sigma) {
        CompactMealy<String, String> machine = new CompactMealy<>(sigma);
        addStatesTo(machine);
        addEdgesTo(machine);
        return machine;
    }

    private void addStatesTo(CompactMealy machine) {
        for (int i = 0; i < nodes.size(); i++) {
            machine.addState();
        }
        machine.setInitialState(initNode);
    }

    private void addEdgesTo(CompactMealy<String, String> machine) {
        for (CompactMealyTransitionProxy t : edges) {
            machine.addTransition(t.getFrom(), t.getInput(), t.getTo(), t.getOutput());
        }
    }

}
