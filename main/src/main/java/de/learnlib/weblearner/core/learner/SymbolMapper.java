package de.learnlib.weblearner.core.learner;

import de.learnlib.api.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.mapper.api.Mapper;
import de.learnlib.weblearner.core.entities.Symbol;
import de.learnlib.weblearner.core.learner.connectors.MultiConnector;
import net.automatalib.words.Alphabet;
import net.automatalib.words.impl.SimpleAlphabet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Class to map the Symbols and their result to the values used in the learning process.
 *
 * @param <CI>
 *            The type of the Concrete Input used in the Symbols to implement the execution.
 */
public class SymbolMapper<CI> implements Mapper<String, String, ContextExecutableInput<String, MultiConnector>, String> {

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("learner");

    /** Map to manage the symbols according to their name in the Alphabet. */
    private Map<String, Symbol> symbols;

    public SymbolMapper(Symbol... symbols) {
        this.symbols = new HashMap<>();

        for (Symbol s : symbols) {
            this.symbols.put(s.getAbbreviation(), s);
        }
    }

    @Override
    public ContextExecutableInput<String, MultiConnector> mapInput(String abstractInput) {
        return symbols.get(abstractInput);
    }

    @Override
    public String mapOutput(String concreteOutput) {
        return concreteOutput;
    }

    @Override
    public MappedException<? extends String> mapUnwrappedException(RuntimeException e) throws RuntimeException {
        LOGGER.info("mapper mapped unwrapped exception", e);
        return null;
    }

    @Override
    public MappedException<? extends String> mapWrappedException(SULException e) throws SULException {
        LOGGER.info("mapper mapped wrapped exception", e);
        return null;
    }

    @Override
    public void post() {
        // nothing to do
    }

    @Override
    public void pre() {
        // nothing to do
    }

    public Alphabet<String> getAlphabet() {
        Alphabet<String> sigma = new SimpleAlphabet<>();

        for (String s : symbols.keySet()) {
            sigma.add(s);
        }

        return sigma;
    }

    public List<Symbol> getSymbols() {
        List<Symbol> list = new LinkedList<>();
        list.addAll(symbols.values());
        return list;
    }
}
