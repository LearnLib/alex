package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.learnlib.mapper.api.ContextExecutableInput;
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
import javax.persistence.Transient;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * Basic class for the different symbols.
 * 
 * @param <C>
 *            The type used to implement the actions the Symbol will use during the learning process.
 */
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("SYMBOL")
@JsonPropertyOrder(alphabetic = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
    @Type(name = "rest", value = RESTSymbol.class),
    @Type(name = "web", value = WebSymbol.class)
})
public abstract class Symbol<C> implements ContextExecutableInput<String, C>, Serializable {

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

    /** Is this symbol used as a reset symbol? */
    @Transient
    protected boolean resetSymbol;

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

    /** flag to mark a symbol as deleted. */
    @JsonIgnore
    protected boolean deleted;

    /**
     * Get the ID of Symbol used in the DB.
     * 
     * @return The internal ID.
     */
    @JsonIgnore
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
    @JsonProperty("id")
    public long getId() {
        return this.id;
    }

    /**
     * Set the ID of this symbol.
     *
     * @param id
     *            The new ID.
     */
    @JsonProperty("id")
    public void setId(long id) {
        this.id = id;
    }

    /**
     * Get the revision of the symbol.
     *
     * @return The revision.
     * @requiredField
     */
    @JsonProperty("revision")
    public long getRevision() {
        return this.revision;
    }

    /**
     * Set the revision of the symbol.
     *
     * @param revision
     *            The new revision.
     */
    @JsonProperty("revision")
    public void setRevision(long revision) {
        this.revision = revision;
    }

    public boolean isResetSymbol() {
        return resetSymbol;
    }

    public void setResetSymbol(boolean resetSymbol) {
        this.resetSymbol = resetSymbol;
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
     * Determine if the symbol is flagged as deleted.
     * 
     * @return true if the symbol should be considered deleted; false otherwise.
     */
    public boolean isDeleted() {
        return deleted;
    }

    /**
     * Mark the symbol as deleted or remove the deleted flag.
     * 
     * @param deleted
     *            true if the symbol should be considered deleted; false otherwise.
     */
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    /**
     * The method loads all the lazy relations if they are needed.
     */
    public abstract void loadLazyRelations();

    /**
     * Called shortly before the Symbol will be saved, so that e.g. relations could be updated.
     */
    public abstract void beforeSave();

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
        Symbol<?> other = (Symbol<?>) obj;
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
