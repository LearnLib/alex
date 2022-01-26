/*
 * Copyright 2015 - 2022 TU Dortmund
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class VariableStoreConnectorTest {

    private static final String VARIABLE_NAME = "variable";
    private static final String VARIABLE_VALUE = "foobar";

    private VariableStoreConnector connector;

    @BeforeEach
    public void setUp() {
        connector = new VariableStoreConnector();
    }

    @Test
    public void shouldCorrectlyStoreAVariable() {
        connector.set(VARIABLE_NAME, VARIABLE_VALUE);

        assertNotNull(connector.get(VARIABLE_NAME));
        assertEquals(VARIABLE_VALUE, connector.get(VARIABLE_NAME));
    }

    @Test
    public void shouldResetTheStorage() {
        connector.set(VARIABLE_NAME, VARIABLE_VALUE);
        connector.reset();
    }

    @Test
    public void shouldFailWhenFetchingANotSetVariable() {
        assertThrows(IllegalStateException.class, () -> connector.get(VARIABLE_NAME));
    }

}
