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

package de.learnlib.alex.data.entities.actions.web;

import de.learnlib.alex.learning.services.connectors.ConnectorManager;
import de.learnlib.alex.learning.services.connectors.WebSiteConnector;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public abstract class WebActionTest {

    protected ConnectorManager connectors;

    protected WebSiteConnector webSiteConnector;

    protected void setUp() {
        connectors = mock(ConnectorManager.class);
        webSiteConnector = mock(WebSiteConnector.class);

        given(connectors.getConnector(WebSiteConnector.class)).willReturn(webSiteConnector);
    }
}
