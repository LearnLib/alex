package de.learnlib.alex.learning.entities;

import de.learnlib.alex.learning.entities.learnlibproxies.DefaultQueryProxy;
import de.learnlib.alex.learning.services.LearnerService;

import java.util.List;

public class LearningProcessStatus {
    private LearnerResult result;
    private LearnerService.LearnerPhase phase;
    private List<DefaultQueryProxy> currentQueries;

    public LearnerResult getResult() {
        return result;
    }

    public void setResult(LearnerResult result) {
        this.result = result;
    }

    public LearnerService.LearnerPhase getPhase() {
        return phase;
    }

    public void setPhase(LearnerService.LearnerPhase phase) {
        this.phase = phase;
    }

    public List<DefaultQueryProxy> getCurrentQueries() {
        return currentQueries;
    }

    public void setCurrentQueries(List<DefaultQueryProxy> currentQueries) {
        this.currentQueries = currentQueries;
    }
}
