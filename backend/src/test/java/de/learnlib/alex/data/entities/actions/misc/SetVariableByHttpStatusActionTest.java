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

package de.learnlib.alex.data.entities.actions.misc;

import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.VariableStoreConnector;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import javax.validation.ValidationException;

public class SetVariableByHttpStatusActionTest {

    private SetVariableByHttpStatusAction action;

    private ConnectorManager connectors;

    private WebServiceConnector webServiceConnector;

    private VariableStoreConnector variableStore;

    @Before
    public void before() {
        this.webServiceConnector = Mockito.mock(WebServiceConnector.class);
        this.variableStore = new VariableStoreConnector();

        this.connectors = Mockito.mock(ConnectorManager.class);
        Mockito.when(connectors.getConnector(WebServiceConnector.class)).thenReturn(this.webServiceConnector);
        Mockito.when(connectors.getConnector(VariableStoreConnector.class)).thenReturn(this.variableStore);

        this.action = new SetVariableByHttpStatusAction();
        this.action.setName("var");
    }

    @Test
    public void shouldStoreStatusInAVariable() {
        Mockito.when(webServiceConnector.getStatus()).thenReturn(200);

        final ExecuteResult result = this.action.execute(connectors);

        Assert.assertTrue(result.isSuccess());
        Assert.assertEquals("200", variableStore.get("var"));
    }

    @Test(expected = IllegalStateException.class)
    public void shouldNotStoreStatusIfAnExceptionOccurs() {
        Mockito.when(webServiceConnector.getStatus()).thenThrow(new ValidationException());

        final ExecuteResult result = this.action.execute(connectors);

        Assert.assertFalse(result.isSuccess());
        Assert.assertNull(variableStore.getStore().get("var"));
        variableStore.get("var");
    }
}
