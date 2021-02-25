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

package de.learnlib.alex.learning.services.connectors;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.SymbolParameter;
import de.learnlib.alex.learning.exceptions.LearnerException;
import de.learnlib.mapper.ContextExecutableInputSUL;

/**
 * ContextHandler for the connectors.
 */
public class ConnectorContextHandler implements ContextExecutableInputSUL.ContextHandler<ConnectorManager> {

    /** The pool with the managers for the sul. */
    private ConnectorManager connectors;

    /** The symbol used to reset the SUL. */
    private ParameterizedSymbol resetSymbol;

    /** The symbol used after a membership query. */
    private ParameterizedSymbol postSymbol;

    /**
     * Constructor.
     *
     * @param connectors
     *         {@link #connectors}.
     * @param resetSymbol
     *         {@link #resetSymbol}.
     * @param postSymbol
     *         {@link #postSymbol}.
     */
    public ConnectorContextHandler(ConnectorManager connectors,
                                   ParameterizedSymbol resetSymbol,
                                   ParameterizedSymbol postSymbol) {
        this.connectors = connectors;
        this.resetSymbol = resetSymbol;
        this.postSymbol = postSymbol;
    }

    @Override
    public ConnectorManager createContext() throws LearnerException {
        int retries = 0;
        Exception exception = null;
        while (retries < 2) {
            try {
                try {
                    for (Connector connector : connectors) {
                        connector.reset();
                    }
                } catch (Exception e) {
                    throw new LearnerException("An error occurred while resetting a connector.", e);
                }

                ExecuteResult resetResult;
                try {
                    // initialize counters defined in the reset symbol as input
                    final CounterStoreConnector counterStore = connectors.getConnector(CounterStoreConnector.class);
                    resetSymbol.getSymbol().getInputs().stream()
                            .filter(in -> in.getParameterType().equals(SymbolParameter.ParameterType.COUNTER))
                            .forEach(in -> {
                                try {
                                    counterStore.get(in.getName());
                                } catch (IllegalStateException e) {
                                    counterStore.set(resetSymbol.getSymbol().getProjectId(), in.getName(), 0);
                                }
                            });
                    resetResult = resetSymbol.execute(connectors);
                } catch (Exception e) {
                    throw new LearnerException("An error occurred while executing the reset symbol.", e);
                }

                if (!resetResult.isSuccess()) {
                    throw new LearnerException("The execution of the reset symbol failed: "
                            + resetResult.toString() + ".");
                }

                return connectors;
            } catch (Exception e) {
                disposeContext(connectors);
                exception = e;
                retries++;
            }
        }

        throw new LearnerException("Failed to create a context. " + exception.getMessage(), exception);
    }

    @Override
    public void disposeContext(ConnectorManager connectorManager) {
        try {
            if (this.postSymbol != null) {
                this.postSymbol.execute(connectorManager);
            }
        } catch (Exception e) {
        }

        try {
            connectorManager.dispose();
        } catch (Exception e) {
            throw new LearnerException(e.getMessage(), e);
        }
    }

    /** Execute the {@link ConnectorManager#post} method after the learner has finished. */
    public void post() {
        connectors.post();
    }
}
