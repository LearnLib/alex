package de.learnlib.alex.testsuits.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.Symbol;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Representation of a Test Case.
 */
@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"userId", "projectId", "name"},
                        name = "Unique Test Case Name per User and Project"
                )
        }
)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TestCase implements Serializable {

    /** The ID of the Test Case in the DB. */
    private Long testCaseId;

    /** The id of the Test Case in the Project. */
    private Long id;

    /** The User that owns the Test Case. */
    private User user;

    /** The ID of the User to be used in the JSON. */
    private Long userId;

    /** The Project the Test Case belongs to. */
    private Project project;

    /** The ID of the Project to be used in the JSON. */
    private Long projectId;

    /** The name of the Test Case. */
    private String name;

    /** Link to the Symbols that are used during the Test Case. */
    private List<Symbol> symbols;
    private List<Long>   symbolsAsIds;

    /**
     * Default Constructor.
     */
    public TestCase() {
        super();

        this.userId    = 0L;
        this.projectId = 0L;

        this.symbols = new LinkedList<>();
    }

    /**
     * Get the ID of Test Case used in the DB.
     *
     * @return The internal ID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @JsonIgnore
    public Long getTestCaseId() {
        return testCaseId;
    }

    /**
     * Set the ID the Test Case has in the DB new.
     *
     * @param testCaseId The new internal ID.
     */
    @JsonIgnore
    public void setTestCaseId(Long testCaseId) {
        this.testCaseId = testCaseId;
    }

    /**
     * @return The user that owns the project.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "userId")
    @JsonIgnore
    public User getUser() {
        return user;
    }

    /**
     * @param user The new user that owns the project.
     */
    @JsonIgnore
    public void setUser(User user) {
        this.user = user;
        if (user == null) {
            this.userId = null;
        } else {
            this.userId = user.getId();
        }
    }

    /**
     * @return The ID of the user, which is needed for the JSON.
     */
    @Transient
    @JsonProperty("user")
    public Long getUserId() {
        return userId;
    }

    /**
     * @param userId The new ID of the user, which is needed for the JSON.
     */
    @JsonProperty("user")
    public void setUserId(Long userId) {
        this.user = null;
        this.userId = userId;
    }

    /**
     * Get the project the Test Case belongs to.
     *
     * @return The (parent) project.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    public Project getProject() {
        return project;
    }

    /**
     * Set the project the Test Case belongs to.
     *
     * @param project The new project.
     */
    @JsonIgnore
    public void setProject(Project project) {
        this.project = project;
        if (project == null) {
            this.projectId = null;
        } else {
            this.projectId = project.getId();
        }
    }

    /**
     * Get the {@link Project} the Test Case belongs to.
     *
     * @return The parent Project.
     * @requiredField
     */
    @Transient
    @JsonProperty("project")
    public Long getProjectId() {
        return projectId;
    }

    /**
     * Set the {@link Project} the Test Case belongs to.
     *
     * @param projectId The new parent Project.
     */
    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project   = null;
        this.projectId = projectId;
    }

    /**
     * Get the ID of the Test Case (within the project).
     *
     * @return The ID.
     * @requiredField
     */
    @JsonProperty
    public Long getId() {
        return this.id;
    }

    /**
     * Set the ID of this Test Case (within the project).
     *
     * @param id The new ID.
     */
    @JsonProperty
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Get the name of the Test Case.
     *
     * @return The name.
     */
    @NotBlank
    @JsonProperty
    public String getName() {
        return name;
    }

    /**
     * Set the name of the Test Case.
     *
     * @param name The new name.
     */
    @JsonProperty
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Get the Symbols of the Test Case.
     *
     * @return The Symbols of this Test Case
     */
    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.ALL})
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
    @JsonProperty("symbols")
    public List<Long> getSymbolsAsIds() {
        if (symbolsAsIds == null || symbolsAsIds.isEmpty()) {
            symbolsAsIds = new ArrayList<>();
        }
        return symbolsAsIds;
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

}
