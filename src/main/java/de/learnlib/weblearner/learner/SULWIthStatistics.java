package de.learnlib.weblearner.learner;

import de.learnlib.api.SULException;
import de.learnlib.mapper.ContextExecutableInputSUL;

public class SULWIthStatistics<I extends de.learnlib.mapper.api.ContextExecutableInput<? extends O, ? super C>, O, C> extends ContextExecutableInputSUL<I , O, C> {

    private int mqs;

    private int symbols;

    public SULWIthStatistics(ContextHandler<C> contextHandler) {
        super(contextHandler);
        mqs = 0;
    }

    public int getMqs() {
        return mqs;
    }

    public int getSymbols() {
        return symbols;
    }

    @Override
    public void pre() {
        mqs++;
        super.pre();
    }

    @Override
    public O step(I in) throws SULException {
        symbols++;
        return super.step(in);
    }
}
