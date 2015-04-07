package de.learnlib.alex.core.entities.learnlibproxies;

import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.automata.transout.impl.compact.CompactMealy;
import net.automatalib.words.Alphabet;

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
public class CompactMealyMachineProxy implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = -5155147869595906457L;

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
