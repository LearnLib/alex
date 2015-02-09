package de.learnlib.weblearner.entities;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

public enum SymbolVisibilityLevel {

    ALL(Restrictions.in("deleted", new Boolean[] { true, false } )),
    VISIBLE(Restrictions.eq("deleted", false)),
    HIDDEN(Restrictions.eq("deleted", true));

    private Criterion expression;

    private SymbolVisibilityLevel(Criterion expression) {
        this.expression = expression;
    }

    public Criterion getExpression() {
        return expression;
    }

    @Override
    public String toString() {
        return name().toLowerCase();
    }

}
