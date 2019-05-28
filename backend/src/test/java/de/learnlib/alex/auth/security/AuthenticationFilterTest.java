/*
 * Copyright 2015 - 2019 TU Dortmund
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

package de.learnlib.alex.auth.security;

import de.learnlib.alex.auth.dao.UserDAO;
import de.learnlib.alex.auth.entities.User;
import de.learnlib.alex.auth.entities.UserRole;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import javax.ws.rs.container.ContainerRequestContext;

@RunWith(MockitoJUnitRunner.class)
public class AuthenticationFilterTest {

    private static final String INVALID_JWT = "Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJBTEVYIiwianRpIjoiNmFYVkJfeGxYWVgz"
            + "dkdaazlzTFpIUSIsImlkIjoxLCJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImFkbWluQGFsZXguZXhhbXBsZSJ9.Pc5KJRX_xh_NRRQb2AQ"
            + "838mLFcreOwMh8w0Poj9nBD-NiI8bQGVlZHyFWXU3AxcDZtHRmf-_0LOoIu6MyqipEjCdSXr9ustmGD1Do_Lf0u5zKPSQHvB85vGHuDI"
            + "02PmF5OSyAhOuO56x5_eHW3JC0xl6LuC6JWc13ux6_WjUF9fxvePAa62nq_mRJF4Fb8_gMjWcGVXkoANQdXm0ZtlJw2Z7DnKFSdzDtBQ"
            + "wXt8gCCZXZzTbl50Ra6Zfb011v98BSjRuUXMr_PZ86YmkDOaT5nn9SKIWJWSFr-LkRTb03mTbQjTOW9LEbGWHCaTeAlnMFLnNxzDdbnD"
            + "ix3j5x4YMog";

    private static final Long USER_ID = 1L;

    @Mock
    private UserDAO userDAO;

    private AuthenticationFilter authFilter;

    private User user;

    private String jwt;

    @Before
    public void before() throws Exception {
        this.authFilter = new AuthenticationFilter(userDAO);

        this.user = new User();
        this.user.setId(USER_ID);
        this.user.setEmail("admin@alex.example");
        this.user.setRole(UserRole.ADMIN);

        this.jwt = "Bearer " + JWTHelper.generateJWT(user);
    }

    @Test
    public void shouldSetTheCorrectSecurityContext() throws Exception {
        final ContainerRequestContext ctx = Mockito.mock(ContainerRequestContext.class);
        Mockito.when(ctx.getHeaderString("Authorization")).thenReturn(jwt);
        Mockito.when(userDAO.getById(USER_ID)).thenReturn(user);

        authFilter.filter(ctx);
        Mockito.verify(ctx).setSecurityContext(Mockito.any());
    }

    @Test
    public void shouldAbortWhenJwtIsInvalid() throws Exception {
        final ContainerRequestContext ctx = Mockito.mock(ContainerRequestContext.class);
        Mockito.when(ctx.getHeaderString("Authorization")).thenReturn(INVALID_JWT);

        authFilter.filter(ctx);
        Mockito.verify(ctx).abortWith(Mockito.any());
    }
}
