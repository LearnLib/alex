/*
 * Copyright 2015 - 2019 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.learnlib.alex.learning.services;

import de.learnlib.alex.learning.entities.LearnerResult;
import de.learnlib.alex.learning.repositories.LearnerResultRepository;

import javax.transaction.Transactional;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.stream.Collectors;

/**
 * A learner thread runs learning processes per project and handles the process queue.
 */
public class LearnerThread extends Thread {

    /**
     * Listener that is called as soon as the queue is empty and the current learner process is terminated.
     */
    public interface FinishedListener {
        void handleFinished();
    }

    private LearnerResultRepository learnerResultRepository;

    private FinishedListener finishedListener;

    /** The FIFO queue for learning processes. */
    private Deque<AbstractLearnerProcess> processQueue = new ArrayDeque<>();

    /** The process that is currently being executed. */
    private AbstractLearnerProcess currentProcess;

    public LearnerThread(LearnerResultRepository learnerResultRepository, FinishedListener finishedListener) {
        this.learnerResultRepository = learnerResultRepository;
        this.finishedListener = finishedListener;
    }

    public void enqueue(AbstractLearnerProcess learnerProcess) {
        this.processQueue.offer(learnerProcess);
    }

    @Transactional
    public void abort(Long testNo) {
        if (currentProcess != null && currentProcess.getResult().getTestNo().equals(testNo)) {
            this.currentProcess.stopLearning();

            final LearnerResult learnerResult = currentProcess.getResult();
            learnerResult.setStatus(LearnerResult.Status.ABORTED);
            learnerResultRepository.save(learnerResult);
        }

        if (!processQueue.isEmpty()) {
            processQueue.forEach(r -> {
                if (r.getResult().getTestNo().equals(testNo)) {
                    r.getResult().setStatus(LearnerResult.Status.ABORTED);
                    learnerResultRepository.save(r.getResult());
                }
            });
        }
    }

    @Override
    @Transactional
    public void run() {
        while (!processQueue.isEmpty()) {
            currentProcess = processQueue.poll();
            final LearnerResult learnerResult = currentProcess.getResult();

            if (learnerResult.getStatus().equals(LearnerResult.Status.ABORTED)) {
                learnerResultRepository.save(learnerResult);
                continue;
            }

            learnerResult.setStatus(LearnerResult.Status.IN_PROGRESS);
            learnerResultRepository.save(learnerResult);
            currentProcess.run();
            learnerResult.setStatus(LearnerResult.Status.FINISHED);
            learnerResultRepository.save(learnerResult);
        }
        this.finishedListener.handleFinished();
    }

    public AbstractLearnerProcess getCurrentProcess() {
        return currentProcess;
    }

    public List<LearnerResult> getProcessQueue() {
        return processQueue.stream()
                .map(AbstractLearnerProcess::getResult)
                .collect(Collectors.toList());
    }
}
