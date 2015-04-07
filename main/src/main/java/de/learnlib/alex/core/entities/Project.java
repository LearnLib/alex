package de.learnlib.alex.core.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Project implements Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = -6760395646972200067L;

    /** Use the logger for the server part. */
    private static final Logger LOGGER = LogManager.getLogger("server");

    /** The project ID. */
    @Id
    @GeneratedValue
    private Long id;

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

    /** The list of groups in the project. */
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @JsonProperty("groups")
    private Set<SymbolGroup> groups;

    /** The default group of the project. */
    @OneToOne
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @JsonIgnore
    private SymbolGroup defaultGroup;

    /** The next id for a group in the project. */
    @JsonIgnore
    private Long nextGroupId;

    /** The symbols used to test. */
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @JsonProperty("symbols")
    private Set<Symbol> symbols;

    /** The next id for a symbol in this project. */
    @JsonIgnore
    private Long nextSymbolId;

    /** The results of the test for the project. */
    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @JsonIgnore
    private Set<LearnerResult> testResults;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @JsonIgnore
    private Set<Counter> counters;

    /**
     * Default constructor.
     */
    public Project() {
        this(0L);
    }

    /**
     * Constructor which set the ID.
     * 
     * @param projectId
     *            The ID.
     */
    public Project(Long projectId) {
        this.id = projectId;
        this.groups = new HashSet<>();
        this.nextGroupId = 1L;
        this.symbols = new HashSet<>();
        this.nextSymbolId = 1L;
    }

    /**
     * Get the ID of the project.
     * 
     * @return The ID.
     */
    public Long getId() {
        return id;
    }

    /**
     * Set the ID of this project.
     * 
     * @param id
     *            The new ID.
     */
    public void setId(Long id) {
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

    @JsonIgnore
    public Set<SymbolGroup> getGroups() {
        return groups;
    }

    public void setGroups(Set<SymbolGroup> groups) {
        this.groups = groups;
    }

    public void addGroup(SymbolGroup group) {
        this.groups.add(group);
        group.setProject(this);
    }

    public SymbolGroup getDefaultGroup() {
        return defaultGroup;
    }

    public void setDefaultGroup(SymbolGroup defaultGroup) {
        this.defaultGroup = defaultGroup;
    }

    public Long getNextGroupId() {
        return nextGroupId;
    }

    public void setNextGroupId(Long nextGroupId) {
        this.nextGroupId = nextGroupId;
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
     * Get the next free id for a symbol in the project.
     *
     * @return The next symbol id.
     */
    public Long getNextSymbolId() {
        return nextSymbolId;
    }

    /**
     * Set the ID the next symbol in this project should have.
     *
     * @param nextSymbolId
     *         The next free id for a symbol.
     */
    public void setNextSymbolId(Long nextSymbolId) {
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

    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces - auto generated by IntelliJ IDEA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Project)) return false;

        Project project = (Project) o;

        if (id != null ? !id.equals(project.getId()) : project.getId() != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    //CHECKSTYLE.ON: AvoidInlineConditionals|MagicNumber|NeedBraces

    @Override
    public String toString() {
        return "[Project " + id + "] " + name + "(" + baseUrl + ")";
    }

}
