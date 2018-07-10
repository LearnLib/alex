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

package de.learnlib.alex;

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import de.learnlib.alex.auth.security.AuthenticationFilter;
import de.learnlib.alex.auth.security.JWTHelper;
import de.learnlib.alex.common.exceptions.NotFoundException;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.jose4j.lang.JoseException;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

public class ALEXTestApplication extends ResourceConfig {

    private User admin;

    private String adminToken;

    public ALEXTestApplication(Class<?>... classes) {
        this(mock(UserDAO.class), classes);
    }

    public ALEXTestApplication(UserDAO userDAO, Class<?>... classes) {
        super(classes);
        registerFeatures();

        try {
            bindUserDAO(userDAO);
            initAdmin(userDAO);
            initToken();
        } catch (NotFoundException e) {
            e.printStackTrace();
            admin = null;
            adminToken = null;
        }
    }

    private void registerFeatures() {
        packages("de.learnlib.alex.common.exceptions");

        register(MultiPartFeature.class);
        register(RolesAllowedDynamicFeature.class); // allow protecting routes with user roles
        register(AuthenticationFilter.class);
        register(JacksonConfiguration.class);
    }

    private void bindUserDAO(final UserDAO userDAO) {
        register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(userDAO).to(UserDAO.class);
            }
        });
    }

    private void initAdmin(UserDAO userDAO) throws NotFoundException {
        admin = new User();
        admin.setId(1L);
        admin.setEmail("admin@alex.example");
        admin.setPassword("admin");
        admin.setRole(UserRole.ADMIN);

        given(userDAO.getById(admin.getId())).willReturn(admin);
        given(userDAO.getByEmail(admin.getEmail())).willReturn(admin);
    }

    private void initToken() {
        try {
            adminToken = "Bearer " + JWTHelper.generateJWT(admin);
        } catch (JoseException e) {
            e.printStackTrace();
            adminToken = "";
        }
    }

    public User getAdmin() {
        return admin;
    }

    public String getAdminToken() {
        return adminToken;
    }

}
