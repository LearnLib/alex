package de.learnlib.weblearner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Abstract super type of how a Action for Symbols should look & work like.
 *
 * @param <C> The type used to implement the actions the Symbol will use during the learning process.
 */
@Entity
@Table(name = "ACTIONS")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("SUPER")
public abstract class SymbolAction<C> implements Serializable {

    /** The ID of the Action in the DB. */
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    @JsonIgnore
    protected long id;

    /** The position the action has in the actions list of the {@link Symbol}. */
    @JsonIgnore
    protected int number;

    /**
     * Get the ID of the Action used in the DB.
     *
     * @return The DB ID of the Action.
     */
    public long getId() {
        return id;
    }

    /**
     * Set the ID of the Action in the DB.
     *
     * @param id
     *            The DB ID of the Action.
     */
    public void setId(long id) {
        this.id = id;
    }

    /**
     * Get the position the action has in the actions list of the {@link Symbol}.
     *
     * @return The position of the action in the list.
     */
    public int getNumber() {
        return number;
    }

    /**
     * Set the position the action has in the actions list.
     *
     * @param no The new position.
     */
    public void setNumber(int no) {
        this.number = no;
    }

    /**
     * Execute the Action. This is the important method in which all the magic will happen.
     *
     * @param target
     *              The context to use.
     * @return An {@link ExecuteResult} to indicate if the action
     *          run successfully or not.
     */
    public abstract ExecuteResult execute(C target);
}
