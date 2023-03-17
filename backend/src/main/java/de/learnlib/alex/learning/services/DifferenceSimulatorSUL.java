package de.learnlib.alex.learning.services;

import de.learnlib.api.SUL;
import net.automatalib.automata.transducers.impl.compact.CompactMealy;

public class DifferenceSimulatorSUL implements SUL<String, String> {

    private final String undefinedOutput;
    private final CompactMealy<String, String> hyp1;
    private final CompactMealy<String, String> hyp2;

    private Integer currentStateHyp1 = 0;
    private Integer currentStateHyp2 = 0;

    private boolean differenceFound = false;

    public DifferenceSimulatorSUL(
            CompactMealy<String, String> hyp1,
            CompactMealy<String, String> hyp2,
            String undefinedOutput
    ) {
        this.hyp1 = hyp1;
        this.hyp2 = hyp2;
        this.undefinedOutput = undefinedOutput;
    }

    @Override
    public void pre() {
        currentStateHyp1 = hyp1.getInitialState();
        currentStateHyp2 = hyp2.getInitialState();
        differenceFound = false;
    }

    @Override
    public void post() {
    }

    @Override
    public String step(String o) {
        if (differenceFound) return undefinedOutput;

        final var out1 = hyp1.getOutput(currentStateHyp1, o);
        final var out2 = hyp2.getOutput(currentStateHyp2, o);

        currentStateHyp1 = hyp1.getSuccessor(currentStateHyp1, o);
        currentStateHyp2 = hyp2.getSuccessor(currentStateHyp2, o);

        if (out1.equals(out2)) {
            return out1;
        } else {
            differenceFound = true;
            return out1 + " <-> " + out2;
        }
    }
}
