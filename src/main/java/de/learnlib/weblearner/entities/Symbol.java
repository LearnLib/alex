package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import de.learnlib.api.SULException;
import de.learnlib.mapper.api.ContextExecutableInput;
import de.learnlib.weblearner.learner.MultiConnector;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Transient;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

/**
 * Basic class for the different symbols.
 */
@Entity
@JsonPropertyOrder(alphabetic = true)
public class Symbol implements ContextExecutableInput<String, MultiConnector>, Serializable, SymbolActionHandler<SymbolAction> {

    /** to be serializable. */
    private static final long serialVersionUID = 7987585761829495962L;

    /** The ID of the Symbol in the DB. */
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @JsonIgnore
    private long symbolId;

    /** The Project the Symbol belongs to. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "projectId")
    @JsonIgnore
    protected Project project;

    /** The ID of the symbol, unique per project. */
    @Column(nullable = false)
    protected long id;

    /** The current revision of the symbol. */
    @Column(nullable = false)
    protected long revision;

    /**
     * The name of the symbol.
     * @requiredField
     */
    @NotBlank
    protected String name;

    /**
     * An abbreviation for the symbol.
     * @requiredField
     */
    @Size(min = 1, max = 15)
    protected String abbreviation;

    /**
     * flag to mark a symbol as hidden.
     * readonly.
     */
    protected boolean hidden;

    /** The actions to perform. */
    @OneToMany(fetch = FetchType.LAZY)
    @Cascade({ CascadeType.SAVE_UPDATE, CascadeType.REMOVE })
    @OrderBy("number ASC")
    protected List<SymbolAction> actions;

    /** The actions handler. */
    @Transient
    @JsonIgnore
    private transient DefaultSymbolActionHandler<SymbolAction> actionHandler;

    /**
     * Default constructor.
     */
    public Symbol() {
        this.actions = new LinkedList<>();
        this.actionHandler = new DefaultSymbolActionHandler<>(this, actions);
    }

    /**
     * Get the ID of Symbol used in the DB.
     * 
     * @return The internal ID.
     */
    public long getSymbolId() {
        return symbolId;
    }

    /**
     * Set the ID the Symbol has in the DB new.
     * 
     * @param symbolId The new internal ID.
     */
    public void setSymbolId(long symbolId) {
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
     * Get the {@link Project} the Symbol belongs to.
     * 
     * @return The parent Project.
     * @requiredField
     */
    @JsonProperty("project")
    public long getProjectId() {
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
    public void setProjectId(long projectId) {
        this.project = new Project(projectId);
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
     * Get the ID of the symbol.
     *
     * @return The ID.
     * @requiredField
     */
    public long getId() {
        return this.id;
    }

    /**
     * Set the ID of this symbol.
     *
     * @param id
     *            The new ID.
     */
    public void setId(long id) {
        this.id = id;
    }

    /**
     * Get the revision of the symbol.
     *
     * @return The revision.
     * @requiredField
     */
    public long getRevision() {
        return this.revision;
    }

    /**
     * Set the revision of the symbol.
     *
     * @param revision
     *            The new revision.
     */
    public void setRevision(long revision) {
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
        actionHandler.addAction(action);
    }

    @Override
    public void loadLazyRelations() {
        actionHandler.loadLazyRelations();
    }

    @Override
    public void beforeSave() {
        actionHandler.beforeSave();
    }

    @Override
    public String execute(MultiConnector connector) throws SULException {
        return actionHandler.execute(connector);
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
        result = prime * result + ((project == null) ? 0 : project.hashCode());
        result = prime * result + (int) (revision ^ (revision >>> 32));
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
        Symbol other = (Symbol) obj;
        if (id != other.id) {
            return false;
        }
        if (project == null) {
            if (other.project != null) {
                return false;
            }
        } else if (!project.equals(other.project)) {
            return false;
        }
        if (revision != other.revision) {
            return false;
        }
        return true;
    }

    // CHECKSTYLE.OFF: AvoidInlineConditionals|MagicNumber

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
