/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.mapper.ContextExecutableInputSUL;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * ContextHandler for the connectors.
 */
public class ConnectorContextHandler implements ContextExecutableInputSUL.ContextHandler<ConnectorManager> {

    /** The pool with the managers for the sul. */
    private BlockingQueue<ConnectorManager> pool;

    /** The symbol used to reset the SUL. */
    private ParameterizedSymbol resetSymbol;

    /**
     * Default constructor.
     */
    public ConnectorContextHandler() {
        this.pool = new LinkedBlockingQueue<>();
    }

    /**
     * Add a connector to the set of connectors.
     *
     * @param connectorManager
     *         The new connector manager.
     */
    public void addConnectorManager(ConnectorManager connectorManager) {
        try {
            pool.put(connectorManager);
        } catch (InterruptedException e) {
            e.printStackTrace();
            System.exit(0);
        }
    }

    /**
     * Set the reset symbol that should be used to reset the SUL.
     *
     * @param resetSymbol
     *         The new reset symbol.
     */
    public void setResetSymbol(ParameterizedSymbol resetSymbol) {
        this.resetSymbol = resetSymbol;
    }

    @Override
    public ConnectorManager createContext() throws LearnerException {
        ConnectorManager connectorManager;
        try {
            connectorManager = pool.take();
        } catch (InterruptedException e) {
            throw new LearnerException("An error occurred while creating a new context.", e);
        }

        try {
            for (Connector connector : connectorManager) {
                connector.reset();
            }
        } catch (Exception e) {
            throw new LearnerException("An error occurred while resetting a connector.", e);
        }

        ExecuteResult resetResult;
        try {
            // initialize counters defined in the reset symbol as input
            final CounterStoreConnector counterStore = connectorManager.getConnector(CounterStoreConnector.class);

            resetSymbol.getSymbol().getInputs().stream()
                    .filter(in -> in.getParameterType().equals(SymbolParameter.ParameterType.COUNTER))
                    .forEach(in -> {
                        try {
                            counterStore.get(in.getName());
                        } catch (IllegalStateException e) {
                            counterStore.set(resetSymbol.getSymbol().getProjectId(), in.getName(), 0);
                        }
                    });
            resetResult = resetSymbol.execute(connectorManager);
        } catch (Exception e) {
            throw new LearnerException("An error occurred while executing the reset symbol.", e);
        }

        if (!resetResult.isSuccess()) {
            throw new LearnerException("The execution of the reset symbol failed: "
                    + resetResult.toString() + ".");
        }

        return connectorManager;
    }

    @Override
    public void disposeContext(ConnectorManager connectorManager) {
        try {
            pool.put(connectorManager);
            connectorManager.dispose();
        } catch (InterruptedException e) {
            throw new LearnerException(e.getMessage(), e);
        }
    }

    /** Execute the {@link ConnectorManager#post} method after the learner has finished. */
    public void post() {
        pool.forEach(ConnectorManager::post);
    }

    /** @return The number of mqs executed in parallel. */
    public int getMaxConcurrentQueries() {
        return pool.size();
    }
}
