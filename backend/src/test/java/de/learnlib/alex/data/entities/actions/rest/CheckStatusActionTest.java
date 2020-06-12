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

package de.learnlib.alex.data.entities.actions.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.learnlib.alex.data.entities.ExecuteResult;
import de.learnlib.alex.learning.services.connectors.WebServiceConnector;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import javax.ws.rs.core.Response;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;

@RunWith(MockitoJUnitRunner.class)
public class CheckStatusActionTest {

    @Mock
    private WebServiceConnector connector;

    private CheckStatusAction c;

    @Before
    public void setUp() {
        c = new CheckStatusAction();
        c.setStatus(Response.Status.OK.getStatusCode());
    }

    @Test
    public void testJSON() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(c);
        CheckStatusAction c2 = mapper.readValue(json, CheckStatusAction.class);

        assertEquals(c.getStatus(), c2.getStatus());
    }

    @Test
    public void testJSONFile() throws IOException, URISyntaxException {
        ObjectMapper mapper = new ObjectMapper();

        File file = new File(getClass().getResource("/actions/restsymbolactions/CheckStatusTestData.json").toURI());
        RESTSymbolAction obj = mapper.readValue(file, RESTSymbolAction.class);

        assertTrue(obj instanceof CheckStatusAction);
        CheckStatusAction objAsAction = (CheckStatusAction) obj;
        assertEquals(Response.Status.OK.getStatusCode(), objAsAction.getStatus());
    }

    @Test
    public void shouldAcceptCorrectStatus() {
        given(connector.getStatus()).willReturn(Response.Status.OK.getStatusCode());

        ExecuteResult result = c.execute(connector);
        assertTrue(result.isSuccess());
    }

    @Test
    public void shouldFailOnWrongStatus() {
        given(connector.getStatus()).willReturn(Response.Status.BAD_REQUEST.getStatusCode());

        ExecuteResult result = c.execute(connector);
        assertFalse(result.isSuccess());
    }

}
