package de.learnlib.weblearner.entities;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

/**
 * Enumeration used to filter the symbol list by a query parameter.
 */
public enum SymbolVisibilityLevel {

    /** Show all symbols. */
    ALL(Restrictions.in("deleted", new Boolean[] {true, false })),

    /** Show only visible ones. */
    VISIBLE(Restrictions.eq("deleted", false)),

    /** Show only hidden ones. */
    HIDDEN(Restrictions.eq("deleted", true));


    /** A criterion/ expression related to the entry. */
    private Criterion criterion;

    /**
     * Private constructor because it's an enum.
     *
     * @param criterion
     *         The criterion/ expression the entry represents.
     */
    private SymbolVisibilityLevel(Criterion criterion) {
        this.criterion = criterion;
    }

    /**
     * Get the criterion/ expression which is represented by the enum entry.
     *
     * @return The criterion/ expression of the entry.
     */
    public Criterion getCriterion() {
        return criterion;
    }

    /**
     * Parse a string into an entry of this enum.
     * It is forbidden to override toValue(), so we use this method to allow the lowercase variants, too.
     *
     * @param name
     *         THe name to parse into an entry.
     * @return The fitting entry of this enum.
     * @throws IllegalArgumentException
     *         If the name could not be parsed.
     */
    public static SymbolVisibilityLevel fromString(String name) throws IllegalArgumentException {
        return SymbolVisibilityLevel.valueOf(name.toUpperCase());
    }

    @Override
    public String toString() {
        return name().toLowerCase();
    }

}
