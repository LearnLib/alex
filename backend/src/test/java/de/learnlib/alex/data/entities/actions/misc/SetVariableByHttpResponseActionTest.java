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

package de.learnlib.alex.data.entities.actions.misc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import javax.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

public class SetVariableByHttpResponseActionTest {

    private SetVariableByHttpResponseAction action;

    private ConnectorManager connectors;

    private WebServiceConnector webServiceConnector;

    private VariableStoreConnector variableStore;

    @BeforeEach
    public void before() {
        this.webServiceConnector = Mockito.mock(WebServiceConnector.class);
        this.variableStore = new VariableStoreConnector();

        this.connectors = Mockito.mock(ConnectorManager.class);
        Mockito.when(connectors.getConnector(WebServiceConnector.class)).thenReturn(this.webServiceConnector);
        Mockito.when(connectors.getConnector(VariableStoreConnector.class)).thenReturn(this.variableStore);

        this.action = new SetVariableByHttpResponseAction();
        this.action.setName("var");
    }

    @Test
    public void shouldSaveResponseBodyInVariable() {
        Mockito.when(webServiceConnector.getBody()).thenReturn("testBody");

        final ExecuteResult result = action.execute(connectors);

        assertTrue(result.isSuccess());
        assertEquals("testBody", variableStore.get("var"));
    }

    @Test
    public void shouldNotSaveResponseBodyInVariable() {
        Mockito.when(webServiceConnector.getBody()).thenThrow(new ValidationException());

        final ExecuteResult result = action.execute(connectors);

        assertFalse(result.isSuccess());
        assertNull(variableStore.getStore().get("var"));
        assertThrows(IllegalStateException.class, () -> variableStore.get("var"));
    }

}
