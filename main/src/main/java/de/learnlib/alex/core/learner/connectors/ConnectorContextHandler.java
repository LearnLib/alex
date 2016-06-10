/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.core.learner.connectors;

import de.learnlib.alex.core.entities.ExecuteResult;
import de.learnlib.alex.core.entities.Symbol;
import de.learnlib.alex.exceptions.LearnerException;
import de.learnlib.mapper.ContextExecutableInputSUL;

/**
 * ContextHandler for the connectors.
 */
public class ConnectorContextHandler implements ContextExecutableInputSUL.ContextHandler<ConnectorManager> {

    /** The symbol used to reset the SUL. */
    private Symbol resetSymbol;

    /** The manager which holds all the connectors. */
    private ConnectorManager connectors;

    /**
     * Default constructor.
     */
    public ConnectorContextHandler() {
        this.connectors = new ConnectorManager();
    }

    /**
     * Add a connector to the set of connectors.
     *
     * @param connector
     *         The new connector.
     */
    public void addConnector(Connector connector) {
        this.connectors.addConnector(connector.getClass(), connector);
    }

    /**
     * Set the reset symbol that should be used to reset the SUL.
     *
     * @param resetSymbol
     *         The new reset symbol.
     */
    public void setResetSymbol(Symbol resetSymbol) {
        this.resetSymbol = resetSymbol;
    }

    @Override
    public ConnectorManager createContext() throws LearnerException {
        for (Connector connector : connectors) {
            try {
                connector.reset();
            } catch (Exception e) {
                throw new LearnerException(e.getMessage(), e);
            }
        }

        executeResetSymbol();

        return connectors;
    }

    private void executeResetSymbol() throws LearnerException {
        ExecuteResult resetResult;
        try {
            resetResult = resetSymbol.execute(connectors);
        } catch (Exception e) {
            throw new LearnerException("An error occurred while executing the reset symbol.", e);
        }

        if (resetResult.equals(ExecuteResult.FAILED)) {
            throw new LearnerException("The execution of the reset symbol failed on step "
                                               + resetResult.getFailedActionNumber() + ".");
        }
    }

    @Override
    public void disposeContext(ConnectorManager connector) {
        connectors.dispose();
    }

}
