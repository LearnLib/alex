/*
 * Copyright 2015 - 2020 TU Dortmund
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

import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.dao.CounterDAO;
import de.learnlib.alex.data.dao.FileDAO;
import de.learnlib.alex.data.entities.ParameterizedSymbol;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.learning.entities.WebDriverConfig;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Factor to create a ContextHandler which knows all available connectors.
 */
@Service
public class PreparedConnectorContextHandlerFactory {

    /** The {@link CounterDAO}. */
    private CounterDAO counterDAO;

    /** The {@link FileDAO}. */
    private FileDAO fileDAO;

    /**
     * Constructor.
     *
     * @param counterDAO
     *         {@link CounterDAO}.
     * @param fileDAO
     *         {@link FileDAO}.
     */
    @Inject
    public PreparedConnectorContextHandlerFactory(CounterDAO counterDAO, FileDAO fileDAO) {
        this.counterDAO = counterDAO;
        this.fileDAO = fileDAO;
    }

    /**
     * Create a context handler that only requires a URL to create a new context.
     *
     * @param user
     *         The user that starts the learning process.
     * @param project
     *         The project.
     * @param driverConfig
     *         The config for the web driver.
     * @param resetSymbol
     *         The symbol to reset the SUL.
     * @param postSymbol
     *         The symbol to execute after each membership query.
     * @return The prepared context handler.
     */
    public PreparedContextHandler createPreparedContextHandler(User user,
                                                               Project project,
                                                               WebDriverConfig driverConfig,
                                                               ParameterizedSymbol resetSymbol,
                                                               ParameterizedSymbol postSymbol) {
        return new PreparedContextHandler(counterDAO, fileDAO, user, project, driverConfig, resetSymbol, postSymbol);
    }
}
