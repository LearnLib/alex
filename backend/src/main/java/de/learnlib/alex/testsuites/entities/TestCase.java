package de.learnlib.alex.testsuites.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeName;
import de.learnlib.alex.data.entities.Symbol;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.Transient;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Representation of a Test.
 */
@Entity
@DiscriminatorValue("case")
@JsonTypeName("case")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TestCase extends Test implements Serializable {

    private class SymbolRepresentation {
        private Long id;
        private String name;

        SymbolRepresentation(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    /** Link to the Symbols that are used during the Test Case. */
    private List<Symbol> symbols;
    private List<Long>   symbolsAsIds;

    /** The map with the variables for the test case. */
    private HashMap<String, String> variables;

    /**
     * Default Constructor.
     */
    public TestCase() {
        super();

        this.symbols = new LinkedList<>();
        this.variables = new HashMap<>();
    }

    /**
     * Get the Symbols of the Test Case.
     *
     * @return The Symbols of this Test Case
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnore
    public List<Symbol> getSymbols() {
        return symbols;
    }

    /**
     * Get the Symbol IDs of the Test Case.
     *
     * @return A list of Symbol ID to execute during the Test Case (in order).
     */
    @Transient
    @JsonIgnore
    public List<Long> getSymbolsAsIds() {
        if (symbolsAsIds == null || symbolsAsIds.isEmpty()) {
            symbolsAsIds = new ArrayList<>();
        }
        return symbolsAsIds;
    }

    @Transient
    @JsonProperty("symbols")
    public List<SymbolRepresentation> getSymbolRepresentation() {
        if (symbols == null || symbols.isEmpty()) {
            return new LinkedList<>();
        }
        return symbols.stream().map(s -> new SymbolRepresentation(s.getId(), s.getName())).collect(Collectors.toList());
    }


    /**
     * Set a new List of Symbols of the Test Case.
     *
     * @param symbols The new list of Symbols.
     */
    @JsonIgnore
    public void setSymbols(List<Symbol> symbols) {
        if (symbols == null) {
            this.symbols = new LinkedList<>();
        } else {
            this.symbols = symbols;
            this.symbolsAsIds = symbols.stream().map(Symbol::getId).collect(Collectors.toList());
        }
    }

    /**
     * Set the Symbols of the Test Case.
     *
     * @param symbolsAsIds A list of Symbol ID to execute during the Test Case (in order).
     */
    @Transient
    @JsonProperty("symbols")
    public void setSymbolsAsIds(List<Long> symbolsAsIds) {
        this.symbolsAsIds = symbolsAsIds;
    }


    /**
     * Add one action to the end of the Action List.
     *
     * @param action The SymbolAction to add.
     */
    public void addSymbol(Symbol action) {
        if (action == null) {
            throw new IllegalArgumentException("Can not add Symbol 'null'");
        }

        symbols.add(action);
    }

    @Lob
    @JsonProperty
    public HashMap<String, String> getVariables() {
        return variables;
    }

    @JsonProperty
    public void setVariables(HashMap<String, String> variables) {
        this.variables = variables;
    }
}
