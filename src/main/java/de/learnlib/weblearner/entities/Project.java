package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 * Representation of a testing project with different symbols.
 */
@Entity
public class Project implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = -6760395646972200067L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The project ID. */
    @Id
    @GeneratedValue
    private long id;

    /**
     * The name of the project. This property is required & must be unique.
     * @requiredField
     */
    @NotBlank
    @Column(unique = true)
    private String name;

    /**
     * The root URL of the project.
     * @requiredField
     */
    @NotBlank
    private String baseUrl;

    /** A text to describe the Project. */
    private String description;

    /** The symbols used to test. */
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @JsonProperty("symbols")
    private Set<Symbol> symbols;

    /** The next id for a symbol in this project. */
    @JsonIgnore
    private long nextSymbolId;

    /** The results of the test for the project. */
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @JsonIgnore
    private Set<LearnerResult> testResults;

    /**
     * Default constructor.
     */
    public Project() {
        this(0);
    }

    /**
     * Constructor which set the ID.
     * 
     * @param projectId
     *            The ID.
     */
    public Project(long projectId) {
        this.id = projectId;
        this.symbols = new HashSet<>();
        this.nextSymbolId = 1;
    }

    /**
     * Get the ID of the project.
     * 
     * @return The ID.
     */
    public long getId() {
        return id;
    }

    /**
     * Set the ID of this project.
     * 
     * @param id
     *            The new ID.
     */
    public void setId(long id) {
        this.id = id;
    }

    /**
     * Get the name of this project.
     * 
     * @return The name.
     */
    public String getName() {
        return name;
    }

    /**
     * Set a new name for the project. The name must be there and be unique.
     * 
     * @param name
     *            The new name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get the set of symbols in the project.
     * 
     * @return The Set of Symbols.
     */
    @JsonIgnore
    public Collection<Symbol> getSymbols() {
        return symbols;
    }

    /**
     * @param symbols
     *            the symbols to set
     */
    public void setSymbols(Set<Symbol> symbols) {
        this.symbols = symbols;
    }

    /**
     * Add a Symbol to the Project and set the Project in the Symbol.
     * This only establishes the bidirectional relation does nothing else,
     * e.g. it does not take care of the right id.
     * 
     * @param symbol The Symbol to add.
     */
    public void addSymbol(Symbol symbol) {
        this.symbols.add(symbol);
        symbol.setProject(this);
    }

    /**
     * Get the amount of Symbols related to this project.
     * 
     * @return The current count of Symbols. If the project has no symbols (== null) 0 is returned.
     */
    @JsonProperty("symbolAmount")
    public int getSymbolsSize() {
        if (symbols == null) {
            return 0;
        } else {
            return symbols.size();
        }
    }

    /**
     * DO NOT USE! Dummy method that does nothing but enables proper JSON support.
     * 
     * @param size
     *            Irrelevant.
     */
    @JsonIgnore
    public void setSymbolsSize(int size) {
        // you can not change the size this way -> nothing to do here
        LOGGER.info("One tried to set the size of the symbols set.");
    }

    /**
     * Get the next free id for a symbol in the project.
     *
     * @return The next symbol id.
     */
    public long getNextSymbolId() {
        return nextSymbolId;
    }

    /**
     * Set the ID the next symbol in this project should have.
     *
     * @param nextSymbolId
     *         The next free id for a symbol.
     */
    public void setNextSymbolId(long nextSymbolId) {
        this.nextSymbolId = nextSymbolId;
    }

    /**
     * Get a set of all tests results related to the project.
     *
     * @return The test results of the project.
     */
    @JsonIgnore
    public Set<LearnerResult> getTestResults() {
        return testResults;
    }

    /**
     * Set the related test results for this project.
     *
     * @param testResults
     *         The test result of the project.
     */
    @JsonIgnore
    public void setTestResults(Set<LearnerResult> testResults) {
        this.testResults = testResults;
    }

    /**
     * Get the root URL of the Project.
     * 
     * @return The base URl.
     */
    public String getBaseUrl() {
        return baseUrl;
    }

    /**
     * Set the base URL of the Project.
     * 
     * @param baseUrl
     *            The new base URL.
     */
    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Get the description of the Project.
     * 
     * @return The Project description.
     */
    public String getDescription() {
        return description;
    }

    /**
     * Set the description of this project.
     * 
     * @param description
     *            The new description.
     */
    public void setDescription(String description) {
        this.description = description;
    }

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber - auto generated by Eclipse

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (int) (id ^ (id >>> 32));
        return result;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        Project other = (Project) obj;
        if (id != other.id) {
            return false;
        }
        return true;
    }
    //CHECKSTYLE.ON: AvoidInlineConditionals|MagicNumber

    @Override
    public String toString() {
        return "[Project " + id + "] " + name + "(" + baseUrl + ")";
    }

}
