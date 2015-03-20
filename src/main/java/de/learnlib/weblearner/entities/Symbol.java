package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.api.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.weblearner.learner.connectors.MultiConnector;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.NaturalId;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

/**
 * Representation of a symbol for the learning process.
 * A Symbol is one unit which will be executed and it is made of a sequence of actions.
 */
@Entity
@JsonPropertyOrder(alphabetic = true)
public class Symbol implements ContextExecutableInput<String, MultiConnector>, Serializable {

    /** to be serializable. */
    private static final long serialVersionUID = 7987585761829495962L;

    /** The ID of the Symbol in the DB. */
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @JsonIgnore
    private Long symbolId;

    /** The Project the Symbol belongs to. */
    @NaturalId
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @Cascade({ CascadeType.SAVE_UPDATE})
    @JsonIgnore
    private SymbolGroup group;

    /** The ID of the symbol, unique per project. */
    @NaturalId
    @Column(nullable = false)
    private Long id;

    /** The current revision of the symbol. */
    @NaturalId
    @Column(nullable = false)
    private Long revision;

    /**
     * The name of the symbol.
     * @requiredField
     */
    @NotBlank
    private String name;

    /**
     * An abbreviation for the symbol.
     * @requiredField
     */
    @Size(min = 1, max = 15)
    private String abbreviation;

    /**
     * flag to mark a symbol as hidden.
     * readonly.
     */
    private boolean hidden;

    /** The actions to perform. */
    @OneToMany(mappedBy = "symbol", fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @OrderBy("number ASC")
    private List<SymbolAction> actions;

    /**
     * Default constructor.
     */
    public Symbol() {
        this.actions = new LinkedList<>();
    }

    /**
     * Get the ID of Symbol used in the DB.
     *
     * @return The internal ID.
     */
    public Long getSymbolId() {
        return symbolId;
    }

    /**
     * Set the ID the Symbol has in the DB new.
     *
     * @param symbolId The new internal ID.
     */
    public void setSymbolId(Long symbolId) {
        this.symbolId = symbolId;
    }

    /**
     * Get the project the symbol belongs to.
     *
     * @return The (parent) project.
     */
    @JsonIgnore
    public Project getProject() {
        return project;
    }

    /**
     * Set the project the symbol belongs to.
     *
     * @param project
     *            The new project.
     */
    @JsonIgnore
    public void setProject(Project project) {
        this.project = project;
    }

    /**
     * Get the {@link Project} the Symbol belongs to.
     *
     * @return The parent Project.
     * @requiredField
     */
    @JsonProperty("project")
    public Long getProjectId() {
        if (project == null) {
            return 0L;
        } else {
            return this.project.getId();
        }
    }

    /**
     * Set the {@link Project} the Symbol belongs to.
     *
     * @param projectId
     *            The new parent Project.
     */
    @JsonProperty("project")
    public void setProjectId(Long projectId) {
        this.project = new Project(projectId);
    }

    public SymbolGroup getGroup() {
        return group;
    }

    public void setGroup(SymbolGroup group) {
        this.group = group;
    }

    @JsonProperty("group")
    public Long getGroupId() {
        if (group == null) {
            return 0L;
        } else {
            return this.group.getId();
        }
    }

    @JsonProperty("group")
    public void setGroupId(Long groupId) {
        this.group = new SymbolGroup();
        this.group.setId(groupId);
    }

    /**
     * Get the ID of the symbol.
     *
     * @return The ID.
     * @requiredField
     */
    public Long getId() {
        return this.id;
    }

    /**
     * Set the ID of this symbol.
     *
     * @param id
     *            The new ID.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Get the revision of the symbol.
     *
     * @return The revision.
     * @requiredField
     */
    public Long getRevision() {
        return this.revision;
    }

    /**
     * Set the revision of the symbol.
     *
     * @param revision
     *            The new revision.
     */
    public void setRevision(Long revision) {
        this.revision = revision;
    }

    /**
     * Get the name of the Symbol.
     *
     * @return The name.
     */
    public String getName() {
        return name;
    }

    /**
     * Set the name of the Symbol.
     *
     * @param name
     *            The new name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the abbreviation
     */
    public String getAbbreviation() {
        return abbreviation;
    }

    /**
     * @param abbreviation
     *            the abbreviation to set
     */
    public void setAbbreviation(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    /**
     * Determine if the symbol is flagged as hidden.
     * 
     * @return true if the symbol should be considered hidden; false otherwise.
     */
    @JsonProperty
    public boolean isHidden() {
        return hidden;
    }

    /**
     * Mark the symbol as hidden or remove the hidden flag.
     * 
     * @param hidden
     *            true if the symbol should be considered hidden; false otherwise.
     */
    @JsonIgnore
    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    /**
     * Get the Actions related to the Symbol.
     *
     * @return The actions of this Symbol
     */
    public List<SymbolAction> getActions() {
        return actions;
    }

    /**
     * Set a new List of Actions related to the Symbol.
     *
     * @param actions
     *         The new list of SymbolActions
     */
    public void setActions(List<SymbolAction> actions) {
        this.actions = actions;
    }

    /**
     * Add one action to the end of the Action List.
     *
     * @param action
     *         The SymbolAction to add.
     */
    public void addAction(SymbolAction action) {
        if (action == null) {
            throw new IllegalArgumentException("Can not add action 'null'");
        }

        actions.add(action);
        action.setSymbol(this);
    }

    public void beforeSave() {
        for (int i = 0; i < actions.size(); i++) {
            SymbolAction a = actions.get(i);
            a.setId(null);
            a.setProject(project);
            a.setSymbol(this);
            a.setNumber(i);
        }
    }

    @Override
    public String execute(MultiConnector connector) throws SULException {
        for (SymbolAction action : actions) {
            ExecuteResult result = executeAction(action, connector);
            if (!action.isIgnoreFailure() && result != ExecuteResult.OK) {
                return result.toString();
            }
        }

        return ExecuteResult.OK.toString();
    }

    private ExecuteResult executeAction(SymbolAction action, MultiConnector connector) {
        try {
            return action.execute(connector);
        } catch (IllegalStateException e) {
            return ExecuteResult.FAILED;
        }
    }


    //CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces - auto generated by IntelliJ IDEA
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Symbol)) return false;

        Symbol symbol = (Symbol) o;

        if (id != null ? !id.equals(symbol.id) : symbol.id != null) return false;
        if (project != null ? !project.equals(symbol.project) : symbol.project != null) return false;
        if (revision != null ? !revision.equals(symbol.revision) : symbol.revision != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = project != null ? project.hashCode() : 0;
        result = 31 * result + (id != null ? id.hashCode() : 0);
        result = 31 * result + (revision != null ? revision.hashCode() : 0);
        return result;
    }
    // CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber|NeedBraces

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return "Symbol[" + symbolId + "] " + this.project + "/" + this.id + "/" + this.revision + ": " + name + "("
                + abbreviation + ")";
    }

}
