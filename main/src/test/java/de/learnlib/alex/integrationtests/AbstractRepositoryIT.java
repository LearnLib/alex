/*
 * Copyright 2016 TU Dortmund
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

package de.learnlib.alex.integrationtests;

import de.learnlib.alex.App;
import de.learnlib.alex.core.entities.Project;
import de.learnlib.alex.core.entities.SymbolGroup;
import de.learnlib.alex.core.entities.User;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = App.class)
public abstract class AbstractRepositoryIT {

    User createUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("test");
        return user;
    }

    Project createProject(User user, String name) {
        Project project = new Project();
        project.setUser(user);
        project.setName(name);
        project.setBaseUrl("http://localhost");

        SymbolGroup defaultGroup = new SymbolGroup();
        defaultGroup.setUser(user);
        defaultGroup.setProject(project);
        defaultGroup.setId(0L);
        defaultGroup.setName("Default Group");

        project.getGroups().add(defaultGroup);
        project.setDefaultGroup(defaultGroup);

        return project;
    }

}
