package de.learnlib.alex.core.learner;

import de.learnlib.api.SUL;
import de.learnlib.api.SULException;
import de.learnlib.oracles.ResetCounterSUL;
import de.learnlib.oracles.SymbolCounterSUL;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Wrapper SUL which takes care of counting our statistics.
 *
 * @param <I>
 *         The Input Type.
 * @param <O>
 *         The Output Type.
 */
public class AlexSUL<I, O> implements SUL<I, O> {

    /** The actual System Under Learning put into a cache. */
    private final SUL<I, O> inputSUL;

    /** SUL that counts the resets/ mqs and will call the cachedSUL for the learning. */
    private ResetCounterSUL<I, O> resetCounterSUL;

    /** SUL that counts the amount of symbols used and will call the resetCounterSUL for the learning. */
    private SymbolCounterSUL<I, O> symbolCounterSUL;

    /**
     * @param inputSUL
     *         The SUL that will handle the actual requests.
     */
    public AlexSUL(SUL<I, O> inputSUL) {
        this.inputSUL = inputSUL;
        resetCounter();
    }

    /**
     * @return The amount of resets / MQs that the inputSUL has executed.
     */
    public long getResetCount() {
        return resetCounterSUL.getStatisticalData().getCount();
    }

    /**
     * @return The amount of used symbol that the inputSUL has executed.
     */
    public long getSymbolUsedCount() {
        return symbolCounterSUL.getStatisticalData().getCount();
    }

    /**
     * Reset the counter of this SUL.
     */
    public void resetCounter() {
        this.resetCounterSUL  = new ResetCounterSUL<>("resets", inputSUL);
        this.symbolCounterSUL = new SymbolCounterSUL<>("symbols used", resetCounterSUL);
    }

    @Override
    public void pre() {
        symbolCounterSUL.pre();
    }

    @Override
    public void post() {
        symbolCounterSUL.post();
    }

    @Nullable
    @Override
    public O step(@Nullable I input) throws SULException {
        return symbolCounterSUL.step(input);
    }

    @Override
    public boolean canFork() {
        return symbolCounterSUL.canFork();
    }

    @Nonnull
    @Override
    public SUL<I, O> fork() throws UnsupportedOperationException {
        return symbolCounterSUL.fork();
    }
}
