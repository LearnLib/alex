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

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class VariableStoreConnectorTest {

    private static final String VARIABLE_NAME = "variable";
    private static final String VARIABLE_VALUE = "foobar";

    private VariableStoreConnector connector;

    @Before
    public void setUp() {
        connector = new VariableStoreConnector();
    }

    @Test
    public void shouldCorrectlyStoreAVariable() {
        connector.set(VARIABLE_NAME, VARIABLE_VALUE);

        assertNotNull(connector.get(VARIABLE_NAME));
        assertEquals(VARIABLE_VALUE, connector.get(VARIABLE_NAME));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldResetTheStorage() {
        connector.set(VARIABLE_NAME, VARIABLE_VALUE);

        connector.reset();
        assertNull(connector.get(VARIABLE_NAME));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldFailWhenFetchingANotSetVariable() {
        connector.get(VARIABLE_NAME);
    }

}
