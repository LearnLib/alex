package de.learnlib.alex.learning.entities;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Transient;

public class LearnerStatus {

    private LearningProcessStatus currentProcess;

    private List<LearnerResult> queue;

    public LearnerStatus() {
        this.queue = new ArrayList<>();
    }

    public LearnerStatus(LearningProcessStatus currentProcess) {
        this.currentProcess = currentProcess;
    }

    public LearningProcessStatus getCurrentProcess() {
        return currentProcess;
    }

    public void setCurrentProcess(LearningProcessStatus currentProcess) {
        this.currentProcess = currentProcess;
    }

    public List<LearnerResult> getQueue() {
        return queue;
    }

    public void setQueue(List<LearnerResult> queue) {
        this.queue = queue;
    }

    @Transient
    public boolean isActive() {
        return currentProcess != null || !queue.isEmpty();
    }
}
