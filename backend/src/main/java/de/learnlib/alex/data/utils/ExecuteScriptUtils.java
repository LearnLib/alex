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


package de.learnlib.alex.data.utils;

import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.CounterStoreConnector;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import java.util.HashMap;
import java.util.Map;

public class ExecuteScriptUtils {

    private ExecuteScriptUtils() {
    }

    public static Map<String, Map<String, ? extends Object>> createScriptStore(ConnectorManager connector) {
        final VariableStoreConnector variableStore = connector.getConnector(VariableStoreConnector.class);
        final CounterStoreConnector counterStore = connector.getConnector(CounterStoreConnector.class);

        final Map<String, Map<String, ? extends Object>> store = new HashMap<>();
        store.put("variables", variableStore.getStore());
        store.put("counters", counterStore.getStore());
        store.put("urls", connector.getEnvironment().getUrlsAsMap());
        store.put("globals", connector.getEnvironment().getVariablesAsMap());

        return store;
    }
}
