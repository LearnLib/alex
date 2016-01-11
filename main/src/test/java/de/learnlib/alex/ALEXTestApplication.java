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

package de.learnlib.alex;

import de.learnlib.alex.core.dao.CounterDAO;
import de.learnlib.alex.core.dao.FileDAO;
import de.learnlib.alex.core.dao.LearnerResultDAO;
import de.learnlib.alex.core.dao.ProjectDAO;
import de.learnlib.alex.core.dao.SymbolDAO;
import de.learnlib.alex.core.dao.SymbolGroupDAO;
import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.learner.Learner;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

public class ALEXTestApplication extends ResourceConfig {

    public ALEXTestApplication(final UserDAO userDAO,
                               final ProjectDAO projectDAO,
                               CounterDAO counterDAO,
                               final SymbolGroupDAO symbolGroupDAO,
                               final SymbolDAO symbolDAO,
                               final LearnerResultDAO learnerResultDAO,
                               final FileDAO fileDAO,
                               final Learner learner,
                               Class<?>... classes) {
        super(classes);

        register(MultiPartFeature.class);

        register(FakeAuthenticationFilter.class);

        // register some classes/ objects for IoC.
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(userDAO).to(UserDAO.class);
                bind(projectDAO).to(ProjectDAO.class);
                bind(counterDAO).to(CounterDAO.class);
                bind(symbolGroupDAO).to(SymbolGroupDAO.class);
                bind(symbolDAO).to(SymbolDAO.class);
                bind(fileDAO).to(FileDAO.class);
                bind(learner).to(Learner.class);
                bind(learnerResultDAO).to(LearnerResultDAO.class);
            }
        });

    }

}
