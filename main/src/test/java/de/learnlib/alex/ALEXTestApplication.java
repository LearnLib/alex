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

import de.learnlib.alex.core.dao.UserDAO;
import de.learnlib.alex.core.entities.User;
import de.learnlib.alex.core.entities.UserRole;
import de.learnlib.alex.exceptions.NotFoundException;
import de.learnlib.alex.security.AuthenticationFilter;
import de.learnlib.alex.security.JWTHelper;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.jose4j.lang.JoseException;
import org.springframework.context.annotation.Configuration;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;

@Configuration
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
        register(MultiPartFeature.class);
        register(RolesAllowedDynamicFeature.class); // allow protecting routes with user roles
        register(AuthenticationFilter.class);
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
        admin = mock(User.class);
        given(admin.getId()).willReturn(1L);
        given(admin.getEmail()).willReturn("admin@alex.example");
        given(admin.getRole()).willReturn(UserRole.ADMIN);
        given(admin.isValidPassword(anyString())).willReturn(true);

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
