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

package de.learnlib.alex.integrationtests.resources;

import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.integrationtests.resources.api.ProjectApi;
import de.learnlib.alex.integrationtests.resources.api.UserApi;
import org.junit.Before;
import org.junit.Test;

import java.net.InetAddress;

public class LearnerResourceIT extends AbstractResourceIT {

    private String jwt;
    private Project project;

    @Before
    public void pre() throws Exception {
        final UserApi userApi = new UserApi(client, port);
        final ProjectApi projectApi = new ProjectApi(client, port);

        jwt = userApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        final String url = "http://" + InetAddress.getLocalHost().getHostName() + " :" + port;
        project = projectApi.create("{\"name\":\"test\",\"url\":\"" + url + "\"}", jwt)
                .readEntity(Project.class);
    }

    @Test
    public void startLearningProcess() {
        // TODO
    }

    @Test
    public void resumeLearningProcess() {
        // TODO
    }

    @Test
    public void getStatusIfNoLearningProcessIsActive() {
        // TODO
    }

    @Test
    public void readOutputs() {
        // TODO
    }

    @Test
    public void readSeparatingWord() {
        // TODO
    }
}
