package de.learnlib.alex.core.entities.learnlibproxies.eqproxies;


import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.api.EquivalenceOracle;
import de.learnlib.oracles.SULOracle;
import net.automatalib.automata.transout.MealyMachine;
import net.automatalib.words.Word;

/**
 * Base class for Proxies around a the different EquivalenceOracles from the LearnLib.
 * The Proxy is needed to make it easier to (de-)serialize the EQ oracles into/ from JSON.
 *
 * @see de.learnlib.api.EquivalenceOracle
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(name = "random_word", value = MealyRandomWordsEQOracleProxy.class),
    @JsonSubTypes.Type(name = "complete", value = CompleteExplorationEQOracleProxy.class),
    @JsonSubTypes.Type(name = "sample", value = SampleEQOracleProxy.class)
})
public abstract class AbstractEquivalenceOracleProxy {

    /**
     * Check if the parameter of the proxy are valid, i.e. it is possible to create a functional EQ oracle out of the
     * proxy.
     * If everything is OK nothing will happen.
     * If there are errors an exception will be thrown. This exception should have a clear error message.
     *
     * @throws IllegalArgumentException If the parameters are wrong.
     */
    public abstract void checkParameters() throws IllegalArgumentException;

    /**
     * Create a EQ oracle connected with a MQ oracle based on this proxy.
     *
     * @param membershipOracle
     *         The MQ oracle to test against a hypothesis.
     * @return An EquivalenceOracle from the LearnLib based on the proxy.
     */
    public abstract EquivalenceOracle<MealyMachine<?, String, ?, String>, String, Word<String>>
    createEqOracle(SULOracle<String, String> membershipOracle);

}
