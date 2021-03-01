/*
 * Copyright 2015 - 2021 TU Dortmund
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

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

/**
 * A learner thread runs learning processes per project and handles the process queue.
 */
@Service
@Scope("prototype")
public class LearnerThread extends Thread {

    /**
     * Listener that is called as soon as the queue is empty and the current learner process is terminated.
     */
    public interface FinishedListener {
        void handleFinished();
    }

    @Autowired
    private ApplicationContext applicationContext;

    private FinishedListener finishedListener;

    public void onFinished(FinishedListener listener) {
        this.finishedListener = listener;
    }

    /** The FIFO queue for learning processes. */
    private final Deque<AbstractLearnerProcessQueueItem> processQueue = new ArrayDeque<>();

    /** The process that is currently being executed. */
    private AbstractLearnerProcess<? extends AbstractLearnerProcessQueueItem> currentProcess;

    public void enqueue(AbstractLearnerProcessQueueItem item) {
        this.processQueue.offer(item);
    }

    public void abort(Long resultId) {
        if (currentProcess != null) {
            while (!currentProcess.isInitialized()) {
                try {
                    Thread.sleep(100);
                } catch (Exception ignored) {
                }
            }

            if (currentProcess.getResult().getId().equals(resultId)) {
                this.currentProcess.abort();
            }
        }
    }

    @Override
    public void run() {
        while (!processQueue.isEmpty()) {

            final var item = processQueue.poll();

            if (item instanceof StartingLearnerProcessQueueItem) {
                currentProcess = applicationContext.getBean(StartingLearnerProcess.class);
                ((StartingLearnerProcess) currentProcess).init((StartingLearnerProcessQueueItem) item);
            } else if (item instanceof ResumingLearnerProcessQueueItem) {
                currentProcess = applicationContext.getBean(ResumingLearnerProcess.class);
                ((ResumingLearnerProcess) currentProcess).init((ResumingLearnerProcessQueueItem) item);
            }

            if (currentProcess.isAborted()) continue;

            currentProcess.run();
        }

        this.finishedListener.handleFinished();
    }

    public AbstractLearnerProcess<? extends AbstractLearnerProcessQueueItem> getCurrentProcess() {
        return currentProcess;
    }

    public List<AbstractLearnerProcessQueueItem> getProcessQueue() {
        return new ArrayList<>(processQueue);
    }
}
