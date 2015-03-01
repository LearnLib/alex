package de.learnlib.weblearner.entities;

import de.learnlib.api.SULException;
import de.learnlib.weblearner.learner.MultiConnector;
import org.hibernate.Hibernate;

import java.util.List;

/**
 * Default implementation of the SymbolActionHandler using a LinkedList and Hibernate.
 *
 * @param <A> The Type of Action to handle.
 */
public class DefaultSymbolActionHandler<A extends SymbolAction> implements SymbolActionHandler<A> {

    /** Back reference to the caller. */
    private SymbolActionHandler<A> symbol;

    /** The List of SymbolActions. */
    private List<A> actions;

    /**
     * Constructor.
     * @param symbol Back reference to the caller.
     * @param actions The List of Action used in the webSymbol/ caller.
     */
    public DefaultSymbolActionHandler(SymbolActionHandler<A> symbol, List<A> actions) {
        this.symbol = symbol;
        this.actions = actions;
    }

    @Override
    public List<A> getActions() {
        return actions;
    }

    @Override
    public void setActions(List<A> actions) {
        this.actions = actions;
    }

    @Override
    public void addAction(A action) throws IllegalArgumentException {
        if (action == null) {
            throw new IllegalArgumentException("can not add action 'null'");
        }

        actions.add(action);
    }

    @Override
    public void beforeSave() {
        for (int i = 0; i < actions.size(); i++) {
            A a = actions.get(i);
            a.setId(0);
            a.setNumber(i);
        }
    }

    @Override
    public void loadLazyRelations() {
        Hibernate.initialize(symbol.getActions());
    }

    /**
     * Execute the Actions. This is the important method in which all the magic will happen.
     *
     * @param context
     *         The context to use.
     * @return An {@link ExecuteResult} to indicate if the action
     *          run successfully or not.
     * @throws SULException If something related to the learning went wrong.
     */
    public String execute(MultiConnector context) throws SULException {
        actions = symbol.getActions();
        ExecuteResult result = ExecuteResult.OK;

        for (int i = 0; i < actions.size() && result == ExecuteResult.OK; i++) {
            ExecuteResult tmpResult = executeAction(actions.get(i), context);
            if (tmpResult != ExecuteResult.OK) {
                result = tmpResult;
            }
        }

        return result.toString();
    }

    private ExecuteResult executeAction(A action, MultiConnector context) {
        try {
            return action.execute(context);
        } catch (IllegalStateException e) {
            return ExecuteResult.FAILED;
        }
    }

}
