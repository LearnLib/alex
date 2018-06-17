/*
 * Copyright 2018 TU Dortmund
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

package de.learnlib.alex.integrationtests.repositories;

import de.learnlib.alex.App;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.data.entities.Project;
import de.learnlib.alex.data.entities.ProjectUrl;
import de.learnlib.alex.data.entities.SymbolGroup;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = App.class)
@Ignore
public abstract class AbstractRepositoryIT {

    User createUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("test");
        return user;
    }

    Project createProject(User user, String name) {
        ProjectUrl url = new ProjectUrl();
        url.setUrl("http://localhost");
        url.setDefault(true);

        Project project = new Project();
        project.setUser(user);
        project.setName(name);
        project.getUrls().add(url);

        SymbolGroup defaultGroup = new SymbolGroup();
        defaultGroup.setProject(project);
        defaultGroup.setId(0L);
        defaultGroup.setName("Default group");

        project.getGroups().add(defaultGroup);
        return project;
    }

}
