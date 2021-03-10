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

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import de.learnlib.alex.data.entities.ProjectEnvironment;
import org.junit.Test;


public class ConnectorManagerTest {

    @Test
    public void shouldDisposeAllConnectors() {
        Connector connector1 = mock(WebSiteConnector.class);
        Connector connector2 = mock(WebServiceConnector.class);

        ConnectorManager manager = new ConnectorManager(new ProjectEnvironment());
        manager.addConnector(connector1);
        manager.addConnector(connector2);

        manager.dispose();

        verify(connector1).dispose();
        verify(connector2).dispose();
    }
}
