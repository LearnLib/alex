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

import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.entities.Counter;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.exceptions.NotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Connector to store and manage counters.
 */
@Service
public class CounterStoreConnector implements Connector {

    private static final Logger LOGGER = LogManager.getLogger();

    /**
     * The DAO to persist the counters to and fetch the counters from.
     */
    private CounterDAO counterDAO;

    /**
     * The map that keeps track of all counters used by different urls.
     * url -> (counterName -> counter).
     */
    private Map<String, Map<String, Counter>> countersMap;

    /**
     * Constructor.
     *
     * @param counterDAO
     *         An instance of a counter dao.
     */
    @Inject
    public CounterStoreConnector(CounterDAO counterDAO) {
        this.counterDAO = counterDAO;
        this.countersMap = new HashMap<>();
    }

    @Override
    public void reset() {
        // nothing to do here
    }

    @Override
    public void dispose() {
        // nothing to do here
    }

    /**
     * Register a URL of a project. For every URL a new entry in {@link #countersMap} is created with the
     * counters that are in the db to keep track of the counters for each URL.
     *
     * @param url
     *         The URL to register.
     * @param project
     *         The project that belongs to the URL.
     */
    public void registerUrl(String url, Project project) {
        try {
            List<Counter> counters = counterDAO.getAll(project.getUserId(), project.getId());
            Map<String, Counter> map = new HashMap<>();
            counters.forEach(counter -> map.put(counter.getName(), counter));
            this.countersMap.put(url, map);
        } catch (NotFoundException e) {
        }
    }

    /**
     * Set the value of an existing counter.
     * Creates a new counter implicitly with the specified name and value if it does not exist yet.
     *
     * @param userId
     *         The id of the user.
     * @param projectId
     *         The id of the project.
     * @param url
     *         The url of the sul.
     * @param name
     *         The name of the counter.
     * @param value
     *         The value of the counter.
     */
    public void set(Long userId, Long projectId, String url, String name, Integer value) {
        if (this.countersMap.get(url).containsKey(name)) {
            Counter counter = this.countersMap.get(url).get(name);
            counter.setValue(value);
        } else {
            Counter counter = createCounter(userId, projectId, name, value);
            this.countersMap.get(url).put(name, counter);
        }
        LOGGER.debug("Set the counter '{}' in the project <{}> of user <{}> to '{}'.", name, projectId, userId, value);
    }

    /**
     * Increment the value of an existing counter.
     * Creates a new counter implicitly with the specified name if it does not exist yet.
     * The value of the new counter will be 1.
     *
     * @param userId
     *         The id of the user.
     * @param projectId
     *         The id of the project.
     * @param url
     *         The url of the sul.
     * @param name
     *         The name of the counter to increment.
     */
    public void increment(Long userId, Long projectId, String url, String name) {
        Counter counter;
        if (this.countersMap.get(url).containsKey(name)) {
            counter = this.countersMap.get(url).get(name);
            counter.setValue(counter.getValue() + 1);
        } else {
            counter = createCounter(userId, projectId, name, 1);
            this.countersMap.get(url).put(name, counter);
        }
        LOGGER.debug("Incremented the counter '{}' in the project <{}> of user <{}> to '{}'.", name, projectId, userId,
                     counter.getValue());
    }

    /**
     * Get the value of an existing counter.
     *
     * @param url
     *         The url of the project or a mirror.
     * @param name
     *         The name of the counter.
     *
     * @return The positive value of the counter.
     *
     * @throws IllegalStateException
     *         If the counter 'name' has not been set yet.
     * @throws IllegalStateException
     *         If the counter 'name' has not been set yet.
     */
    public Integer get(String url, String name) throws IllegalStateException {
        return this.countersMap.get(url).get(name).getValue();
    }

    /**
     * Create a new counter with a name and an initial, non negative value.
     * The name of the counter should not exist in the database.
     *
     * @param userId
     *         The id of the user.
     * @param projectId
     *         The id of the project.
     * @param name
     *         The name of the counter.
     * @param value
     *         The initial value of the counter.
     *
     * @return The created counter.
     */
    private Counter createCounter(Long userId, Long projectId, String name, Integer value) {
        Counter counter = new Counter();
        counter.setUser(new User(userId));
        counter.setProject(new Project(projectId));
        counter.setName(name);
        counter.setValue(value);
        return counter;
    }

    /**
     * Creates and|or updates the maximum value for each counter stored in {@link #countersMap}.
     */
    public void saveCounters() {

        // Find all counters that have been initialized, but are not yet persisted and create them.
        // We don't care for their value yet as this is done in the next iteration.
        List<String> createdCounterNames = new ArrayList<>();
        countersMap.keySet().forEach(url -> countersMap.get(url).keySet().forEach(name -> {
            Counter counter = countersMap.get(url).get(name);
            if (counter.getCounterId() == null && !createdCounterNames.contains(name)) {
                counterDAO.create(counter);

                // make sure all urls have the newly created counter
                // otherwise there will be a constraint violation exception in the next run
                countersMap.values().forEach(stringCounterMap -> stringCounterMap.put(name, counter.clone()));
                createdCounterNames.add(name);
            }
        }));

        // Find max values for each counter.
        // The map then contains new counters with their maximum value from all urls.
        Map<String, Counter> maxCounterValues = new HashMap<>();    // counterName -> Counter
        countersMap.keySet().forEach(url -> countersMap.get(url).entrySet().forEach(entry -> {
            Counter counter = entry.getValue().clone();
            if (maxCounterValues.containsKey(entry.getKey())) {
                int max = Math.max(maxCounterValues.get(entry.getKey()).getValue(), entry.getValue().getValue());
                counter.setValue(max);
            }
            maxCounterValues.put(entry.getKey(), counter);
        }));

        // Update the counters in {@link #countersMap}
        countersMap.keySet().forEach(url -> countersMap.get(url).entrySet().forEach(
                entry -> entry.setValue(maxCounterValues.get(entry.getKey()))));

        // Persist the maximum value of each counter.
        counterDAO.update(new ArrayList<>(maxCounterValues.values()));
    }
}
