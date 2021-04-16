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

package de.learnlib.alex.data.entities.actions.rest;

import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;

import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;

public class RestActionTest {

    protected ConnectorManager connectors;

    protected WebServiceConnector webServiceConnector;

    protected void setUp() {
        connectors = mock(ConnectorManager.class);
        webServiceConnector = mock(WebServiceConnector.class);
        lenient().when(connectors.getConnector(WebServiceConnector.class)).thenReturn(webServiceConnector);
    }
}
